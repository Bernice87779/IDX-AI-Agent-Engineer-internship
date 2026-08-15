// Quick test script for Week 5 market analytics functions
const {
  getCityMarketSummary,
  getPriceTrend,
  getInventoryComparison,
} = require("./marketAnalytics");

const testCities = ["Pasadena", "Irvine", "San Diego", "Newport Beach", "NotARealCityXYZ"];

async function testCity(city) {
  console.log(`\n\n########## ${city} ##########`);

  console.log(`\n=== City Market Summary: ${city} ===`);
  const summary = await getCityMarketSummary(city);
  console.log(summary);

  console.log(`\n=== Price Trend: ${city} (last 6 months) ===`);
  const trend = await getPriceTrend(city, 6);
  console.log(trend);

  console.log(`\n=== Inventory Comparison: ${city} ===`);
  const inventory = await getInventoryComparison(city);
  console.log(inventory);
}

async function runTests() {
  for (const city of testCities) {
    await testCity(city);
  }
  process.exit(0);
}

runTests().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});