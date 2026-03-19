const Doctor = require('../models/Doctor');
const User = require('../models/User');

// Create doctor profile
exports.createDoctor = async (req, res) => {
  try {
    const { userId, specialization, licenseNumber, yearsOfExperience } = req.body;

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
      yearsOfExperience,
      status: 'PENDING', // Default to pending for approval
    });

    await doctor.save();
    await doctor.populate('userId', 'name email role');

    res.status(201).json({
      message: 'Doctor profile application submitted successfully. Status: PENDING',
      doctor,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating doctor profile', 
      error: error.message 
    });
  }
};

// Get pending doctors (Super Admin only)
exports.getPendingDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ status: 'PENDING' })
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(doctors);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching pending doctors', 
      error: error.message 
    });
  }
};

// Update doctor status (Super Admin only)
exports.updateDoctorStatus = async (req, res) => {
  try {
    const { doctorId } = req.params;
    const { status } = req.body;

    if (!['APPROVED', 'REJECTED', 'PENDING'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const doctor = await Doctor.findByIdAndUpdate(
      doctorId, 
      { status }, 
      { new: true }
    ).populate('userId', 'name email role');

    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    res.json({
      message: `Doctor status updated to ${status}`,
      doctor,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating doctor status', 
      error: error.message 
    });
  }
};

// Get single doctor
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
    const { status } = req.query; // Optional filter by status
    const query = status ? { status } : {};

    // If non-admin is fetching the list, only show APPROVED doctors
    if (req.user.role !== 'SUPER_ADMIN') {
      query.status = 'APPROVED';
    }

    const doctors = await Doctor.find(query)
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
