const bcrypt  = require("bcryptjs");
const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

exports.createTeacher = async (req, res) => {
  const { firstName, lastName, idNumber, class: className, password } = req.body;

  if (!firstName || !lastName || !idNumber || !className || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const exists = await Teacher.findOne({ idNumber });
    if (exists) {
      return res.status(409).json({ message: "Teacher with this idNumber already exists" });
    }

    const hashed  = await bcrypt.hash(password, 10);
    const teacher = await Teacher.create({
      firstName,
      lastName,
      idNumber,
      class: className,
      password: hashed
    });

    const { password: _, ...safeTeacher } = teacher.toObject();
    res.status(201).json(safeTeacher);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAllTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find().select("-password");
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStudentsByTeacherClass = async (req, res) => {
  try {
    const students = await Student.find({ class: req.user.class });
    res.json(students);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};