const natural = require('natural');
const Sentiment = require('sentiment');

class SentimentAnalyzer {
  constructor() {
    this.sentiment = new Sentiment();
    this.tokenizer = new natural.WordTokenizer();
    this.initializeCustomDictionary();
  }

  initializeCustomDictionary() {
    // Custom dictionary for college-specific terms
    this.customDictionary = {
      // Negative terms (increase negative sentiment)
      'terrible': -3,
      'awful': -3,
      'horrible': -3,
      'disgusting': -3,
      'unacceptable': -2,
      'frustrated': -2,
      'annoyed': -2,
      'disappointed': -2,
      'worried': -1,
      'concerned': -1,
      
      // Positive terms (increase positive sentiment)
      'excellent': 3,
      'amazing': 3,
      'wonderful': 3,
      'great': 2,
      'good': 1,
      'satisfied': 2,
      'happy': 2,
      'pleased': 2,
      'helpful': 1,
      'supportive': 1,
      
      // Urgency indicators
      'urgent': -2,
      'emergency': -3,
      'critical': -3,
      'immediate': -2,
      'asap': -2,
      'now': -1
    };
  }

  analyzeSentiment(text) {
    if (!text || typeof text !== 'string') {
      return {
        score: 0,
        sentiment: 'neutral',
        intensity: 'low',
        emotions: [],
        urgency: 'low'
      };
    }

    // Analyze with custom dictionary
    const result = this.sentiment.analyze(text);
    
    // Apply custom dictionary
    const customScore = this.applyCustomDictionary(text);
    const finalScore = result.score + customScore;

    return {
      score: finalScore,
      sentiment: this.getSentimentLabel(finalScore),
      intensity: this.getIntensityLevel(Math.abs(finalScore)),
      emotions: this.extractEmotions(text),
      urgency: this.detectUrgency(text),
      keywords: this.extractKeywords(text),
      confidence: this.calculateConfidence(text, finalScore)
    };
  }

  applyCustomDictionary(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    let customScore = 0;
    
    words.forEach(word => {
      if (this.customDictionary[word]) {
        customScore += this.customDictionary[word];
      }
    });
    
    return customScore;
  }

  getSentimentLabel(score) {
    if (score > 2) return 'very_positive';
    if (score > 0) return 'positive';
    if (score < -2) return 'very_negative';
    if (score < 0) return 'negative';
    return 'neutral';
  }

  getIntensityLevel(score) {
    if (score > 5) return 'very_high';
    if (score > 3) return 'high';
    if (score > 1) return 'medium';
    return 'low';
  }

  extractEmotions(text) {
    const emotions = [];
    const words = this.tokenizer.tokenize(text.toLowerCase());
    
    const emotionKeywords = {
      'frustrated': 'frustration',
      'angry': 'anger',
      'sad': 'sadness',
      'worried': 'worry',
      'excited': 'excitement',
      'happy': 'happiness',
      'satisfied': 'satisfaction',
      'disappointed': 'disappointment',
      'confused': 'confusion',
      'urgent': 'urgency'
    };

    words.forEach(word => {
      if (emotionKeywords[word]) {
        emotions.push(emotionKeywords[word]);
      }
    });

    return [...new Set(emotions)]; // Remove duplicates
  }

  detectUrgency(text) {
    const urgencyKeywords = [
      'urgent', 'emergency', 'critical', 'immediate', 'asap', 'now',
      'right away', 'quickly', 'fast', 'hurry', 'rush'
    ];
    
    const words = this.tokenizer.tokenize(text.toLowerCase());
    const urgencyCount = words.filter(word => 
      urgencyKeywords.includes(word)
    ).length;
    
    if (urgencyCount >= 3) return 'very_high';
    if (urgencyCount >= 2) return 'high';
    if (urgencyCount >= 1) return 'medium';
    return 'low';
  }

  extractKeywords(text) {
    const words = this.tokenizer.tokenize(text.toLowerCase());
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can'];
    
    return words
      .filter(word => 
        word.length > 2 && 
        !stopWords.includes(word) && 
        /^[a-zA-Z]+$/.test(word)
      )
      .slice(0, 5);
  }

  calculateConfidence(text, score) {
    // Confidence based on text length and score magnitude
    const length = text.length;
    const scoreMagnitude = Math.abs(score);
    
    let confidence = 50; // Base confidence
    
    // Adjust based on text length
    if (length > 100) confidence += 20;
    else if (length > 50) confidence += 10;
    else confidence -= 10;
    
    // Adjust based on score magnitude
    if (scoreMagnitude > 5) confidence += 20;
    else if (scoreMagnitude > 2) confidence += 10;
    
    return Math.min(confidence, 95);
  }

  // Batch analysis for multiple texts
  analyzeBatch(texts) {
    return texts.map(text => ({
      text: text,
      analysis: this.analyzeSentiment(text)
    }));
  }

  // Get sentiment trends over time
  getSentimentTrends(issues) {
    const trends = {
      positive: 0,
      negative: 0,
      neutral: 0,
      averageScore: 0,
      urgencyLevels: {
        low: 0,
        medium: 0,
        high: 0,
        very_high: 0
      }
    };

    let totalScore = 0;
    
    issues.forEach(issue => {
      const analysis = this.analyzeSentiment(issue.description);
      totalScore += analysis.score;
      
      trends[analysis.sentiment]++;
      trends.urgencyLevels[analysis.urgency]++;
    });

    trends.averageScore = totalScore / issues.length;
    
    return trends;
  }
}

module.exports = SentimentAnalyzer;
