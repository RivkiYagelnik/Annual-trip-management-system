const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  idNumber: String,
  class: String
});

module.exports = mongoose.model("Student", studentSchema);