const { transactionService } = require('../services');

class TransactionController {
  async getTransactionById(req, res, next) {
    try {
      const { id } = req.params;
      const transaction = await transactionService.getTransactionById(id);
      res.json(transaction);
    } catch (err) {
      next(err);
    }
  }

  async getTransactionsByCustomerId(req, res, next) {
    try {
      const { customerId } = req.query;

      const limit = req.query.limit ? parseInt(req.query.limit) : null;

      if (!customerId) {
        const transactions = await transactionService.getAllTransactions(limit);
        return res.json(transactions);
      }

      const transactions = await transactionService.getTransactionsByCustomerId(customerId, limit);
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  }

  async getTransactionsByAnimalId(req, res, next) {
    try {
      const { animalId } = req.query;
      
      if (!animalId) {
        return res.status(400).json({ error: 'Hayvan ID gerekli' });
      }

      const transactions = await transactionService.getTransactionsByAnimalId(animalId);
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  }

  async createTransaction(req, res, next) {
    try {
      const transaction = await transactionService.createTransaction(req.body);
      res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  }

  async deleteTransaction(req, res, next) {
    try {
      const { id } = req.params;
      await transactionService.deleteTransaction(id);
      res.json({ message: 'İşlem silindi' });
    } catch (err) {
      next(err);
    }
  }

  async getCustomerBalance(req, res, next) {
    try {
      const { customerId } = req.query;
      
      if (!customerId) {
        return res.status(400).json({ error: 'Müşteri ID gerekli' });
      }

      const balance = await transactionService.getCustomerBalance(customerId);
      res.json({ balance });
    } catch (err) {
      next(err);
    }
  }

  async getStats(req, res, next) {
    try {
      const stats = await transactionService.getStats();
      const customerService = require('../services/customerService');
      const customerCount = await customerService.getCustomerCount();

      res.json({
        totalReceivables: stats.totalReceivables,
        customerCount
      });
    } catch (err) {
      next(err);
    }
  }

  async getRecentTransactions(req, res, next) {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit) : 10;
      const transactions = await transactionService.getRecentTransactions(limit);
      res.json(transactions);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new TransactionController();
