const router = require("express").Router();

const studentController = require("../controllers/student.controller");
const auth = require("../middleware/auth.middleware");
const role = require("../middleware/role.middleware");

router.post("/", studentController.createStudent);

router.get("/", auth, role(["teacher"]), studentController.getAllStudents);

module.exports = router;