const { Pool } = require('pg');
const { databaseUrl } = require('./env');

if (!databaseUrl) {
  throw new Error('DATABASE_URL is missing. Check src/config/.env');
}

const pool = new Pool({
  connectionString: databaseUrl,
});

// Basit helper: query
const query = (text, params) => pool.query(text, params);

module.exports = {
  pool,
  query,
};
