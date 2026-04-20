const Teacher = require("../models/Teacher.model");

exports.findByIdNumber = async (idNumber) => {
  return Teacher.findOne({ idNumber });
};