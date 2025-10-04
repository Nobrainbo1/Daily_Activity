// API Connectivity Test Script
// Run this file with: node testApiConnectivity.js

const testEndpoints = async () => {
  const baseUrl = 'http://localhost:3000';
  
  console.log('🧪 Testing API Endpoints...\n');
  
  // Test 1: Health Check
  console.log('1️⃣ Testing Health Check Endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/health`);
    const data = await response.json();
    console.log('✅ Health Check:', data.status === 'healthy' ? 'PASSED' : 'FAILED');
    console.log('   Database:', data.database?.name || 'Not connected');
    console.log('   Status:', data.database?.status || 'Unknown');
  } catch (error) {
    console.log('❌ Health Check: FAILED');
    console.log('   Error:', error.message);
  }
  console.log('');
  
  // Test 2: Signup
  console.log('2️⃣ Testing Signup Endpoint...');
  const testUsername = `testuser_${Date.now()}`;
  let testUserId = null;
  try {
    const response = await fetch(`${baseUrl}/api/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test User',
        username: testUsername,
        password: 'testpass123'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Signup: PASSED');
      console.log('   User ID:', data.user._id);
      testUserId = data.user._id;
    } else {
      console.log('❌ Signup: FAILED');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Signup: FAILED');
    console.log('   Error:', error.message);
  }
  console.log('');
  
  // Test 3: Login
  console.log('3️⃣ Testing Login Endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        username: testUsername,
        password: 'testpass123'
      })
    });
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Login: PASSED');
      console.log('   User:', data.user.name);
    } else {
      console.log('❌ Login: FAILED');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Login: FAILED');
    console.log('   Error:', error.message);
  }
  console.log('');
  
  // Test 4: Get Activities
  console.log('4️⃣ Testing Get Activities Endpoint...');
  try {
    const response = await fetch(`${baseUrl}/api/activities`);
    const data = await response.json();
    if (response.ok) {
      console.log('✅ Get Activities: PASSED');
      console.log('   Activities found:', data.length);
      if (data.length === 0) {
        console.log('   ⚠️  Database is empty - run seedActivitiesWithSteps.js');
      }
    } else {
      console.log('❌ Get Activities: FAILED');
      console.log('   Error:', data.error);
    }
  } catch (error) {
    console.log('❌ Get Activities: FAILED');
    console.log('   Error:', error.message);
  }
  console.log('');
  
  // Test 5: Get User Activities
  if (testUserId) {
    console.log('5️⃣ Testing Get User Activities Endpoint...');
    try {
      const response = await fetch(`${baseUrl}/api/user-activities?userId=${testUserId}`);
      const data = await response.json();
      if (response.ok) {
        console.log('✅ Get User Activities: PASSED');
        console.log('   User activities:', data.length);
      } else {
        console.log('❌ Get User Activities: FAILED');
        console.log('   Error:', data.error);
      }
    } catch (error) {
      console.log('❌ Get User Activities: FAILED');
      console.log('   Error:', error.message);
    }
    console.log('');
  }
  
  console.log('🎯 Test Summary:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('All critical endpoints have been tested.');
  console.log('If any tests failed, check:');
  console.log('  1. Server is running (pnpm run dev)');
  console.log('  2. .env file has correct MongoDB URI');
  console.log('  3. MongoDB connection is successful');
  console.log('  4. Database is seeded (if activities test shows 0)');
  console.log('');
  console.log('✅ If all tests passed, your API is fully functional!');
};

// Run tests
testEndpoints().catch(console.error);
