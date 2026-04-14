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
    
    // Correct way to deep populate a document
    await appointment.populate([
      { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
      { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
    ]);

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

    const appointments = await Appointment.find(query)
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
        { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
      ])
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
    
    // Correct way to deep populate a document
    await appointment.populate([
      { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
      { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
    ]);

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

// Get today's reminders/appointments
exports.getTodayReminders = async (req, res) => {
  try {
    const user = req.user;
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    let query = {
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['CONFIRMED', 'PENDING'] } // Include pending and confirmed for the reminder endpoint
    };

    if (user.role === 'PATIENT') {
      const patient = await Patient.findOne({ userId: user.userId });
      if (!patient) return res.status(404).json({ message: 'Patient profile not found' });
      query.patientId = patient._id;
    } else if (user.role === 'DOCTOR') {
      const doctor = await Doctor.findOne({ userId: user.userId });
      if (!doctor) return res.status(404).json({ message: 'Doctor profile not found' });
      query.doctorId = doctor._id;
    }

    const appointments = await Appointment.find(query)
      .populate([
        { path: 'patientId', populate: { path: 'userId', select: 'name email role' } },
        { path: 'doctorId', populate: { path: 'userId', select: 'name email specialization' } }
      ])
      .sort({ date: 1 });

    res.json({
      count: appointments.length,
      message: appointments.length > 0 
        ? `You have ${appointments.length} appointment(s) today.` 
        : "You have no appointments today.",
      appointments
    });
  } catch (error) {
    res.status(500).json({ 
      message: 'Error fetching today’s reminders', 
      error: error.message 
    });
  }
};
