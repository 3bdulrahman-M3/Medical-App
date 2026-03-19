const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: [true, 'Patient ID relation is required'],
  },
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Doctor',
    required: [true, 'Doctor ID is required'],
  },
  displayId: { type: String, trim: true }, // Corresponding to "id": "P-0001"
  department: { type: String, trim: true },
  admissionDate: { type: Date },
  bedNo: { type: String, trim: true },
  allergiesText: { type: String, trim: true },
  previousSurgeries: { type: String, trim: true },
  admissionWeight: { type: String, trim: true },
  todayWeight: { type: String, trim: true },
  height: { type: String, trim: true },
  bmi: { type: String, trim: true },
  admissionReason: { type: String, trim: true },
  medicalDiagnosis: { type: String, trim: true },
  complications: { type: String, trim: true },
  medications: [{ type: String, trim: true }],
  // Respiratory
  respType: { type: String, trim: true },
  respRhythm: { type: String, trim: true },
  respRate: { type: Number },
  respPattern: { type: String, trim: true },
  chestExcursion: { type: String, trim: true },
  o2Percent: { type: Number },
  o2Flow: { type: Number },
  o2Device: { type: String, trim: true },
  bronchialHygiene: { type: String, trim: true },
  o2Sat: { type: Number },
  abg: { type: String, trim: true },
  incentiveSpirometer: { type: String, trim: true },
  mdiInhaler: { type: String, trim: true },
  breathSounds: { type: String, trim: true },
  cough: { type: String, trim: true },
  chestTube: { type: String, trim: true },
  // Cardiac
  pulseSeries: [{ type: Number }],
  pulseRate: { type: Number },
  pulseRhythm: { type: String, trim: true },
  pulseAmplitude: { type: String, trim: true },
  heartSounds: { type: String, trim: true },
  bpSeries: { type: String, trim: true },
  map: { type: String, trim: true },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
