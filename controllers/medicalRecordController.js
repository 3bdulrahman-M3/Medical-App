const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Create medical record (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  try {
    const { patientId, diagnosis, prescription, attachments } = req.body;
    const doctorId = req.user.userId;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Verify doctor profile exists
    const doctor = await Doctor.findOne({ userId: doctorId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const medicalRecord = new MedicalRecord({
      patientId,
      doctorId: doctor._id,
      diagnosis,
      prescription,
      attachments: attachments || [],
    });

    await medicalRecord.save();
    await medicalRecord.populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization');
    await medicalRecord.populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email');

    res.status(201).json({
      message: 'Medical record created successfully',
      medicalRecord,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating medical record', 
      error: error.message 
    });
  }
};

// Get medical records
exports.getMedicalRecords = async (req, res) => {
  try {
    const { patientId } = req.params;
    const user = req.user;

    let query = {};

    // Patient can only see their own records
    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user.userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      query.patientId = patient._id;
    } else if (patientId) {
      // Admin/Doctor can filter by patientId
      query.patientId = patientId;
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization')
      .populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email')
      .sort({ createdAt: -1 });

    res.json(medicalRecords);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching medical records', 
      error: error.message 
    });
  }
};

// Get single medical record
exports.getMedicalRecord = async (req, res) => {
  try {
    const { recordId } = req.params;
    const user = req.user;

    const medicalRecord = await MedicalRecord.findById(recordId)
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization')
      .populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email');

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Patient can only see their own records
    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user.userId });
      if (!patient || medicalRecord.patientId._id.toString() !== patient._id.toString()) {
        return res.status(403).json({ message: 'Access denied' });
      }
    }

    res.json(medicalRecord);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching medical record', 
      error: error.message 
    });
  }
};
