const TeacherLocation = require("../models/TeacherLocation.model");
const { dmsToDecimal, validateDms } = require("./location.service");
const { getIO } = require("../socket");
const { checkAndEmitAlerts } = require("./distanceService");
const Location = require("../models/Location.model");

const saveTeacherLocation = async ({ ID, Coordinates, Time }) => {
  if (!ID || !Coordinates || !Time)
    throw { status: 400, message: "Missing required fields" };

  const { Longitude, Latitude } = Coordinates;
  if (!validateDms(Longitude) || !validateDms(Latitude))
    throw { status: 400, message: "Invalid Coordinates format" };

  // upsert — always one record per teacher
  const location = await TeacherLocation.findOneAndUpdate(
    { teacherId: String(ID) },
    {
      latitude: dmsToDecimal(Latitude),
      longitude: dmsToDecimal(Longitude),
      timestamp: new Date(Time),
    },
    { upsert: true, new: true }
  );

  // emit to the teacher herself to update the map
  const io = getIO();
  if (io) {
    io.to(`teacher:${String(ID)}`).emit("teacher:location", {
      latitude: location.latitude,
      longitude: location.longitude,
    });
  }

  // Distance check with all the students in the class
  const latestStudentLocations = await Location.aggregate([
    { $sort: { studentId: 1, timestamp: -1 } },
    { $group: { _id: "$studentId", latitude: { $first: "$latitude" }, longitude: { $first: "$longitude" } } },
  ]);

  await checkAndEmitAlerts(
    String(ID),
    latestStudentLocations.map((s) => ({ studentId: s._id, latitude: s.latitude, longitude: s.longitude }))
  );

  return location;
};

module.exports = { saveTeacherLocation };