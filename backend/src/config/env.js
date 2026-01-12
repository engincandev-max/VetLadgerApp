

const port = Number(process.env.PORT) || 5000;

const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:5173';

const databaseUrl = process.env.DATABASE_URL;

// Auth
const jwtSecret =
  process.env.JWT_SECRET || 'change-me-jwt-secret';

const jwtExpiry = process.env.JWT_EXPIRY || '7d';

const bcryptRounds = Number(process.env.BCRYPT_ROUNDS) || 10;

module.exports = {
  port,
  corsOrigin,
  databaseUrl,
  jwtSecret,
  jwtExpiry,
  bcryptRounds,
};
