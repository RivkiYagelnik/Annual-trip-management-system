const express = require("express");
const router = express.Router();
const { receiveTeacherLocation } = require("../controllers/teacherLocation.controller");

// POST /api/teacher-location – open (tracking device, no auth)
router.post("/", receiveTeacherLocation);

module.exports = router;