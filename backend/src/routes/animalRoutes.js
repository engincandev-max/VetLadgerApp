const express = require('express');
const router = express.Router();
const { animalController } = require('../controllers');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { validateAnimal } = require('../middlewares/validator');

// All animal routes require authentication
router.use(authMiddleware);

// GET routes
router.get('/', animalController.getAnimalsByOwnerId);
router.get('/pregnant', animalController.getPregnantAnimals);
router.get('/:id', animalController.getAnimalById);

// POST routes
router.post('/', validateAnimal, animalController.createAnimal);
router.post('/:id/insemination', animalController.recordInsemination);
router.post('/:id/confirm-pregnancy', animalController.confirmPregnancy);
router.post('/:id/suspicious-pregnancy', animalController.markPregnancySuspicious);
router.post('/:id/end-pregnancy', animalController.endPregnancy);

// PATCH routes
router.patch('/:id', animalController.updateAnimal);
router.patch('/:id/archive', animalController.archiveAnimal);

// DELETE routes
router.delete('/:id', animalController.deleteAnimal);

module.exports = router;