require('dotenv').config();

process.on('beforeExit', (code) => console.log('🧨 beforeExit:', code));
process.on('exit', (code) => console.log('🧨 exit:', code));
process.on('uncaughtException', (err) => console.error('🔥 uncaughtException:', err));
process.on('unhandledRejection', (err) => console.error('🔥 unhandledRejection:', err));

const app = require('../app');

const PORT = Number(process.env.PORT) || 5000;

const server = app.listen(PORT, () => {
  console.log('╔══════════════════════════════════════╗');
  console.log('║     🏥 VetLedger API Server          ║');
  console.log('╚══════════════════════════════════════╝');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 API URL: http://localhost:${PORT}/api`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  console.log('📍 address:', server.address());
  console.log(
    '🧵 handles:',
    process._getActiveHandles().map((h) => h?.constructor?.name)
  );
});

// 🔥 kritik: process'i ayakta tut
server.ref();

server.on('close', () => console.log('🛑 SERVER CLOSE event fired'));
server.on('error', (e) => console.error('🛑 SERVER ERROR:', e));

const shutdown = (signal) => {
  console.log(`\n${signal} signal received: closing HTTP server`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
};

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
