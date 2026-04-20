const jwt = require("jsonwebtoken");
const Teacher = require("../models/Teacher.model");

exports.login = async (req, res) => {
  const { idNumber } = req.body;

  const teacher = await Teacher.findOne({ idNumber });

  if (!teacher) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign(
    {
      id: teacher._id,
      role: teacher.role,
      class: teacher.class
    },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  res.json({ token });
};