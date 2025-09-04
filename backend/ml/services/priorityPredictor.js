const natural = require('natural');

class PriorityPredictor {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.initializePriorityRules();
  }

  initializePriorityRules() {
    // Priority scoring rules
    this.priorityRules = {
      // Category weights (higher = more priority)
      categoryWeights: {
        'Food Issues': 3,      // Health-related, high priority
        'Leave Permission': 2,  // Time-sensitive
        'Teaching Issues': 4,   // Academic impact
        'Others': 1            // General issues
      },

      // Urgency keywords with weights
      urgencyKeywords: {
        'emergency': 5,
        'urgent': 4,
        'critical': 4,
        'immediate': 3,
        'asap': 3,
        'now': 2,
        'quickly': 2,
        'fast': 1
      },

      // Sentiment impact on priority
      sentimentImpact: {
        'very_negative': 3,
        'negative': 2,
        'neutral': 1,
        'positive': 0,
        'very_positive': 0
      },

      // Time-based factors
      timeFactors: {
        'exam': 4,
        'deadline': 3,
        'assignment': 2,
        'class': 2,
        'semester': 1
      }
    };
  }

  predictPriority(issueData) {
    const {
      title = '',
      description = '',
      category = '',
      sentiment = 'neutral',
      urgency = 'low',
      studentId = null
    } = issueData;

    let priorityScore = 0;
    const factors = {};

    // 1. Category-based priority
    const categoryWeight = this.priorityRules.categoryWeights[category] || 1;
    priorityScore += categoryWeight * 2;
    factors.category = categoryWeight;

    // 2. Urgency detection
    const urgencyScore = this.calculateUrgencyScore(title + ' ' + description);
    priorityScore += urgencyScore;
    factors.urgency = urgencyScore;

    // 3. Sentiment impact
    const sentimentWeight = this.priorityRules.sentimentImpact[sentiment] || 1;
    priorityScore += sentimentWeight;
    factors.sentiment = sentimentWeight;

    // 4. Text length (longer descriptions might indicate more serious issues)
    const lengthScore = this.calculateLengthScore(description);
    priorityScore += lengthScore;
    factors.length = lengthScore;

    // 5. Keyword analysis
    const keywordScore = this.analyzeKeywords(title + ' ' + description);
    priorityScore += keywordScore;
    factors.keywords = keywordScore;

    // 6. Time sensitivity
    const timeScore = this.detectTimeSensitivity(title + ' ' + description);
    priorityScore += timeScore;
    factors.timeSensitivity = timeScore;

    // 7. Student history (if available)
    if (studentId) {
      const historyScore = this.analyzeStudentHistory(studentId);
      priorityScore += historyScore;
      factors.studentHistory = historyScore;
    }

    // Normalize and categorize priority
    const normalizedScore = Math.min(Math.max(priorityScore, 1), 10);
    const priorityLevel = this.categorizePriority(normalizedScore);

    return {
      priorityLevel,
      score: normalizedScore,
      factors,
      confidence: this.calculateConfidence(factors),
      recommendations: this.generateRecommendations(priorityLevel, factors)
    };
  }

  calculateUrgencyScore(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    let urgencyScore = 0;

    words.forEach(word => {
      if (this.priorityRules.urgencyKeywords[word]) {
        urgencyScore += this.priorityRules.urgencyKeywords[word];
      }
    });

    return Math.min(urgencyScore, 5);
  }

  calculateLengthScore(description) {
    const length = description.length;
    if (length > 200) return 2;
    if (length > 100) return 1;
    if (length > 50) return 0.5;
    return 0;
  }

  analyzeKeywords(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    let keywordScore = 0;

    // Check for important keywords
    const importantKeywords = {
      'exam': 3,
      'assignment': 2,
      'deadline': 3,
      'grade': 2,
      'fail': 3,
      'sick': 2,
      'health': 2,
      'emergency': 4,
      'urgent': 3,
      'critical': 3
    };

    words.forEach(word => {
      if (importantKeywords[word]) {
        keywordScore += importantKeywords[word];
      }
    });

    return Math.min(keywordScore, 5);
  }

  detectTimeSensitivity(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    let timeScore = 0;

    words.forEach(word => {
      if (this.priorityRules.timeFactors[word]) {
        timeScore += this.priorityRules.timeFactors[word];
      }
    });

    return Math.min(timeScore, 4);
  }

  analyzeStudentHistory(studentId) {
    // This would typically query the database for student's issue history
    // For now, return a default score
    // In a real implementation, you'd analyze:
    // - Number of previous issues
    // - Resolution time of previous issues
    // - Student's academic standing
    // - Previous urgent issues
    return 0;
  }

  categorizePriority(score) {
    if (score >= 8) return 'critical';
    if (score >= 6) return 'high';
    if (score >= 4) return 'medium';
    return 'low';
  }

  calculateConfidence(factors) {
    let confidence = 50; // Base confidence

    // Higher confidence if multiple factors agree
    const factorCount = Object.keys(factors).length;
    if (factorCount > 3) confidence += 20;
    if (factorCount > 5) confidence += 10;

    // Higher confidence if urgency is detected
    if (factors.urgency > 2) confidence += 15;

    // Higher confidence if sentiment is strongly negative
    if (factors.sentiment > 2) confidence += 10;

    return Math.min(confidence, 95);
  }

  generateRecommendations(priorityLevel, factors) {
    const recommendations = [];

    if (priorityLevel === 'critical') {
      recommendations.push('Immediate attention required');
      recommendations.push('Consider escalating to senior admin');
      recommendations.push('Send urgent notification');
    } else if (priorityLevel === 'high') {
      recommendations.push('Address within 24 hours');
      recommendations.push('Send priority notification');
    } else if (priorityLevel === 'medium') {
      recommendations.push('Address within 48 hours');
      recommendations.push('Standard processing');
    } else {
      recommendations.push('Address within 1 week');
      recommendations.push('Routine processing');
    }

    // Category-specific recommendations
    if (factors.category >= 3) {
      recommendations.push('Category indicates high impact');
    }

    if (factors.urgency > 2) {
      recommendations.push('High urgency detected - expedite processing');
    }

    return recommendations;
  }

  // Batch priority prediction
  predictBatchPriorities(issues) {
    return issues.map(issue => ({
      issueId: issue._id,
      prediction: this.predictPriority(issue)
    }));
  }

  // Get priority distribution
  getPriorityDistribution(issues) {
    const distribution = {
      critical: 0,
      high: 0,
      medium: 0,
      low: 0
    };

    issues.forEach(issue => {
      const prediction = this.predictPriority(issue);
      distribution[prediction.priorityLevel]++;
    });

    return distribution;
  }

  // Update priority based on new information
  updatePriority(originalPrediction, newData) {
    const updatedData = {
      ...originalPrediction,
      ...newData
    };

    return this.predictPriority(updatedData);
  }
}

module.exports = PriorityPredictor;
