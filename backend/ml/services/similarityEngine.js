const natural = require('natural');
const stringSimilarity = require('string-similarity');

class SimilarityEngine {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.tfidf = new natural.TfIdf();
    this.similarityThreshold = 0.7; // 70% similarity threshold
  }

  // Find similar issues
  findSimilarIssues(newIssue, existingIssues, threshold = this.similarityThreshold) {
    const similarities = [];

    existingIssues.forEach(issue => {
      const similarity = this.calculateSimilarity(newIssue, issue);
      
      if (similarity.score >= threshold) {
        similarities.push({
          issueId: issue._id,
          issue: issue,
          similarity: similarity.score,
          matchType: similarity.matchType,
          commonKeywords: similarity.commonKeywords,
          confidence: similarity.confidence
        });
      }
    });

    // Sort by similarity score (highest first)
    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      similarIssues: similarities,
      hasDuplicates: similarities.length > 0,
      duplicateCount: similarities.length,
      highestSimilarity: similarities.length > 0 ? similarities[0].similarity : 0
    };
  }

  calculateSimilarity(issue1, issue2) {
    const text1 = `${issue1.title} ${issue1.description}`.toLowerCase();
    const text2 = `${issue2.title} ${issue2.description}`.toLowerCase();

    // Multiple similarity metrics
    const exactMatch = this.checkExactMatch(text1, text2);
    const fuzzyMatch = this.calculateFuzzySimilarity(text1, text2);
    const keywordMatch = this.calculateKeywordSimilarity(text1, text2);
    const categoryMatch = issue1.category === issue2.category ? 1 : 0;

    // Weighted combination
    const weightedScore = (
      exactMatch * 0.4 +
      fuzzyMatch * 0.3 +
      keywordMatch * 0.2 +
      categoryMatch * 0.1
    );

    const matchType = this.determineMatchType(exactMatch, fuzzyMatch, keywordMatch);
    const commonKeywords = this.findCommonKeywords(text1, text2);
    const confidence = this.calculateConfidence(exactMatch, fuzzyMatch, keywordMatch);

    return {
      score: weightedScore,
      matchType,
      commonKeywords,
      confidence,
      metrics: {
        exactMatch,
        fuzzyMatch,
        keywordMatch,
        categoryMatch
      }
    };
  }

  checkExactMatch(text1, text2) {
    // Check for exact or near-exact matches
    const words1 = this.tokenizer.tokenize(text1);
    const words2 = this.tokenizer.tokenize(text2);

    if (words1.length === 0 || words2.length === 0) return 0;

    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);

    return commonWords.length / totalWords;
  }

  calculateFuzzySimilarity(text1, text2) {
    // Use string similarity library for fuzzy matching
    return stringSimilarity.compareTwoStrings(text1, text2);
  }

  calculateKeywordSimilarity(text1, text2) {
    const keywords1 = this.extractKeywords(text1);
    const keywords2 = this.extractKeywords(text2);

    if (keywords1.length === 0 || keywords2.length === 0) return 0;

    const commonKeywords = keywords1.filter(keyword => 
      keywords2.includes(keyword)
    );

    const totalKeywords = Math.max(keywords1.length, keywords2.length);
    return commonKeywords.length / totalKeywords;
  }

  extractKeywords(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    const stopWords = [
      'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 
      'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
      'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
      'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those'
    ];

    return words
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) && 
        /^[a-zA-Z]+$/.test(word)
      )
      .slice(0, 10); // Top 10 keywords
  }

  findCommonKeywords(text1, text2) {
    const keywords1 = this.extractKeywords(text1);
    const keywords2 = this.extractKeywords(text2);

    return keywords1.filter(keyword => keywords2.includes(keyword));
  }

  determineMatchType(exactMatch, fuzzyMatch, keywordMatch) {
    if (exactMatch > 0.8) return 'exact';
    if (fuzzyMatch > 0.8) return 'very_similar';
    if (keywordMatch > 0.6) return 'keyword_match';
    if (fuzzyMatch > 0.6) return 'similar';
    return 'partial';
  }

  calculateConfidence(exactMatch, fuzzyMatch, keywordMatch) {
    let confidence = 50; // Base confidence

    // Higher confidence for exact matches
    if (exactMatch > 0.8) confidence += 30;
    else if (exactMatch > 0.6) confidence += 20;
    else if (exactMatch > 0.4) confidence += 10;

    // Higher confidence for fuzzy matches
    if (fuzzyMatch > 0.8) confidence += 20;
    else if (fuzzyMatch > 0.6) confidence += 15;
    else if (fuzzyMatch > 0.4) confidence += 10;

    // Higher confidence for keyword matches
    if (keywordMatch > 0.6) confidence += 15;
    else if (keywordMatch > 0.4) confidence += 10;

    return Math.min(confidence, 95);
  }

  // Group similar issues together
  groupSimilarIssues(issues, threshold = this.similarityThreshold) {
    const groups = [];
    const processed = new Set();

    issues.forEach((issue, index) => {
      if (processed.has(index)) return;

      const group = [issue];
      processed.add(index);

      // Find all similar issues
      for (let j = index + 1; j < issues.length; j++) {
        if (processed.has(j)) continue;

        const similarity = this.calculateSimilarity(issue, issues[j]);
        if (similarity.score >= threshold) {
          group.push(issues[j]);
          processed.add(j);
        }
      }

      if (group.length > 1) {
        groups.push({
          groupId: `group_${groups.length}`,
          issues: group,
          representativeIssue: this.findRepresentativeIssue(group),
          similarityScore: this.calculateGroupSimilarity(group)
        });
      }
    });

    return groups;
  }

  findRepresentativeIssue(issues) {
    // Find the issue that best represents the group
    let bestIssue = issues[0];
    let bestScore = 0;

    issues.forEach(issue => {
      const avgSimilarity = issues.reduce((sum, otherIssue) => {
        if (issue._id === otherIssue._id) return sum;
        return sum + this.calculateSimilarity(issue, otherIssue).score;
      }, 0) / (issues.length - 1);

      if (avgSimilarity > bestScore) {
        bestScore = avgSimilarity;
        bestIssue = issue;
      }
    });

    return bestIssue;
  }

  calculateGroupSimilarity(issues) {
    if (issues.length < 2) return 1;

    let totalSimilarity = 0;
    let comparisonCount = 0;

    for (let i = 0; i < issues.length; i++) {
      for (let j = i + 1; j < issues.length; j++) {
        totalSimilarity += this.calculateSimilarity(issues[i], issues[j]).score;
        comparisonCount++;
      }
    }

    return totalSimilarity / comparisonCount;
  }

  // Suggest merge for similar issues
  suggestMerge(issue1, issue2) {
    const similarity = this.calculateSimilarity(issue1, issue2);
    
    if (similarity.score < this.similarityThreshold) {
      return null;
    }

    return {
      shouldMerge: similarity.score > 0.8,
      confidence: similarity.confidence,
      mergeStrategy: this.suggestMergeStrategy(issue1, issue2, similarity),
      mergedIssue: this.createMergedIssue(issue1, issue2, similarity)
    };
  }

  suggestMergeStrategy(issue1, issue2, similarity) {
    if (similarity.matchType === 'exact') {
      return 'merge_as_duplicate';
    } else if (similarity.matchType === 'very_similar') {
      return 'merge_with_combined_description';
    } else {
      return 'link_as_related';
    }
  }

  createMergedIssue(issue1, issue2, similarity) {
    const mergedIssue = {
      title: issue1.title.length > issue2.title.length ? issue1.title : issue2.title,
      description: this.mergeDescriptions(issue1.description, issue2.description),
      category: issue1.category,
      status: this.determineMergedStatus(issue1.status, issue2.status),
      studentId: issue1.studentId,
      createdAt: new Date(Math.min(new Date(issue1.createdAt), new Date(issue2.createdAt))),
      mergedFrom: [issue1._id, issue2._id],
      mergeConfidence: similarity.confidence
    };

    return mergedIssue;
  }

  mergeDescriptions(desc1, desc2) {
    const words1 = this.tokenizer.tokenize(desc1.toLowerCase());
    const words2 = this.tokenizer.tokenize(desc2.toLowerCase());
    
    // Combine unique information
    const uniqueWords = [...new Set([...words1, ...words2])];
    
    return `${desc1}\n\n--- Merged with related issue ---\n\n${desc2}`;
  }

  determineMergedStatus(status1, status2) {
    const statusPriority = {
      'Resolved': 4,
      'Approved': 3,
      'Pending': 2,
      'Rejected': 1
    };

    return statusPriority[status1] > statusPriority[status2] ? status1 : status2;
  }

  // Update similarity threshold
  updateThreshold(newThreshold) {
    this.similarityThreshold = Math.max(0.1, Math.min(0.9, newThreshold));
  }

  // Get similarity statistics
  getSimilarityStats(issues) {
    const similarities = [];
    
    for (let i = 0; i < issues.length; i++) {
      for (let j = i + 1; j < issues.length; j++) {
        const similarity = this.calculateSimilarity(issues[i], issues[j]);
        similarities.push(similarity.score);
      }
    }

    if (similarities.length === 0) {
      return {
        averageSimilarity: 0,
        maxSimilarity: 0,
        minSimilarity: 0,
        duplicateCount: 0
      };
    }

    const averageSimilarity = similarities.reduce((a, b) => a + b, 0) / similarities.length;
    const maxSimilarity = Math.max(...similarities);
    const minSimilarity = Math.min(...similarities);
    const duplicateCount = similarities.filter(s => s >= this.similarityThreshold).length;

    return {
      averageSimilarity,
      maxSimilarity,
      minSimilarity,
      duplicateCount
    };
  }
}

module.exports = SimilarityEngine;
