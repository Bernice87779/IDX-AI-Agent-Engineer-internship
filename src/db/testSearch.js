// Quick test: verify Week 3 query layer can pull real listings
// from the imported rets_property table.
require("dotenv").config();
const { searchActiveListings, getSoldComps } = require("./propertyQueries");

async function main() {
  console.log("--- Testing searchActiveListings (no filters, top 5) ---");
  const listings = await searchActiveListings({}, 1, 5);
  console.log(`Found ${listings.length} listings.`);
  listings.forEach((l) => {
    console.log(`${l.L_Address}, ${l.L_City} | $${l.price} | ${l.beds}bd/${l.baths}ba | ${l.sqft} sqft`);
  });

  console.log("\n--- Testing searchActiveListings with filters ---");
  const filtered = await searchActiveListings({ maxPrice: 1000000, beds: 2 }, 1, 5);
  console.log(`Found ${filtered.length} listings under $1M with 2+ beds.`);
  filtered.forEach((l) => {
    console.log(`${l.L_Address}, ${l.L_City} | $${l.price} | ${l.beds}bd/${l.baths}ba`);
  });

  process.exit(0);
}

main().catch((err) => {
  console.error("Test failed:", err.message);
  process.exit(1);
});