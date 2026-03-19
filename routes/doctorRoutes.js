const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const authenticate = require('../middleware/auth');
const authorize = require('../middleware/roles');

// Create/Apply for doctor profile (Any Doctor can apply)
router.post('/', authenticate, authorize('SUPER_ADMIN', 'DOCTOR'), doctorController.createDoctor);

// Get pending doctor applications (Super Admin only)
router.get('/pending', authenticate, authorize('SUPER_ADMIN'), doctorController.getPendingDoctors);

// Update doctor application status (Super Admin only)
router.patch('/:doctorId/status', authenticate, authorize('SUPER_ADMIN'), doctorController.updateDoctorStatus);

// Get all doctors (Approved only for non-admin, All for Admin)
router.get('/', authenticate, doctorController.getAllDoctors);

// Get single doctor
router.get('/:doctorId', authenticate, doctorController.getDoctor);

module.exports = router;
