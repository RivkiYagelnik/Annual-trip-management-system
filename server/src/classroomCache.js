const Teacher = require("./models/Teacher.model");
const Student = require("./models/Student.model");


// Map<teacherId, { className, students: Set<studentId> }>
// Built once on upload, updated in realtime
 
const cache = new Map();

const buildCache = async () => {
  const teachers = await Teacher.find({});
  const students = await Student.find({});

  teachers.forEach((teacher) => {
    const classStudents = students
      .filter((s) => s.class === teacher.class)
      .map((s) => s.idNumber);
    console.log(classStudents);
    cache.set(teacher.idNumber, {
      className: teacher.className,
      students: new Set(classStudents),
    });
  });

  console.log(`Classroom cache built: ${cache.size} teachers`);
};

const getTeacherData = (teacherId) => cache.get(teacherId);

const getAllTeachers = () => cache;

module.exports = { buildCache, getTeacherData, getAllTeachers };