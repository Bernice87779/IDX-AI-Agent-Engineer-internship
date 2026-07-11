#!/bin/bash
# Week 0 — Environment Setup
# Imports rets_property and california_sold into local MySQL (idx_exchange schema)

set -e

echo "Creating database idx_exchange (if not exists)..."
mysql -u root -p -e "CREATE DATABASE IF NOT EXISTS idx_exchange CHARACTER SET utf8mb4;"

echo "Importing rets_property.sql (~228K rows, this may take a while)..."
mysql -u root -p idx_exchange < ../rets_property.sql

echo "Importing california_sold.sql (~439K rows)..."
mysql -u root -p idx_exchange < ../california_sold.sql

echo "Importing rets_openhouse.sql..."
mysql -u root -p idx_exchange < ../rets_openhouse.sql

echo "Verifying row counts..."
mysql -u root -p idx_exchange -e "
SELECT
  (SELECT COUNT(*) FROM rets_property) AS active_listings,
  (SELECT COUNT(*) FROM california_sold) AS sold_comps;
"
echo "Import complete."