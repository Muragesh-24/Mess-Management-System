const axios = require('axios');

const BASE_URL = 'https://mess-management-system-opsl.onrender.com/api';

async function testAPI() {
  try {
    console.log('🧪 Testing Mess Management API...\n');

    // Test 1: Seed data
    console.log('1️⃣ Seeding menu data...');
    const seedResponse = await axios.post(`${BASE_URL}/menus/seed`);
    console.log('✅ Seed Response:', seedResponse.data.message);

    // Test 2: Get Hall-1 menus
    console.log('\n2️⃣ Getting Hall-1 menus...');
    const hall1Response = await axios.get(`${BASE_URL}/menus/hall/Hall-1`);
    console.log(`✅ Found ${hall1Response.data.length} menu items for Hall-1`);

    // Test 3: Get specific menu
    console.log('\n3️⃣ Getting Monday breakfast for Hall-1...');
    const specificResponse = await axios.get(`${BASE_URL}/menus/hall/Hall-1/monday/breakfast`);
    console.log('✅ Monday Breakfast Items:', specificResponse.data.menuItems.regular);

    // Test 4: Get all halls
    console.log('\n4️⃣ Getting all halls overview...');
    const allHallsResponse = await axios.get(`${BASE_URL}/menus/all-halls`);
    const hallNames = Object.keys(allHallsResponse.data);
    console.log('✅ Available Halls:', hallNames);

    console.log('\n🎉 All tests passed! Your menu system is working correctly.');

  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testAPI();