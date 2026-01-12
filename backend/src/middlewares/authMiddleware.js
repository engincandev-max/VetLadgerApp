const { authService } = require('../services');

function authMiddleware(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ')
      ? header.slice(7)
      : null;

    if (!token) {
      return res.status(401).json({ error: 'Token gerekli' });
    }

    const payload = authService.verifyToken(token);
    req.user = payload; // { id, role, iat, exp }

    next();
  } catch (err) {
    return res.status(401).json({ error: 'Geçersiz veya süresi dolmuş token' });
  }
}

function isVet(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Token gerekli' });
  }
  if (req.user.role !== 'vet') {
    return res.status(403).json({ error: 'Bu işlem için veteriner yetkisi gerekli' });
  }
  next();
}

module.exports = {
  authMiddleware,
  isVet,
};
