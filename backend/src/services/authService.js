const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { userRepository } = require('../repositories');
const { jwtSecret, jwtExpiry, bcryptRounds } = require('../config/env');

class AuthService {
  async loginVet(password) {
    const vet = (await userRepository.findByRole('vet'))[0];
    
    if (!vet) {
      throw new Error('Veteriner hesabı bulunamadı');
    }

    if (!vet.password_hash) {
      throw new Error('Veteriner şifresi ayarlanmamış');
    }

    const isValid = await bcrypt.compare(password, vet.password_hash);
    
    if (!isValid) {
      throw new Error('Hatalı şifre');
    }

    const token = this.generateToken({ id: vet.id, role: vet.role });
    
    return {
      token,
      user: {
        id: vet.id,
        name: vet.name,
        role: vet.role
      }
    };
  }

  async loginCustomer(customerId) {
    const customer = await userRepository.findById(customerId);
    
    if (!customer || customer.role !== 'customer' || customer.status !== 'active') {
      throw new Error('Müşteri bulunamadı');
    }

    const token = this.generateToken({ id: customer.id, role: customer.role });
    
    return {
      token,
      user: {
        id: customer.id,
        name: customer.name,
        role: customer.role
      }
    };
  }

  async checkInviteCode(inviteCode) {
    const customer = await userRepository.findByInviteCode(inviteCode);
    
    if (!customer) {
      throw new Error('Geçersiz davet kodu');
    }

    if (customer.status === 'active') {
      throw new Error('Bu kod zaten kullanılmış');
    }

    return customer;
  }

  async completeRegistration(customerId, phone, address) {
    const customer = await userRepository.update(customerId, {
      phone,
      address,
      status: 'active'
    });

    const token = this.generateToken({ id: customer.id, role: customer.role });
    
    return {
      token,
      user: {
        id: customer.id,
        name: customer.name,
        role: customer.role
      }
    };
  }

  async hashPassword(password) {
    return bcrypt.hash(password, bcryptRounds);
  }

  generateToken(payload) {
    return jwt.sign(payload, jwtSecret, { expiresIn: jwtExpiry });
  }

  verifyToken(token) {
    return jwt.verify(token, jwtSecret);
  }
}

module.exports = new AuthService();
