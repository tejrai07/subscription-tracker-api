const axios = require('axios');

const API_URL = 'http://localhost:3000/subscriptions';

async function runTest() {
  try {
    console.log("🤖 1. Creating a Netflix Subscription ($15)...");
    
   
    const createResponse = await axios.post(API_URL, {
      name: "Netflix",
      cost: 15,
      frequency: "monthly"
    });
    
    const subId = createResponse.data._id;
    console.log(`✅ Created! ID: ${subId}`);
    console.log(`💰 Initial Cost Per Use: $${createResponse.data.costPerUse}`);

    console.log("\n------------------------------------------------\n");

    console.log("🤖 2. Logging Usage (Watching a Movie)...");
    
    
    await axios.post(`${API_URL}/${subId}/log`); 
    await axios.post(`${API_URL}/${subId}/log`); 
    await axios.post(`${API_URL}/${subId}/log`); 

    console.log("✅ Usage logged 3 times!");

    console.log("\n------------------------------------------------\n");

    console.log("🤖 3. Checking the 'Smart' Math...");
    
   
    const finalResponse = await axios.get(API_URL);
    
    const mySub = finalResponse.data.find(s => s._id === subId);

    console.log(`📅 Total Uses: ${mySub.usageHistory.length}`);
    console.log(`💸 NEW Cost Per Use: $${mySub.costPerUse}`); 

  } catch (error) {
    console.error("❌ Error:", error.response ? error.response.data : error.message);
  }
}

runTest();