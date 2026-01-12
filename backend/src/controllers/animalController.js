const { animalService } = require('../services');

class AnimalController {
  async getAnimalById(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.getAnimalById(id);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async getAnimalsByOwnerId(req, res, next) {
    try {
      const { ownerId } = req.query;
      
      if (!ownerId) {
        return res.status(400).json({ error: 'Sahip ID gerekli' });
      }

      const includeArchived = req.query.includeArchived === 'true';
      const animals = await animalService.getAnimalsByOwnerId(ownerId, includeArchived);
      res.json(animals);
    } catch (err) {
      next(err);
    }
  }

  async getPregnantAnimals(req, res, next) {
    try {
      const { ownerId } = req.query;
      const animals = await animalService.getPregnantAnimals(ownerId || null);
      res.json(animals);
    } catch (err) {
      next(err);
    }
  }

  async createAnimal(req, res, next) {
    try {
      const animal = await animalService.createAnimal(req.body);
      res.status(201).json(animal);
    } catch (err) {
      next(err);
    }
  }

  async updateAnimal(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.updateAnimal(id, req.body);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async recordInsemination(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.recordInsemination(id, req.body);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async confirmPregnancy(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.confirmPregnancy(id);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async markPregnancySuspicious(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.markPregnancySuspicious(id);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async endPregnancy(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.endPregnancy(id);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async archiveAnimal(req, res, next) {
    try {
      const { id } = req.params;
      const animal = await animalService.archiveAnimal(id);
      res.json(animal);
    } catch (err) {
      next(err);
    }
  }

  async deleteAnimal(req, res, next) {
    try {
      const { id } = req.params;
      await animalService.deleteAnimal(id);
      res.json({ message: 'Hayvan silindi' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = new AnimalController();