const pool = require('../config/database');

class UserRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByInviteCode(inviteCode) {
    const result = await pool.query(
      'SELECT * FROM users WHERE invite_code = $1',
      [inviteCode]
    );
    return result.rows[0];
  }

  async findByRole(role, status = null) {
    let query = 'SELECT * FROM users WHERE role = $1';
    const params = [role];
    
    if (status) {
      query += ' AND status = ANY($2)';
      params.push(Array.isArray(status) ? status : [status]);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(userData) {
    const { name, inviteCode, role, status, passwordHash } = userData;
    const result = await pool.query(
      `INSERT INTO users (name, invite_code, role, status, password_hash)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [name, inviteCode, role, status, passwordHash]
    );
    return result.rows[0];
  }

  async update(id, userData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(userData).forEach(key => {
      if (userData[key] !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(userData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Güncellenecek alan bulunamadı');
    }

    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  async count() {
    const result = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'customer'"
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = new UserRepository();