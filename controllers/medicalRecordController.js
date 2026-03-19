const mongoose = require('mongoose');
const MedicalRecord = require('../models/MedicalRecord');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Create medical record (Doctor only)
exports.createMedicalRecord = async (req, res) => {
  try {
    const {
      patientId, // Optional Object ID
      id: displayIdOrObjectId, // New display ID like P-0001 or Object ID
      department,
      admissionDate,
      bedNo,
      allergiesText,
      previousSurgeries,
      admissionWeight,
      todayWeight,
      height,
      bmi,
      admissionReason,
      medicalDiagnosis,
      complications,
      medications,
      respType,
      respRhythm,
      respRate,
      respPattern,
      chestExcursion,
      o2Percent,
      o2Flow,
      o2Device,
      bronchialHygiene,
      o2Sat,
      abg,
      incentiveSpirometer,
      mdiInhaler,
      breathSounds,
      cough,
      chestTube,
      pulseSeries,
      pulseRate,
      pulseRhythm,
      pulseAmplitude,
      heartSounds,
      bpSeries,
      map
    } = req.body;
    
    const doctorUserId = req.user.userId;

    // Determine target patient
    let patient;
    if (patientId) {
      patient = await Patient.findById(patientId);
    } else if (displayIdOrObjectId) {
      // Try finding by ObjectId first (could be Patient ID or User ID)
      if (mongoose.Types.ObjectId.isValid(displayIdOrObjectId)) {
        // Try as Patient ID
        patient = await Patient.findById(displayIdOrObjectId);
        
        // If not found, try as User ID (linked to a patient)
        if (!patient) {
          patient = await Patient.findOne({ userId: displayIdOrObjectId });
        }
      }
      
      // If still not found (or wasn't an ID), try finding by displayId (e.g., P-0001)
      if (!patient) {
        patient = await Patient.findOne({ displayId: displayIdOrObjectId });
      }
    }

    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Verify doctor profile exists
    const doctor = await Doctor.findOne({ userId: doctorUserId });
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor profile not found' });
    }

    const medicalRecordData = {
      patientId: patient._id,
      doctorId: doctor._id,
      displayId: patient.displayId, // Store the record's relation to that display ID
      department,
      admissionDate,
      bedNo,
      allergiesText,
      previousSurgeries,
      admissionWeight,
      todayWeight,
      height,
      bmi,
      admissionReason,
      medicalDiagnosis,
      complications,
      medications,
      respType,
      respRhythm,
      respRate,
      respPattern,
      chestExcursion,
      o2Percent,
      o2Flow,
      o2Device,
      bronchialHygiene,
      o2Sat,
      abg,
      incentiveSpirometer,
      mdiInhaler,
      breathSounds,
      cough,
      chestTube,
      pulseSeries,
      pulseRate,
      pulseRhythm,
      pulseAmplitude,
      heartSounds,
      bpSeries,
      map
    };

    const medicalRecord = new MedicalRecord(medicalRecordData);
    await medicalRecord.save();
    
    await medicalRecord.populate([
      { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
      { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
    ]);

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
      query.patientId = patientId;
    }

    const medicalRecords = await MedicalRecord.find(query)
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
        { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
      ])
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
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
        { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
      ]);

    if (!medicalRecord) {
      return res.status(404).json({ message: 'Medical record not found' });
    }

    // Permission check
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
