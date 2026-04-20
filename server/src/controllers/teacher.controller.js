const Teacher = require("../models/Teacher.model");
const Student = require("../models/Student.model");

exports.createTeacher = async (req, res) => {
  const teacher = await Teacher.create(req.body);
  res.json(teacher);
};

exports.getAllTeachers = async (req, res) => {
  const teachers = await Teacher.find();
  res.json(teachers);
};

exports.getStudentsByTeacherClass = async (req, res) => {
  const teacher = req.user;

  const students = await Student.find({ class: teacher.class });

  res.json(students);
};