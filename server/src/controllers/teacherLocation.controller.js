const { saveTeacherLocation } = require("../services/teacherLocation.service");

const receiveTeacherLocation = async (req, res) => {
  try {
    const location = await saveTeacherLocation(req.body);
    return res.status(201).json({ success: true, data: location });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

module.exports = { receiveTeacherLocation };