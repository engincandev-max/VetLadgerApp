const { animalRepository } = require('../repositories');
const { calculateExpectedBirthDate } = require('../utils/helpers');

class AnimalService {
  async getAnimalById(id) {
    const animal = await animalRepository.findById(id);
    
    if (!animal) {
      throw new Error('Hayvan bulunamadı');
    }

    return animal;
  }

  async getAnimalsByOwnerId(ownerId, includeArchived = false) {
    const status = includeArchived ? null : 'active';
    return animalRepository.findByOwnerId(ownerId, status);
  }

  async getPregnantAnimals(ownerId = null) {
    return animalRepository.findPregnant(ownerId);
  }

  async createAnimal(animalData) {
    const { ownerId, earTag, breed, age, gender } = animalData;

    if (!ownerId || !earTag || !breed || age === undefined || !gender) {
      throw new Error('Tüm alanları doldurunuz');
    }

    if (age < 0 || age > 30) {
      throw new Error('Geçersiz yaş değeri');
    }

    if (!['male', 'female'].includes(gender)) {
      throw new Error('Geçersiz cinsiyet');
    }

    return animalRepository.create({
      ownerId,
      earTag: earTag.trim(),
      breed: breed.trim(),
      age: parseInt(age),
      gender
    });
  }

  async updateAnimal(id, updateData) {
    await this.getAnimalById(id);

    const allowedFields = [
      'earTag', 'breed', 'age', 'gender', 'isPregnant',
      'pregnancyStatus', 'lastInseminationDate', 'expectedBirthDate',
      'semenInfo', 'status'
    ];

    const filteredData = {};

    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key) && updateData[key] !== undefined) {
        filteredData[key] = updateData[key];
      }
    });

    if (Object.keys(filteredData).length === 0) {
      throw new Error('Güncellenecek alan bulunamadı');
    }

    return animalRepository.update(id, filteredData);
  }

  async recordInsemination(animalId, inseminationData) {
    const { semenInfo, inseminationDate } = inseminationData;

    if (!semenInfo || !inseminationDate) {
      throw new Error('Tohum bilgisi ve tarih gerekli');
    }

    const expectedBirthDate = calculateExpectedBirthDate(inseminationDate);

    return this.updateAnimal(animalId, {
      isPregnant: true,
      pregnancyStatus: 'pending',
      lastInseminationDate: inseminationDate,
      expectedBirthDate,
      semenInfo,
      status: 'active'
    });
  }

  async confirmPregnancy(animalId) {
    return this.updateAnimal(animalId, {
      pregnancyStatus: 'confirmed'
    });
  }

  async markPregnancySuspicious(animalId) {
    return this.updateAnimal(animalId, {
      pregnancyStatus: 'suspicious'
    });
  }

  async endPregnancy(animalId) {
    return this.updateAnimal(animalId, {
      isPregnant: false,
      pregnancyStatus: null,
      lastInseminationDate: null,
      expectedBirthDate: null,
      semenInfo: null
    });
  }

  async archiveAnimal(animalId) {
    return this.updateAnimal(animalId, {
      status: 'archived'
    });
  }

  async deleteAnimal(id) {
    await this.getAnimalById(id);
    return animalRepository.delete(id);
  }

  async getAnimalCount(ownerId) {
    return animalRepository.countByOwnerId(ownerId);
  }
}

module.exports = new AnimalService();