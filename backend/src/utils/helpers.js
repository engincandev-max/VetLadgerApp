// backend/src/utils/helpers.js

// null/undefined/boş string kontrolü
function isEmpty(value) {
  return (
    value === null ||
    value === undefined ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0) ||
    (typeof value === 'object' &&
      !Array.isArray(value) &&
      Object.keys(value).length === 0)
  );
}

function safeTrim(value) {
  return typeof value === 'string' ? value.trim() : value;
}

function toNumber(value) {
  if (value === null || value === undefined) return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function isPositiveInt(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function toDate(value) {
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d;
}

function getPagination(query = {}) {
  const page = Math.max(1, parseInt(query.page ?? '1', 10));
  const limit = Math.max(1, Math.min(100, parseInt(query.limit ?? '20', 10)));
  const offset = (page - 1) * limit;
  return { page, limit, offset };
}

/**
 * 6 haneli davet kodu üretir (A-Z + 0-9)
 * Örn: "K7F3Q9"
 */
function generateInviteCode(length = 6) {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // I,O,1,0 yok
  let out = '';
  for (let i = 0; i < length; i++) {
    out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/**
 * İnek gebelik süresi yaklaşık 280 gün kabul edilerek
 * tohumlama tarihinden beklenen doğum tarihini üretir.
 */
function calculateExpectedBirthDate(inseminationDate) {
  const d = new Date(inseminationDate);
  if (Number.isNaN(d.getTime())) {
    throw new Error('Geçersiz tohumlama tarihi');
  }
  d.setDate(d.getDate() + 280);
  return d.toISOString().slice(0, 10); // "YYYY-MM-DD"
}

module.exports = {
  isEmpty,
  safeTrim,
  toNumber,
  isPositiveInt,
  toDate,
  getPagination,
  generateInviteCode,
  calculateExpectedBirthDate,
};
