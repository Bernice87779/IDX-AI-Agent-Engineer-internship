// Week 5 — Market Statistics Agent
// Aggregates california_sold data to answer market-condition questions
// e.g. "Is now a good time to buy in San Diego?" / "avg price per sqft in Pasadena?"

const { query } = require("../src/db/propertyQueries");

// Core metric: city-level market summary over the trailing N months
async function getCityMarketSummary(city, months = 12) {
  const sql = `
    SELECT
      City,
      COUNT(*) AS sold_count,
      ROUND(AVG(ClosePrice), 0) AS avg_close_price,
      ROUND(AVG(ClosePrice / NULLIF(LivingArea,0)), 0) AS avg_price_per_sqft,
      ROUND(AVG(DaysOnMarket), 1) AS avg_dom,
      ROUND(AVG(ClosePrice / NULLIF(ListPrice,0)) * 100, 1) AS list_to_close_pct
    FROM california_sold
    WHERE PropertyType = 'Residential'
      AND City = ?
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      AND LivingArea > 0
    GROUP BY City
  `;
  return query(sql, [city, months]);
}

// Month-over-month trend, for "are prices rising?" type questions
async function getPriceTrend(city, months = 24) {
  const sql = `
    SELECT
      DATE_FORMAT(CloseDate, '%Y-%m') AS month,
      COUNT(*) AS sales,
      ROUND(AVG(ClosePrice), 0) AS avg_price,
      ROUND(AVG(DaysOnMarket), 1) AS avg_dom
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
    GROUP BY DATE_FORMAT(CloseDate, '%Y-%m')
    ORDER BY month
  `;
  return query(sql, [city, months]);
}

// Inventory comparison: how many are actively for sale vs. how many sold recently
async function getInventoryComparison(city, months = 12) {
  const activeSql = `
    SELECT COUNT(*) AS active_count
    FROM rets_property
    WHERE L_City = ? AND L_Status = 'Active'
  `;
  const soldSql = `
    SELECT COUNT(*) AS sold_count
    FROM california_sold
    WHERE City = ?
      AND PropertyType = 'Residential'
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
  `;
  const [active] = await query(activeSql, [city]);
  const [sold] = await query(soldSql, [city, months]);
  return {
    active_count: active?.active_count ?? 0,
    sold_count: sold?.sold_count ?? 0,
  };
}

module.exports = { getCityMarketSummary, getPriceTrend, getInventoryComparison };