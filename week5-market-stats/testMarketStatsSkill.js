// Quick test script for the Week 5 Market Statistics Skill

const { answerMarketQuestion, extractCity } = require("./marketStatsSkill");

const testQueries = [
  "How's the Irvine housing market?",
  "Is now a good time to buy in Pasadena?",
  "San Diego market",
  "What's happening in Newport Beach right now?",
  "How's the NotARealCityXYZ market?",
];

async function runTests() {
  for (const q of testQueries) {
    console.log(`\n\n########## Query: "${q}" ##########`);
    console.log(`Extracted city: ${extractCity(q)}`);
    const answer = await answerMarketQuestion(q);
    console.log(`\nAnswer:\n${answer}`);
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});