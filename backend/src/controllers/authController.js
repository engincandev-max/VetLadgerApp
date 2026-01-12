const { authService } = require('../services');

class AuthController {
  async loginVet(req, res, next) {
    try {
      const { password } = req.body;

      if (!password) {
        return res.status(400).json({ error: 'Şifre gerekli' });
      }

      const result = await authService.loginVet(password);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async loginCustomer(req, res, next) {
    try {
      const { customerId } = req.body;

      if (!customerId) {
        return res.status(400).json({ error: 'Müşteri ID gerekli' });
      }

      const result = await authService.loginCustomer(customerId);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async checkInviteCode(req, res, next) {
    try {
      const { inviteCode } = req.body;

      if (!inviteCode || inviteCode.length !== 6) {
        return res.status(400).json({ error: 'Geçerli bir davet kodu giriniz' });
      }

      const customer = await authService.checkInviteCode(inviteCode);
      res.json({ customer });
    } catch (err) {
      next(err);
    }
  }

  async completeRegistration(req, res, next) {
    try {
      const { customerId, phone, address } = req.body;

      if (!customerId || !phone || !address) {
        return res.status(400).json({ error: 'Tüm alanları doldurunuz' });
      }

      const result = await authService.completeRegistration(customerId, phone, address);
      res.json(result);
    } catch (err) {
      next(err);
    }
  }

  async refreshToken(req, res, next) {
    try {
      const token = authService.generateToken({
        id: req.user.id,
        role: req.user.role
      });

      res.json({ token });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AuthController();