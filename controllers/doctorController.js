const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Create doctor profile
exports.createDoctor = async (req, res) => {
  try {
    const { userId, specialization, licenseNumber } = req.body;

    // Check if user exists and is a DOCTOR
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'DOCTOR') {
      return res.status(400).json({ message: 'User must have DOCTOR role' });
    }

    // Check if doctor profile already exists
    const existingDoctor = await Doctor.findOne({ userId });
    if (existingDoctor) {
      return res.status(400).json({ message: 'Doctor profile already exists for this user' });
    }

    const doctor = new Doctor({
      userId,
      specialization,
      licenseNumber,
    });

    await doctor.save();
    await doctor.populate('userId', 'name email role');

    res.status(201).json({
      message: 'Doctor profile created successfully',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating doctor profile', 
      error: error.message 
    });
  }
};

// Get doctor profile
exports.getDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const doctor = await Doctor.findById(doctorId)
      .populate('userId', 'name email role');
    
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    res.json(doctor);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching doctor', 
      error: error.message 
    });
  }
};

// Get all doctors
exports.getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching doctors', 
      error: error.message 
    });
  }
};
