const natural = require('natural');
const tf = require('@tensorflow/tfjs-node');

class IssueClassifier {
  constructor() {
    this.tokenizer = new natural.WordTokenizer();
    this.classifier = new natural.BayesClassifier();
    this.initializeClassifier();
  }

  initializeClassifier() {
    // Training data for issue classification
    const trainingData = {
      'Food Issues': [
        'food quality is poor',
        'mess food is not good',
        'canteen food is cold',
        'food poisoning',
        'unhygienic food',
        'food taste is bad',
        'mess food complaints',
        'canteen food quality'
      ],
      'Leave Permission': [
        'need leave permission',
        'want to go home',
        'emergency leave',
        'sick leave application',
        'family function leave',
        'medical leave',
        'personal leave request',
        'urgent leave needed'
      ],
      'Teaching Issues': [
        'teacher not teaching properly',
        'class is boring',
        'difficult to understand',
        'teaching method is poor',
        'need better explanation',
        'teacher is not clear',
        'course material is hard',
        'teaching quality issues'
      ],
      'Others': [
        'general complaint',
        'other issues',
        'miscellaneous problem',
        'general feedback',
        'other concerns'
      ]
    };

    // Train the classifier
    Object.entries(trainingData).forEach(([category, texts]) => {
      texts.forEach(text => {
        this.classifier.addDocument(text.toLowerCase(), category);
      });
    });

    this.classifier.train();
  }

  classifyIssue(title, description) {
    const text = `${title} ${description}`.toLowerCase();
    const tokens = this.tokenizer.tokenize(text);
    
    // Get classification with confidence
    const classification = this.classifier.classify(text);
    const confidence = this.getConfidence(text, classification);
    
    return {
      category: classification,
      confidence: confidence,
      suggestedKeywords: this.extractKeywords(tokens)
    };
  }

  getConfidence(text, category) {
    // Simple confidence calculation based on word overlap
    const words = this.tokenizer.tokenize(text);
    const categoryWords = this.getCategoryWords(category);
    const overlap = words.filter(word => categoryWords.includes(word)).length;
    return Math.min(overlap / words.length * 100, 95);
  }

  getCategoryWords(category) {
    const categoryKeywords = {
      'Food Issues': ['food', 'mess', 'canteen', 'taste', 'quality', 'hygiene', 'poisoning', 'cold', 'bad'],
      'Leave Permission': ['leave', 'permission', 'home', 'emergency', 'sick', 'medical', 'family', 'urgent'],
      'Teaching Issues': ['teacher', 'teaching', 'class', 'course', 'understand', 'explanation', 'method', 'material'],
      'Others': ['general', 'other', 'miscellaneous', 'feedback', 'concern']
    };
    return categoryKeywords[category] || [];
  }

  extractKeywords(tokens) {
    // Extract important keywords from the text
    const stopWords = ['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were'];
    return tokens.filter(token => 
      token.length > 2 && 
      !stopWords.includes(token) && 
      /^[a-zA-Z]+$/.test(token)
    ).slice(0, 5);
  }

  // Advanced: Sentiment Analysis
  analyzeSentiment(text) {
    const sentiment = new natural.SentimentAnalyzer('English', natural.PorterStemmer, 'afinn');
    const tokens = this.tokenizer.tokenize(text);
    const score = sentiment.getSentiment(tokens);
    
    return {
      score: score,
      sentiment: score > 0 ? 'positive' : score < 0 ? 'negative' : 'neutral',
      intensity: Math.abs(score)
    };
  }
}

module.exports = IssueClassifier;
