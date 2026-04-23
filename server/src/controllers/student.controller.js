const Student = require("../models/Student.model");
const studentService = require("../services/student.service");

exports.createStudent = async (req, res) => {
  const { firstName, lastName, idNumber, class: className } = req.body;

  if (!firstName || !lastName || !idNumber || !className) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (!/^\d{9}$/.test(idNumber)) {
    return res.status(400).json({ message: "ID number must be exactly 9 digits" });
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

exports.getStudentById = async (req, res) => {
  const { id } = req.params;

  try {
    const student = await studentService.findByIdNumber(id);
    
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};