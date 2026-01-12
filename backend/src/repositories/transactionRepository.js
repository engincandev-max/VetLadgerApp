const pool = require('../config/database');

class TransactionRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByCustomerId(customerId, limit = null) {
    let query = 'SELECT * FROM transactions WHERE customer_id = $1 ORDER BY created_at DESC';
    const params = [customerId];
    
    if (limit) {
      query += ' LIMIT $2';
      params.push(limit);
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findByAnimalId(animalId) {
    const result = await pool.query(
      'SELECT * FROM transactions WHERE animal_id = $1 ORDER BY created_at DESC',
      [animalId]
    );
    return result.rows;
  }

  async create(transactionData) {
    const { customerId, animalId, amount, description, type } = transactionData;
    const result = await pool.query(
      `INSERT INTO transactions (customer_id, animal_id, amount, description, type)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [customerId, animalId || null, amount, description, type]
    );
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM transactions WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  async calculateBalance(customerId) {
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN type = 'borc' THEN amount ELSE 0 END) as total_debt,
        SUM(CASE WHEN type = 'odeme' THEN amount ELSE 0 END) as total_payment
       FROM transactions 
       WHERE customer_id = $1`,
      [customerId]
    );
    
    const debt = parseFloat(result.rows[0].total_debt) || 0;
    const payment = parseFloat(result.rows[0].total_payment) || 0;
    
    return debt - payment;
  }

  async calculateTotalReceivables() {
    const result = await pool.query(
      `SELECT 
        SUM(CASE WHEN type = 'borc' THEN amount ELSE -amount END) as total
       FROM transactions`
    );
    
    return parseFloat(result.rows[0].total) || 0;
  }

  async getRecentTransactions(limit = 10) {
    const result = await pool.query(
      `SELECT t.*, u.name as customer_name 
       FROM transactions t
       LEFT JOIN users u ON t.customer_id = u.id
       ORDER BY t.created_at DESC
       LIMIT $1`,
      [limit]
    );
    return result.rows;
  }
}

module.exports = new TransactionRepository();
