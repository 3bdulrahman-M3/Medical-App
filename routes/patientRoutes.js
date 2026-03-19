const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Create patient profiles (Admin/Doctor/Patient)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'DOCTOR', 'PATIENT'), patientController.createPatient);

// Get all patients (Admin/Doctor)
router.get('/', authenticate, authorize('SUPER_ADMIN', 'DOCTOR'), patientController.getAllPatients);

// Get single patient (Patient sees own, Admin/Doctor sees any)
router.get('/:patientId', authenticate, patientController.getPatient);

// Update patient (Patient updates own, Admin/Doctor updates any)
router.put('/:patientId', authenticate, patientController.updatePatient);

module.exports = router;
