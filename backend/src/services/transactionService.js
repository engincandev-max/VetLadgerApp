const { transactionRepository } = require('../repositories');

class TransactionService {
  async getTransactionById(id) {
    const transaction = await transactionRepository.findById(id);
    
    if (!transaction) {
      throw new Error('İşlem bulunamadı');
    }

    return transaction;
  }

  async getTransactionsByCustomerId(customerId, limit = null) {
    return transactionRepository.findByCustomerId(customerId, limit);
  }

  async getTransactionsByAnimalId(animalId) {
    return transactionRepository.findByAnimalId(animalId);
  }

  async getAllTransactions(limit = null) {
    return transactionRepository.findAll(limit);
  }

  async createTransaction(transactionData) {
    const { customerId, animalId, amount, description, type } = transactionData;

    if (!customerId || !amount || !description || !type) {
      throw new Error('Eksik bilgi');
    }

    if (amount <= 0) {
      throw new Error('Geçersiz tutar');
    }

    if (!['borc', 'odeme'].includes(type)) {
      throw new Error('Geçersiz işlem tipi');
    }

    return transactionRepository.create({
      customerId,
      animalId: animalId || null,
      amount: parseFloat(amount),
      description: description.trim(),
      type
    });
  }

  async deleteTransaction(id) {
    await this.getTransactionById(id);
    return transactionRepository.delete(id);
  }

  async getCustomerBalance(customerId) {
    return transactionRepository.calculateBalance(customerId);
  }

  async getTotalReceivables() {
    return transactionRepository.calculateTotalReceivables();
  }

  async getRecentTransactions(limit = 10) {
    return transactionRepository.getRecentTransactions(limit);
  }

  async getStats() {
    const totalReceivables = await this.getTotalReceivables();
    
    return {
      totalReceivables
    };
  }
}

module.exports = new TransactionService();
