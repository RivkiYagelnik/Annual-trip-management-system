const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  idNumber:   { type: String, required: true, unique: true },
  class:      { type: String, required: true },
  password:   { type: String, required: true },
  role:       { type: String, default: "teacher" }
});

module.exports = mongoose.model("Teacher", teacherSchema);