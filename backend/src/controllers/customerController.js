const { customerService } = require('../services');

class CustomerController {
  async getAllCustomers(req, res, next) {
    try {
      const customers = await customerService.getAllCustomers();
      res.json(customers);
    } catch (err) {
      next(err);
    }
  }

  async getCustomerById(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await customerService.getCustomerById(id);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }

  async createCustomer(req, res, next) {
    try {
      const { name } = req.body;
      const customer = await customerService.createCustomer(name);
      res.status(201).json(customer);
    } catch (err) {
      next(err);
    }
  }

  async updateCustomer(req, res, next) {
    try {
      const { id } = req.params;
      const customer = await customerService.updateCustomer(id, req.body);
      res.json(customer);
    } catch (err) {
      next(err);
    }
  }

  async deleteCustomer(req, res, next) {
    try {
      const { id } = req.params;
      await customerService.deleteCustomer(id);
      res.json({ message: 'Müşteri silindi' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new CustomerController();