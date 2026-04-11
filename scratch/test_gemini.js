const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config({ path: "./backend/.env" });

async function testKey() {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    console.error("❌ No GEMINI_API_KEY found in backend/.env!");
    return;
  }

  console.log(`🔍 Testing key starting with: ${key.substring(0, 10)}...`);
  
  const genAI = new GoogleGenerativeAI(key);
  
  const models = ["gemini-1.5-flash", "gemini-pro"];
  
  for (const modelName of models) {
    console.log(`\n--- Testing Model: ${modelName} ---`);
    try {
      const model = genAI.getGenerativeModel({ model: modelName });
      const result = await model.generateContent("Hello!");
      console.log(`✅ SUCCESS for ${modelName}:`, result.response.text());
    } catch (error) {
      console.error(`❌ FAILED for ${modelName}:`, error.message);
    }
  }
}

testKey();
