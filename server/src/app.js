const cors = require('cors');
const express = require("express");
const connectDB = require("./config/db");

const app = express();

app.use(cors()); 

app.use(express.json());

// DB
connectDB();

// routes
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/teachers", require("./routes/teacher.routes"));
app.use("/api/students", require("./routes/student.routes"));
app.use('/api/location', require('./routes/location.routes'));
app.use('/api/teacher-location', require('./routes/teacherLocation.routes'));

module.exports = app;