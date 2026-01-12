const pool = require('../config/database');

class AnimalRepository {
  async findById(id) {
    const result = await pool.query(
      'SELECT * FROM animals WHERE id = $1',
      [id]
    );
    return result.rows[0];
  }

  async findByOwnerId(ownerId, status = null) {
    let query = 'SELECT * FROM animals WHERE owner_id = $1';
    const params = [ownerId];
    
    if (status) {
      query += ' AND status = $2';
      params.push(status);
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async findPregnant(ownerId = null) {
    let query = 'SELECT * FROM animals WHERE is_pregnant = true';
    const params = [];
    
    if (ownerId) {
      query += ' AND owner_id = $1';
      params.push(ownerId);
    }
    
    const result = await pool.query(query, params);
    return result.rows;
  }

  async create(animalData) {
    const { ownerId, earTag, breed, age, gender } = animalData;
    const result = await pool.query(
      `INSERT INTO animals (owner_id, ear_tag, breed, age, gender)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [ownerId, earTag, breed, age, gender]
    );
    return result.rows[0];
  }

  async update(id, animalData) {
    const fields = [];
    const values = [];
    let paramCount = 1;

    Object.keys(animalData).forEach(key => {
      if (animalData[key] !== undefined) {
        const dbKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        fields.push(`${dbKey} = $${paramCount}`);
        values.push(animalData[key]);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error('Güncellenecek alan bulunamadı');
    }

    values.push(id);
    const query = `UPDATE animals SET ${fields.join(', ')} WHERE id = $${paramCount} RETURNING *`;
    
    const result = await pool.query(query, values);
    return result.rows[0];
  }

  async delete(id) {
    const result = await pool.query(
      'DELETE FROM animals WHERE id = $1 RETURNING *',
      [id]
    );
    return result.rows[0];
  }

  async countByOwnerId(ownerId) {
    const result = await pool.query(
      'SELECT COUNT(*) as count FROM animals WHERE owner_id = $1 AND status = $2',
      [ownerId, 'active']
    );
    return parseInt(result.rows[0].count);
  }
}

module.exports = new AnimalRepository();