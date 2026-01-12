// backend/src/middlewares/validator.js

function validateCustomer(req, res, next) {
  const { name } = req.body;

  if (!name || String(name).trim().length < 2) {
    return res.status(400).json({ error: 'Geçerli bir müşteri ismi giriniz' });
  }

  next();
}

function validateAnimal(req, res, next) {
  const { ownerId, earTag, breed, age, gender } = req.body;

  if (!ownerId || !earTag || !breed || age === undefined || !gender) {
    return res.status(400).json({ error: 'Tüm alanları doldurunuz' });
  }

  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 30) {
    return res.status(400).json({ error: 'Geçersiz yaş değeri' });
  }

  if (!['male', 'female'].includes(gender)) {
    return res.status(400).json({ error: 'Geçersiz cinsiyet' });
  }

  next();
}

function validateTransaction(req, res, next) {
  const { customerId, amount, type } = req.body;

  if (!customerId) {
    return res.status(400).json({ error: 'customerId gerekli' });
  }

  const amt = Number(amount);
  if (!Number.isFinite(amt) || amt <= 0) {
    return res.status(400).json({ error: 'Geçerli bir tutar giriniz' });
  }

  // projende type nasıl kullanılıyor bilmiyoruz; en azından boş olmasın
  if (!type || String(type).trim().length === 0) {
    return res.status(400).json({ error: 'İşlem tipi gerekli' });
  }

  next();
}

module.exports = {
  validateCustomer,
  validateAnimal,
  validateTransaction,
};
