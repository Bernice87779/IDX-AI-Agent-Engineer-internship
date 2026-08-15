// Week 5 — Market Statistics Skill
// Wraps marketAnalytics.js functions into a single "ask a market question, get a human answer" skill

const {
  getCityMarketSummary,
  getPriceTrend,
  getInventoryComparison,
} = require("./marketAnalytics");

// Very simple city extractor for testing — matches "in <City>" or "<City> market"
// (real NLP intent routing happens later in Week 9 orchestration)
function extractCity(query) {
  // Pattern 1: "... in <City> ..." (e.g. "buy in Pasadena?", "happening in Newport Beach")
  let match = query.match(/\bin\s+([A-Za-z\s]+?)(?:\?|$|\s+market|\s+now|\s+right now)/i);
  if (match) return match[1].trim();

  // Pattern 2: "the <City> market" / "the <City> housing market" (e.g. "How's the Irvine housing market?")
  match = query.match(/\bthe\s+([A-Za-z\s]+?)\s+(?:housing\s+)?market\b/i);
  if (match) return match[1].trim();

  // Pattern 3: "<City> market" at the start of the string, no "the" (e.g. "San Diego market")
  match = query.match(/^([A-Za-z\s]+?)\s+(?:housing\s+)?market\b/i);
  if (match) return match[1].trim();

  return null;
}

// Turns raw numbers into a plain-English market summary
async function formatMarketSummary(city) {
  const summaryRows = await getCityMarketSummary(city, 12);
  const trendRows = await getPriceTrend(city, 6);
  const inventory = await getInventoryComparison(city, 12);

  // Guard: no data for this city
  if (!summaryRows || summaryRows.length === 0) {
    return `I don't have market data for ${city} right now. Want to try another California city?`;
  }

  const s = summaryRows[0];

  // Determine trend direction from first vs last month in trendRows
  let trendText = "there isn't enough recent data to determine a clear trend";
  if (trendRows.length >= 2) {
    const first = trendRows[0].avg_price;
    const last = trendRows[trendRows.length - 1].avg_price;
    const pctChange = (((last - first) / first) * 100).toFixed(1);
    if (last > first) {
      trendText = `prices have risen about ${pctChange}% over the past ${trendRows.length} months, trending upward`;
    } else if (last < first) {
      trendText = `prices have dropped about ${Math.abs(pctChange)}% over the past ${trendRows.length} months, trending downward`;
    } else {
      trendText = `prices have stayed roughly flat over the past ${trendRows.length} months`;
    }
  }

  const marketTemp =
    s.list_to_close_pct >= 100
      ? "leaning toward a seller's market (homes are closing at or above list price)"
      : "leaning toward a buyer's market (homes are typically closing below list price, more room to negotiate)";

  const inventoryNote =
    inventory.active_count < inventory.sold_count / 12
      ? "inventory is relatively low compared to the past year's sales pace"
      : "inventory looks healthy compared to the past year's sales pace";

  return (
    `${city} had ${s.sold_count} homes sold over the past 12 months, with an average close price of ` +
    `$${Number(s.avg_close_price).toLocaleString()} (about $${s.avg_price_per_sqft}/sqft), and homes typically ` +
    `sold in ${s.avg_dom} days. The list-to-close ratio is ${s.list_to_close_pct}%, ${marketTemp}. ` +
    `Looking at recent trends, ${trendText}. There are currently ${inventory.active_count} active listings, and ${inventoryNote}.`
  );
}

// Entry point: takes a raw question, extracts city, returns formatted answer
async function answerMarketQuestion(query) {
  const city = extractCity(query);
  if (!city) {
    return "I couldn't identify which city you're asking about. Try something like \"How's the Irvine housing market?\"";
  }
  return formatMarketSummary(city);
}

module.exports = { formatMarketSummary, answerMarketQuestion, extractCity };