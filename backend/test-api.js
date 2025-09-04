const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api';

// Test data
const testUser = {
  email: 'test@example.com',
  registrationNumber: 'TEST001',
  name: 'Test User',
  phone: '1234567890',
  password: 'password123'
};

const testIssue = {
  title: 'Test Issue',
  description: 'This is a test issue for API testing',
  category: 'Others'
};

let authToken = '';

// Test functions
const testServerConnection = async () => {
  try {
    console.log('🔍 Testing server connection...');
    const response = await axios.get('http://localhost:5000');
    console.log('✅ Server is running:', response.data);
    return true;
  } catch (error) {
    console.log('❌ Server connection failed:', error.message);
    return false;
  }
};

const testRegistration = async () => {
  try {
    console.log('\n🔍 Testing user registration...');
    const response = await axios.post(`${BASE_URL}/auth/register`, testUser);
    console.log('✅ Registration successful:', response.data.message);
    return true;
  } catch (error) {
    if (error.response?.status === 400 && error.response.data.message.includes('already')) {
      console.log('✅ User already exists (expected for testing)');
      return true;
    }
    console.log('❌ Registration failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testLogin = async () => {
  try {
    console.log('\n🔍 Testing user login...');
    const response = await axios.post(`${BASE_URL}/auth/login`, {
      email: testUser.email,
      password: testUser.password
    });
    authToken = response.data.token;
    console.log('✅ Login successful:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Login failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetCurrentUser = async () => {
  try {
    console.log('\n🔍 Testing get current user...');
    const response = await axios.get(`${BASE_URL}/auth/user`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get current user successful:', response.data.user.name);
    return true;
  } catch (error) {
    console.log('❌ Get current user failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testCreateIssue = async () => {
  try {
    console.log('\n🔍 Testing issue creation...');
    const response = await axios.post(`${BASE_URL}/issues`, testIssue, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Issue creation successful:', response.data.message);
    return response.data.issue._id;
  } catch (error) {
    console.log('❌ Issue creation failed:', error.response?.data?.message || error.message);
    return null;
  }
};

const testGetMyIssues = async () => {
  try {
    console.log('\n🔍 Testing get my issues...');
    const response = await axios.get(`${BASE_URL}/issues/my-issues`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get my issues successful:', response.data.issues.length, 'issues found');
    return true;
  } catch (error) {
    console.log('❌ Get my issues failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testMLAnalysis = async () => {
  try {
    console.log('\n🔍 Testing ML analysis...');
    const response = await axios.post(`${BASE_URL}/ml/analyze-issue`, {
      title: 'Food quality issue',
      description: 'The food in the cafeteria is not good quality and tastes bad',
      category: 'Food Issues'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ ML analysis successful:', response.data.analysis.classification.category);
    return true;
  } catch (error) {
    console.log('❌ ML analysis failed:', error.response?.data?.message || error.message);
    return false;
  }
};

const testGetIssueStats = async () => {
  try {
    console.log('\n🔍 Testing get issue stats...');
    const response = await axios.get(`${BASE_URL}/issues/stats`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    console.log('✅ Get issue stats successful');
    return true;
  } catch (error) {
    if (error.response?.status === 403) {
      console.log('✅ Get issue stats failed (expected - requires admin role)');
      return true;
    }
    console.log('❌ Get issue stats failed:', error.response?.data?.message || error.message);
    return false;
  }
};

// Main test function
const runAllTests = async () => {
  console.log('🚀 Starting API Tests...\n');
  
  const tests = [
    { name: 'Server Connection', test: testServerConnection },
    { name: 'User Registration', test: testRegistration },
    { name: 'User Login', test: testLogin },
    { name: 'Get Current User', test: testGetCurrentUser },
    { name: 'Create Issue', test: testCreateIssue },
    { name: 'Get My Issues', test: testGetMyIssues },
    { name: 'ML Analysis', test: testMLAnalysis },
    { name: 'Get Issue Stats', test: testGetIssueStats }
  ];

  let passedTests = 0;
  let totalTests = tests.length;

  for (const test of tests) {
    try {
      const result = await test.test();
      if (result) passedTests++;
    } catch (error) {
      console.log(`❌ ${test.name} failed with error:`, error.message);
    }
  }

  console.log('\n📊 Test Results:');
  console.log(`✅ Passed: ${passedTests}/${totalTests}`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Backend is working perfectly!');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the backend configuration.');
  }
};

// Run tests
runAllTests().catch(console.error);
