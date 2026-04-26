const Location = require("../models/Location.model");
const Student = require("../models/Student.model");
const { getIO } = require("../socket");
const { getAllTeachers } = require("../classroomCache");
const { checkAndEmitAlerts } = require("./distanceService");
const TeacherLocation = require("../models/TeacherLocation.model");

/**
 * Convert DMS (Degrees, Minutes, Seconds) to decimal degrees
 */
const dmsToDecimal = ({ Degrees, Minutes, Seconds }) => {
  return (
    parseFloat(Degrees) +
    parseFloat(Minutes) / 60 +
    parseFloat(Seconds) / 3600
  );
};

const validateDms = (dms) => {
  if (!dms || dms.Degrees === undefined || dms.Minutes === undefined || dms.Seconds === undefined) {
    return false;
  }
  return true;
};

/**
 * Save a new location reading from a tracking device
 */
const saveLocation = async ({ ID, Coordinates, Time }) => {
  if (!ID || !Coordinates || !Time) {
    throw { status: 400, message: "Missing required fields: ID, Coordinates, Time" };
  }

  const studentId = String(ID);
  if (!/^\d{9}$/.test(studentId)) {
    throw { status: 400, message: "ID must be 9 digits" };
  }

  const { Longitude, Latitude } = Coordinates;
  if (!validateDms(Longitude) || !validateDms(Latitude)) {
    throw { status: 400, message: "Invalid Coordinates format" };
  }

  const student = await Student.findOne({ idNumber: studentId });
  if (!student) {
    throw { status: 404, message: "Student not found" };
  }

  const location = new Location({
    studentId,
    latitude: dmsToDecimal(Latitude),
    longitude: dmsToDecimal(Longitude),
    timestamp: new Date(Time),
  });

  // Saving to DB and transmitting to UI at the same time — asynchronous
  await Promise.all([
    location.save(),
    Promise.resolve().then(() => {
      const io = getIO();
      if (io) {
        io.emit("location:update", {
          studentId,
          firstName: student.firstName,
          lastName: student.lastName,
          className: student.className,
          latitude: dmsToDecimal(Latitude),
          longitude: dmsToDecimal(Longitude),
          timestamp: new Date(Time),
        });
      }
    }),
  ]);
  console.log("saved location:", location.studentId, location.latitude, location.longitude);

  const teacherLocations = await TeacherLocation.find({});
  await Promise.all(
    teacherLocations.map((t) =>
      checkAndEmitAlerts(t.teacherId, [{
        studentId,
        latitude: dmsToDecimal(Latitude),
        longitude: dmsToDecimal(Longitude),
      }])
    )
  );

  return location;
};

/**
 * Get the latest location for every student
 * Returns one entry per student (the most recent)
 */
const getLatestLocations = async () => {
  const latest = await Location.aggregate([
    { $sort: { studentId: 1, timestamp: -1 } },
    {
      $group: {
        _id: "$studentId",
        latitude: { $first: "$latitude" },
        longitude: { $first: "$longitude" },
        timestamp: { $first: "$timestamp" },
      },
    },
  ]);

  // Enrich with student name from Students collection
  const enriched = await Promise.all(
    latest.map(async (loc) => {
      const student = await Student.findOne({ idNumber: loc._id }).select(
        "firstName lastName class"
      );
      return {
        studentId: loc._id,
        firstName: student?.firstName || "Unknown",
        lastName: student?.lastName || "Unknown",
        className: student?.class || "",
        latitude: loc.latitude,
        longitude: loc.longitude,
        timestamp: loc.timestamp,
      };
    })
  );

  return enriched;
};

const getDistanceAlerts = async (teacherId) => {
  const { checkAndEmitAlerts } = require("./distanceService");
  
  const latest = await Location.aggregate([
    { $sort: { studentId: 1, timestamp: -1 } },
    { $group: { _id: "$studentId", latitude: { $first: "$latitude" }, longitude: { $first: "$longitude" } } },
  ]);

  return checkAndEmitAlerts(
    teacherId,
    latest.map((s) => ({ studentId: s._id, latitude: s.latitude, longitude: s.longitude }))
  );
};

module.exports = { saveLocation, getLatestLocations, dmsToDecimal, validateDms, getDistanceAlerts };