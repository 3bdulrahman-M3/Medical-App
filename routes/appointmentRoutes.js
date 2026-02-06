const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const authenticate = require('../middleware/auth');

// Create appointment
router.post('/', authenticate, appointmentController.createAppointment);

// Get appointments (filtered by role)
router.get('/', authenticate, appointmentController.getAppointments);

// Update appointment
router.put('/:appointmentId', authenticate, appointmentController.updateAppointment);

module.exports = router;
