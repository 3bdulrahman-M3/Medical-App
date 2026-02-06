const Patient = require('../models/Patient');
const User = require('../models/User');

// Create patient profile (Super Admin only)
exports.createPatient = async (req, res) => {
  try {
    const { userId, age, gender, bloodType, chronicDiseases, allergies, notes } = req.body;

    // Check if user exists and is a PATIENT
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.role !== 'PATIENT') {
      return res.status(400).json({ message: 'User must have PATIENT role' });
    }

    // Check if patient profile already exists
    const existingPatient = await Patient.findOne({ userId });
    if (existingPatient) {
      return res.status(400).json({ message: 'Patient profile already exists for this user' });
    }

    const patient = new Patient({
      userId,
      age,
      gender,
      bloodType,
      chronicDiseases: chronicDiseases || [],
      allergies: allergies || [],
      notes,
    });

    await patient.save();
    await patient.populate('userId', 'name email role');

    res.status(201).json({
      message: 'Patient profile created successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating patient profile', 
      error: error.message 
    });
  }
};

// Get patient profile (Patient sees own, Admin sees all)
exports.getPatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    // If patient, only allow viewing own profile
    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user.userId })
        .populate('userId', 'name email role');
      
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      
      return res.json(patient);
    }

    // Admin/Doctor can view any patient
    const patient = await Patient.findById(patientId)
      .populate('userId', 'name email role');
    
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    res.json(patient);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching patient', 
      error: error.message 
    });
  }
};

// Get all patients (Admin/Doctor only)
exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find()
      .populate('userId', 'name email role')
      .sort({ createdAt: -1 });

    res.json(patients);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching patients', 
      error: error.message 
    });
  }
};

// Update patient profile
exports.updatePatient = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;
    const updateData = req.body;

    let patient;

    // If patient, only allow updating own profile
    if (user.role === 'PATIENT') {
      patient = await Patient.findOne({ userId: user.userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
    } else {
      // Admin/Doctor can update any patient
      patient = await Patient.findById(patientId);
      if (!patient) {
        return res.status(404).json({ message: 'Patient not found' });
      }
    }

    Object.assign(patient, updateData);
    await patient.save();
    await patient.populate('userId', 'name email role');

    res.json({
      message: 'Patient profile updated successfully',
      patient,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating patient', 
      error: error.message 
    });
  }
};
