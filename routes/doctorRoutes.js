const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Create doctor profile (Super Admin)
router.post('/', authenticate, authorize('SUPER_ADMIN'), doctorController.createDoctor);

// Get all doctors
router.get('/', authenticate, doctorController.getAllDoctors);

// Get single doctor
router.get('/:doctorId', authenticate, doctorController.getDoctor);

module.exports = router;
