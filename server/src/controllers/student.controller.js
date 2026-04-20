const Student = require("../models/Student.model");

exports.createStudent = async (req, res) => {
  const student = await Student.create(req.body);
  res.json(student);
};

exports.getAllStudents = async (req, res) => {
  const students = await Student.find();
  res.json(students);
};