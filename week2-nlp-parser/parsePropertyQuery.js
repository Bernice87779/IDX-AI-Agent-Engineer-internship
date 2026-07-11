// Week 2 deliverable: parse free-text real estate queries into structured
// filter objects that map to rets_property columns.
// Run with: node week2-nlp-parser/parsePropertyQuery.js

function parsePropertyQuery(query) {
  const cityMatch = query.match(/in ([A-Za-z\s]+?)(?:\s+under|\s+with|\s+at|$)/i);
  const priceMatch = query.match(/under \$?([\d,.]+)(k|m)?/i);
  const bedsMatch = query.match(/(\d+)[\s-]*(bed|beds|bedroom|bedrooms)/i);
  const bathsMatch = query.match(/(\d+(?:\.5)?)[\s-]*(bath|baths|bathroom)/i);
  const sqftMatch = query.match(/(\d+)[\s,]*(sqft|sq ft|square feet)/i);
  const poolMatch = /pool/i.test(query);
  const viewMatch = /view/i.test(query);

  const typeMap = {
    condo: "Condominium",
    townhome: "Townhouse",
    "single family": "SingleFamilyResidence",
    land: "UnimprovedLand",
  };
  const typeKey = Object.keys(typeMap).find((k) => query.toLowerCase().includes(k));

  let maxPrice = null;
  if (priceMatch) {
    maxPrice = Number(priceMatch[1].replace(/,/g, ""));
    if (priceMatch[2]?.toLowerCase() === "k") maxPrice *= 1000;
    if (priceMatch[2]?.toLowerCase() === "m") maxPrice *= 1_000_000;
  }

  return {
    city: cityMatch?.[1]?.trim() || null,
    maxPrice,
    beds: bedsMatch ? Number(bedsMatch[1]) : null,
    baths: bathsMatch ? Number(bathsMatch[1]) : null,
    sqft: sqftMatch ? Number(sqftMatch[1]) : null,
    type: typeKey ? typeMap[typeKey] : null,
    pool: poolMatch ? "True" : null,
    hasView: viewMatch ? "True" : null,
  };
}

const testQueries = [
  "Show me 3-bedroom condos in Irvine under $1.5M with a pool.",
  "2 bed townhome in Newport Beach under 900k",
  "single family home in Pasadena with a view",
  "4 bedroom 2.5 bath house in San Diego under $2m",
  "condo in Los Angeles under 500000",
  "land in Riverside",
  "3 bed 2 bath 1800 sqft house in Fresno",
  "townhome in Sacramento under 700k with pool",
  "single family in Anaheim under 1.2M with a view",
  "condo in Long Beach with pool under 600k",
];

if (require.main === module) {
  testQueries.forEach((q) => {
    console.log(q);
    console.log(JSON.stringify(parsePropertyQuery(q), null, 2));
    console.log("---");
  });
}

module.exports = { parsePropertyQuery };