const Student = require("../models/Student.model");

exports.findByClass = async (className) => {
  return Student.find({ class: className });
};