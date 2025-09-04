const IssueClassifier = require('../issueClassifier');
const SentimentAnalyzer = require('./sentimentAnalyzer');
const PriorityPredictor = require('./priorityPredictor');
const SimilarityEngine = require('./similarityEngine');

class MLOrchestrator {
  constructor() {
    this.issueClassifier = new IssueClassifier();
    this.sentimentAnalyzer = new SentimentAnalyzer();
    this.priorityPredictor = new PriorityPredictor();
    this.similarityEngine = new SimilarityEngine();
  }

  // Main method to analyze a new issue
  async analyzeNewIssue(issueData, existingIssues = []) {
    try {
      const analysis = {
        issueId: issueData._id || 'new',
        timestamp: new Date(),
        classification: null,
        sentiment: null,
        priority: null,
        similarity: null,
        recommendations: [],
        confidence: 0
      };

      // 1. Classify the issue
      const classification = this.issueClassifier.classifyIssue(
        issueData.title, 
        issueData.description
      );
      analysis.classification = classification;

      // 2. Analyze sentiment
      const sentiment = this.sentimentAnalyzer.analyzeSentiment(
        issueData.description
      );
      analysis.sentiment = sentiment;

      // 3. Predict priority
      const priorityData = {
        ...issueData,
        sentiment: sentiment.sentiment,
        urgency: sentiment.urgency
      };
      const priority = this.priorityPredictor.predictPriority(priorityData);
      analysis.priority = priority;

      // 4. Check for similar issues
      if (existingIssues.length > 0) {
        const similarity = this.similarityEngine.findSimilarIssues(
          issueData, 
          existingIssues
        );
        analysis.similarity = similarity;
      }

      // 5. Generate comprehensive recommendations
      analysis.recommendations = this.generateRecommendations(analysis);

      // 6. Calculate overall confidence
      analysis.confidence = this.calculateOverallConfidence(analysis);

      return analysis;
    } catch (error) {
      console.error('ML Analysis Error:', error);
      return {
        error: 'ML analysis failed',
        message: error.message,
        timestamp: new Date()
      };
    }
  }

  // Generate comprehensive recommendations
  generateRecommendations(analysis) {
    const recommendations = [];

    // Classification recommendations
    if (analysis.classification) {
      if (analysis.classification.confidence > 80) {
        recommendations.push({
          type: 'auto_categorize',
          message: `Auto-categorize as "${analysis.classification.category}" (${analysis.classification.confidence.toFixed(1)}% confidence)`,
          priority: 'high'
        });
      } else if (analysis.classification.confidence > 60) {
        recommendations.push({
          type: 'suggest_category',
          message: `Consider categorizing as "${analysis.classification.category}" (${analysis.classification.confidence.toFixed(1)}% confidence)`,
          priority: 'medium'
        });
      }
    }

    // Sentiment-based recommendations
    if (analysis.sentiment) {
      if (analysis.sentiment.urgency === 'very_high') {
        recommendations.push({
          type: 'urgent_response',
          message: 'Issue marked as very urgent - respond immediately',
          priority: 'critical'
        });
      } else if (analysis.sentiment.sentiment === 'very_negative') {
        recommendations.push({
          type: 'emotional_support',
          message: 'Student appears very frustrated - consider empathetic response',
          priority: 'high'
        });
      }
    }

    // Priority-based recommendations
    if (analysis.priority) {
      recommendations.push({
        type: 'priority_action',
        message: `Predicted priority: ${analysis.priority.priorityLevel.toUpperCase()}`,
        priority: analysis.priority.priorityLevel === 'critical' ? 'critical' : 'medium'
      });

      // Add specific recommendations
      analysis.priority.recommendations.forEach(rec => {
        recommendations.push({
          type: 'priority_recommendation',
          message: rec,
          priority: 'medium'
        });
      });
    }

    // Similarity-based recommendations
    if (analysis.similarity && analysis.similarity.hasDuplicates) {
      if (analysis.similarity.highestSimilarity > 0.9) {
        recommendations.push({
          type: 'duplicate_warning',
          message: `Potential duplicate detected (${(analysis.similarity.highestSimilarity * 100).toFixed(1)}% similar)`,
          priority: 'high'
        });
      } else if (analysis.similarity.highestSimilarity > 0.7) {
        recommendations.push({
          type: 'similar_issue',
          message: `Similar issue found (${(analysis.similarity.highestSimilarity * 100).toFixed(1)}% similar) - consider linking`,
          priority: 'medium'
        });
      }
    }

    // Sort recommendations by priority
    const priorityOrder = { 'critical': 4, 'high': 3, 'medium': 2, 'low': 1 };
    recommendations.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]);

    return recommendations;
  }

  // Calculate overall confidence
  calculateOverallConfidence(analysis) {
    let totalConfidence = 0;
    let weightSum = 0;

    // Classification confidence (weight: 0.3)
    if (analysis.classification) {
      totalConfidence += analysis.classification.confidence * 0.3;
      weightSum += 0.3;
    }

    // Sentiment confidence (weight: 0.2)
    if (analysis.sentiment) {
      totalConfidence += analysis.sentiment.confidence * 0.2;
      weightSum += 0.2;
    }

    // Priority confidence (weight: 0.3)
    if (analysis.priority) {
      totalConfidence += analysis.priority.confidence * 0.3;
      weightSum += 0.3;
    }

    // Similarity confidence (weight: 0.2)
    if (analysis.similarity && analysis.similarity.similarIssues.length > 0) {
      const avgSimilarityConfidence = analysis.similarity.similarIssues.reduce(
        (sum, item) => sum + item.confidence, 0
      ) / analysis.similarity.similarIssues.length;
      totalConfidence += avgSimilarityConfidence * 0.2;
      weightSum += 0.2;
    }

    return weightSum > 0 ? totalConfidence / weightSum : 0;
  }

  // Batch analysis for multiple issues
  async analyzeBatch(issues) {
    const results = [];
    
    for (const issue of issues) {
      const analysis = await this.analyzeNewIssue(issue, issues.filter(i => i._id !== issue._id));
      results.push(analysis);
    }

    return results;
  }

  // Get ML insights and trends
  async getMLInsights(issues) {
    const insights = {
      totalIssues: issues.length,
      classificationDistribution: {},
      sentimentTrends: {},
      priorityDistribution: {},
      similarityStats: {},
      recommendations: []
    };

    if (issues.length === 0) return insights;

    // Classification distribution
    issues.forEach(issue => {
      const classification = this.issueClassifier.classifyIssue(issue.title, issue.description);
      insights.classificationDistribution[classification.category] = 
        (insights.classificationDistribution[classification.category] || 0) + 1;
    });

    // Sentiment trends
    const sentimentAnalysis = this.sentimentAnalyzer.getSentimentTrends(issues);
    insights.sentimentTrends = sentimentAnalysis;

    // Priority distribution
    const priorityDistribution = this.priorityPredictor.getPriorityDistribution(issues);
    insights.priorityDistribution = priorityDistribution;

    // Similarity statistics
    const similarityStats = this.similarityEngine.getSimilarityStats(issues);
    insights.similarityStats = similarityStats;

    // Generate insights
    insights.recommendations = this.generateInsightRecommendations(insights);

    return insights;
  }

  // Generate insights-based recommendations
  generateInsightRecommendations(insights) {
    const recommendations = [];

    // Category-based insights
    const totalIssues = insights.totalIssues;
    Object.entries(insights.classificationDistribution).forEach(([category, count]) => {
      const percentage = (count / totalIssues) * 100;
      if (percentage > 40) {
        recommendations.push({
          type: 'category_trend',
          message: `${category} issues represent ${percentage.toFixed(1)}% of total issues - consider proactive measures`,
          priority: 'medium'
        });
      }
    });

    // Sentiment-based insights
    if (insights.sentimentTrends.negative > insights.sentimentTrends.positive) {
      recommendations.push({
        type: 'sentiment_trend',
        message: 'Negative sentiment is higher than positive - review response strategies',
        priority: 'high'
      });
    }

    // Priority-based insights
    if (insights.priorityDistribution.critical > 0) {
      recommendations.push({
        type: 'priority_alert',
        message: `${insights.priorityDistribution.critical} critical issues detected - review immediately`,
        priority: 'critical'
      });
    }

    // Similarity-based insights
    if (insights.similarityStats.duplicateCount > 0) {
      recommendations.push({
        type: 'duplicate_alert',
        message: `${insights.similarityStats.duplicateCount} potential duplicate issues detected`,
        priority: 'medium'
      });
    }

    return recommendations;
  }

  // Update ML models with feedback
  updateModelsWithFeedback(issueId, feedback) {
    // This would typically update the models based on user feedback
    // For now, we'll just log the feedback
    console.log(`ML Feedback for issue ${issueId}:`, feedback);
    
    return {
      success: true,
      message: 'Feedback recorded for model improvement',
      timestamp: new Date()
    };
  }

  // Get ML service status
  getServiceStatus() {
    return {
      services: {
        issueClassifier: 'active',
        sentimentAnalyzer: 'active',
        priorityPredictor: 'active',
        similarityEngine: 'active'
      },
      lastUpdate: new Date(),
      version: '1.0.0'
    };
  }
}

module.exports = MLOrchestrator;
