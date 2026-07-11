// Week 0 deliverable: verify MySQL connection and row counts.
require("dotenv").config();
const mysql = require("mysql2/promise");

async function main() {
  const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 5,
  });

  try {
    const [rows] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM rets_property) AS active_listings,
        (SELECT COUNT(*) FROM california_sold) AS sold_comps
    `);
    console.log("Connection successful.");
    console.log("Active listings (rets_property):", rows[0].active_listings);
    console.log("Sold comps (california_sold):", rows[0].sold_comps);
  } catch (err) {
    console.error("Connection or query failed:", err.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

main();