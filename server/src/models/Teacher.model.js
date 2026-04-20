const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  idNumber: { type: String, unique: true },
  class: String,
  password: String, // futer case
  role: { type: String, default: "teacher" }
});

module.exports = mongoose.model("Teacher", teacherSchema);