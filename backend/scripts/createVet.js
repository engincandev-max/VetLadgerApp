const bcrypt = require('bcryptjs');
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

const createVet = async () => {
  const name = 'Veteriner Admin';
  const password = 'admin123';
  const hash = await bcrypt.hash(password, 10);

  try {
    await pool.query('BEGIN');

    const existing = await pool.query(
      "SELECT * FROM users WHERE role = 'vet'"
    );

    if (existing.rows.length > 0) {
      await pool.query(
        "UPDATE users SET password_hash = $1 WHERE role = 'vet'",
        [hash]
      );
      console.log('✅ Veteriner şifresi güncellendi!');
    } else {
      await pool.query(
        `INSERT INTO users (name, role, status, password_hash)
         VALUES ($1, $2, $3, $4)`,
        [name, 'vet', 'active', hash]
      );
      console.log('✅ Veteriner hesabı oluşturuldu!');
    }

    await pool.query('COMMIT');
    console.log('\n📋 Giriş Bilgileri:');
    console.log('Şifre: admin123\n');
    
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('❌ Hata:', err.message);
  } finally {
    await pool.end();
  }
};

createVet();