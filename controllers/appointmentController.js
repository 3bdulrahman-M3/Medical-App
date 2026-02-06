const Appointment = require('../models/Appointment');
const Patient = require('../models/Patient');
const Doctor = require('../models/Doctor');

// Create appointment
exports.createAppointment = async (req, res) => {
  try {
    const { patientId, doctorId, date, status } = req.body;

    // Verify patient exists
    const patient = await Patient.findById(patientId);
    if (!patient) {
      return res.status(404).json({ message: 'Patient not found' });
    }

    // Verify doctor exists
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: 'Doctor not found' });
    }

    const appointment = new Appointment({
      patientId,
      doctorId,
      date,
      status: status || 'PENDING',
    });

    await appointment.save();
    await appointment.populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization');
    await appointment.populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email');

    res.status(201).json({
      message: 'Appointment created successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error creating appointment', 
      error: error.message 
    });
  }
};

// Get appointments
exports.getAppointments = async (req, res) => {
  try {
    const user = req.user;
    let query = {};

    // Patient can only see their own appointments
    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user.userId });
      if (!patient) {
        return res.status(404).json({ message: 'Patient profile not found' });
      }
      query.patientId = patient._id;
    } 
    // Doctor can see their own appointments
    else if (user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ userId: user.userId });
      if (!doctor) {
        return res.status(404).json({ message: 'Doctor profile not found' });
      }
      query.doctorId = doctor._id;
    }
    // Admin can see all

    const appointments = await Appointment.find(query)
      .populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization')
      .populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email')
      .sort({ date: -1 });

    res.json(appointments);
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching appointments', 
      error: error.message 
    });
  }
};

// Update appointment status
exports.updateAppointment = async (req, res) => {
  try {
    const { appointmentId } = req.params;
    const { status, date } = req.body;

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    if (status) appointment.status = status;
    if (date) appointment.date = date;

    await appointment.save();
    await appointment.populate('patientId', 'userId')
      .populate('doctorId', 'userId specialization');
    await appointment.populate('patientId.userId', 'name email')
      .populate('doctorId.userId', 'name email');

    res.json({
      message: 'Appointment updated successfully',
      appointment,
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error updating appointment', 
      error: error.message 
    });
  }
};
