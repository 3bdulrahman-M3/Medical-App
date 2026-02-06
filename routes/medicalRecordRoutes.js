const express = require('express');
const router = express.Router();
const medicalRecordController = require('../controllers/medicalRecordController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Create medical record (Doctor only)
router.post('/', authenticate, authorize('DOCTOR'), medicalRecordController.createMedicalRecord);

// Get medical records by patient (more specific route first)
router.get('/patient/:patientId', authenticate, medicalRecordController.getMedicalRecords);

// Get all medical records (Patient sees own, Admin/Doctor sees all)
router.get('/', authenticate, medicalRecordController.getMedicalRecords);

// Get single medical record (must be last to avoid conflicts)
router.get('/:recordId', authenticate, medicalRecordController.getMedicalRecord);

module.exports = router;
