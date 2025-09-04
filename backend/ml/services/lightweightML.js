const _ = require('lodash');

class LightweightML {
  constructor() {
    this.initializeModels();
  }

  initializeModels() {
    // Lightweight keyword-based classification
    this.categoryKeywords = {
      'Academic': ['academic', 'study', 'course', 'lecture', 'assignment', 'exam', 'grade', 'learning', 'education', 'professor', 'teacher', 'class'],
      'Technical': ['technical', 'computer', 'software', 'hardware', 'internet', 'wifi', 'system', 'technology', 'digital', 'online', 'platform'],
      'Facility': ['facility', 'building', 'room', 'equipment', 'maintenance', 'repair', 'clean', 'hygiene', 'infrastructure', 'amenity'],
      'Administrative': ['administrative', 'admin', 'office', 'document', 'form', 'procedure', 'policy', 'bureaucracy', 'paperwork', 'official'],
      'Other': ['other', 'general', 'miscellaneous', 'unknown', 'personal', 'misc']
    };

    // Sentiment keywords
    this.sentimentKeywords = {
      positive: ['good', 'great', 'excellent', 'amazing', 'wonderful', 'satisfied', 'happy', 'pleased', 'helpful', 'supportive'],
      negative: ['bad', 'terrible', 'awful', 'horrible', 'disgusting', 'unacceptable', 'frustrated', 'annoyed', 'disappointed', 'worried'],
      urgent: ['urgent', 'emergency', 'critical', 'immediate', 'asap', 'now', 'quickly', 'fast', 'hurry', 'rush']
    };

    // Priority scoring
    this.priorityFactors = {
      category: { 'Academic': 4, 'Technical': 3, 'Facility': 2, 'Administrative': 3, 'Other': 1 },
      urgency: { 'very_high': 5, 'high': 3, 'medium': 2, 'low': 1 },
      sentiment: { 'very_negative': 3, 'negative': 2, 'neutral': 1, 'positive': 0 }
    };
  }

  // Fast text classification
  classifyIssue(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const scores = {};

    Object.entries(this.categoryKeywords).forEach(([category, keywords]) => {
      scores[category] = keywords.reduce((score, keyword) => {
        return score + (text.includes(keyword) ? 1 : 0);
      }, 0);
    });

    const bestCategory = _.maxBy(Object.entries(scores), ([, score]) => score);
    const confidence = Math.min((bestCategory[1] / 3) * 100, 95);

    return {
      category: bestCategory[0],
      confidence: confidence,
      scores: scores,
      suggestedKeywords: this.extractKeywords(text)
    };
  }

  // Lightweight sentiment analysis
  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return {
        score: 0,
        sentiment: 'neutral',
        intensity: 'low',
        urgency: 'low',
        keywords: [],
        confidence: 50
      };
    }

    const words = text.toLowerCase().split(/\s+/);
    let positiveScore = 0;
    let negativeScore = 0;
    let urgencyScore = 0;

    words.forEach(word => {
      if (this.sentimentKeywords.positive.includes(word)) positiveScore++;
      if (this.sentimentKeywords.negative.includes(word)) negativeScore++;
      if (this.sentimentKeywords.urgent.includes(word)) urgencyScore++;
    });

    const finalScore = positiveScore - negativeScore;
    const sentiment = this.getSentimentLabel(finalScore);
    const urgency = this.getUrgencyLevel(urgencyScore);

    return {
      score: finalScore,
      sentiment: sentiment,
      intensity: this.getIntensityLevel(Math.abs(finalScore)),
      urgency: urgency,
      keywords: this.extractKeywords(text),
      confidence: this.calculateConfidence(text, finalScore)
    };
  }

  // Fast priority prediction
  predictPriority(issueData) {
    const { title = '', description = '', category = '', sentiment = 'neutral', urgency = 'low' } = issueData;

    let priorityScore = 0;
    const factors = {};

    // Category weight
    const categoryWeight = this.priorityFactors.category[category] || 1;
    priorityScore += categoryWeight * 2;
    factors.category = categoryWeight;

    // Urgency weight
    const urgencyWeight = this.priorityFactors.urgency[urgency] || 1;
    priorityScore += urgencyWeight;
    factors.urgency = urgencyWeight;

    // Sentiment weight
    const sentimentWeight = this.priorityFactors.sentiment[sentiment] || 1;
    priorityScore += sentimentWeight;
    factors.sentiment = sentimentWeight;

    // Text length factor
    const lengthScore = Math.min(description.length / 100, 2);
    priorityScore += lengthScore;
    factors.length = lengthScore;

    // Normalize score
    const normalizedScore = Math.min(Math.max(priorityScore, 1), 10);
    const priorityLevel = this.categorizePriority(normalizedScore);

    return {
      priorityLevel,
      score: normalizedScore,
      factors,
      confidence: this.calculatePriorityConfidence(factors),
      recommendations: this.generateRecommendations(priorityLevel, factors)
    };
  }

  // Fast similarity detection
  findSimilarIssues(newIssue, existingIssues, threshold = 0.6) {
    const similarities = [];

    existingIssues.forEach(issue => {
      const similarity = this.calculateSimilarity(newIssue, issue);
      
      if (similarity.score >= threshold) {
        similarities.push({
          issueId: issue._id,
          issue: issue,
          similarity: similarity.score,
          confidence: similarity.confidence
        });
      }
    });

    similarities.sort((a, b) => b.similarity - a.similarity);

    return {
      similarIssues: similarities,
      hasDuplicates: similarities.length > 0,
      duplicateCount: similarities.length,
      highestSimilarity: similarities.length > 0 ? similarities[0].similarity : 0
    };
  }

  // Helper methods
  getSentimentLabel(score) {
    if (score > 2) return 'very_positive';
    if (score > 0) return 'positive';
    if (score < -2) return 'very_negative';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  getIntensityLevel(score) {
    if (score > 3) return 'very_high';
    if (score > 1) return 'high';
    return 'low';
  }

  getUrgencyLevel(urgencyScore) {
    if (urgencyScore >= 3) return 'very_high';
    if (urgencyScore >= 2) return 'high';
    if (urgencyScore >= 1) return 'medium';
    return 'low';
  }

  categorizePriority(score) {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  extractKeywords(text) {
    const words = text.toLowerCase().split(/\s+/);
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
    
    return words
      .filter(word => word.length > 2 && !stopWords.includes(word))
      .slice(0, 5);
  }

  calculateSimilarity(issue1, issue2) {
    const text1 = `${issue1.title} ${issue1.description}`.toLowerCase();
    const text2 = `${issue2.title} ${issue2.description}`.toLowerCase();

    const words1 = text1.split(/\s+/);
    const words2 = text2.split(/\s+/);

    const commonWords = words1.filter(word => words2.includes(word));
    const totalWords = Math.max(words1.length, words2.length);

    const similarity = totalWords > 0 ? commonWords.length / totalWords : 0;
    const confidence = Math.min(similarity * 100, 95);

    return { score: similarity, confidence };
  }

  calculateConfidence(text, score) {
    let confidence = 50;
    if (text.length > 50) confidence += 20;
    if (Math.abs(score) > 2) confidence += 20;
    return Math.min(confidence, 95);
  }

  calculatePriorityConfidence(factors) {
    let confidence = 50;
    const factorCount = Object.keys(factors).length;
    if (factorCount > 3) confidence += 20;
    if (factors.urgency > 2) confidence += 15;
    return Math.min(confidence, 95);
  }

  generateRecommendations(priorityLevel, factors) {
    const recommendations = [];

    if (priorityLevel === 'critical') {
      recommendations.push('Immediate attention required');
      recommendations.push('Consider escalating to senior admin');
    } else if (priorityLevel === 'high') {
      recommendations.push('Address within 24 hours');
      recommendations.push('Send priority notification');
    } else if (priorityLevel === 'medium') {
      recommendations.push('Address within 48 hours');
    } else {
      recommendations.push('Address within 1 week');
    }

    return recommendations;
  }

  // Batch processing for efficiency
  analyzeBatch(issues) {
    return issues.map(issue => ({
      issueId: issue._id,
      classification: this.classifyIssue(issue.title, issue.description),
      sentiment: this.analyzeSentiment(issue.description),
      priority: this.predictPriority(issue)
    }));
  }

  // Get insights efficiently
  getInsights(issues) {
    const insights = {
      totalIssues: issues.length,
      classificationDistribution: {},
      sentimentTrends: { positive: 0, negative: 0, neutral: 0 },
      priorityDistribution: { critical: 0, high: 0, medium: 0, low: 0 }
    };

    issues.forEach(issue => {
      const classification = this.classifyIssue(issue.title, issue.description);
      const sentiment = this.analyzeSentiment(issue.description);
      const priority = this.predictPriority(issue);

      insights.classificationDistribution[classification.category] = 
        (insights.classificationDistribution[classification.category] || 0) + 1;
      
      insights.sentimentTrends[sentiment.sentiment]++;
      insights.priorityDistribution[priority.priorityLevel]++;
    });

    return insights;
  }
}

module.exports = LightweightML;
