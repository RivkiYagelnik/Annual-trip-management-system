const Student = require("../models/Student.model");

exports.createStudent = async (req, res) => {
  const { firstName, lastName, idNumber, class: className } = req.body;

  if (!firstName || !lastName || !idNumber || !className) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const student = await Student.create({ firstName, lastName, idNumber, class: className });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};