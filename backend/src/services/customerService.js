const { userRepository } = require('../repositories');
const { generateInviteCode } = require('../utils/helpers');

class CustomerService {
  async getAllCustomers(includeStatus = ['pending', 'active']) {
    return userRepository.findByRole('customer', includeStatus);
  }

  async getCustomerById(id) {
    const customer = await userRepository.findById(id);
    
    if (!customer || customer.role !== 'customer') {
      throw new Error('Müşteri bulunamadı');
    }

    return customer;
  }

  async createCustomer(name) {
    if (!name || name.trim().length < 2) {
      throw new Error('Geçerli bir isim giriniz');
    }

    const inviteCode = generateInviteCode();

    return userRepository.create({
      name: name.trim(),
      inviteCode,
      role: 'customer',
      status: 'pending',
      passwordHash: null
    });
  }

  async updateCustomer(id, updateData) {
    const customer = await this.getCustomerById(id);
    
    const allowedFields = ['name', 'phone', 'address', 'status'];
    const filteredData = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('Güncellenecek alan bulunamadı');
    }

    return userRepository.update(id, filteredData);
  }

  async deleteCustomer(id) {
    const customer = await this.getCustomerById(id);
    return userRepository.delete(id);
  }

  async getCustomerCount() {
    return userRepository.count();
  }
}

module.exports = new CustomerService();