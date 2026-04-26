const mongoose = require("mongoose");

const teacherLocationSchema = new mongoose.Schema({
  teacherId: { type: String, required: true, unique: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
  timestamp: { type: Date, required: true },
});

module.exports = mongoose.model("TeacherLocation", teacherLocationSchema);