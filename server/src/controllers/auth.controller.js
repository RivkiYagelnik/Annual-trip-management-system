const jwt = require("jsonwebtoken");
const bcrypt  = require("bcryptjs");
const Teacher = require("../models/Teacher.model");

exports.login = async (req, res) => {
  const { idNumber, password } = req.body;

  if (!idNumber || !password) {
    return res.status(400).json({ message: "idNumber and password are required" });
  }

  try{
    const teacher = await Teacher.findOne({ idNumber });

    if (!teacher) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
  
    const token = jwt.sign(
      {
        id: teacher._id,
        role: teacher.role,
        class: teacher.class,
        idNumber: teacher.idNumber,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
  
    res.json({ token });
  } catch(err){
    res.status(500).json({ message: "Server error"});
  }
};