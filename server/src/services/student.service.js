const Student = require("../models/Student.model");

exports.findByClass = async (className) => {
  return Student.find({ class: className });
};

exports.findByIdNumber = async (idNumber) => {
  return Student.findOne({ idNumber: idNumber });
};