const router = require("express").Router();

const teacherController = require("../controllers/teacher.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/", teacherController.createTeacher);

router.get(
  "/students",
  auth,
  role(["teacher"]),
  teacherController.getStudentsByTeacherClass
);

router.get(
  "/:idNumber", 
  auth, 
  role(["teacher"]), 
  teacherController.getTeacherById
);

router.get("/", auth, role(["teacher"]), teacherController.getAllTeachers);

module.exports = router;