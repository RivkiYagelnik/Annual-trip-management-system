const getDistanceKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };
  
  const DISTANCE_THRESHOLD_KM = 3;
  
  const isTooFar = (lat1, lon1, lat2, lon2) =>
    getDistanceKm(lat1, lon1, lat2, lon2) > DISTANCE_THRESHOLD_KM;
  
  const checkAndEmitAlerts = async (teacherId, studentLocations) => {
    const TeacherLocation = require("../models/TeacherLocation.model");
    const { getAllTeachers } = require("../classroomCache");
    const { getIO } = require("../socket");
    const Student = require("../models/Student.model");
  
    const teacherLoc = await TeacherLocation.findOne({ teacherId });
    if (!teacherLoc) return [];
  
    const teacherData = getAllTeachers().get(teacherId);
    if (!teacherData) return [];
    
    const relevantStudents = studentLocations.filter((s) =>
        teacherData.students.has(s.studentId)
      );
    
    const alerts = [];
    const io = getIO();
  
    await Promise.all(
        relevantStudents.map(async (studentLoc) => {
          const distance = getDistanceKm(
            teacherLoc.latitude,
            teacherLoc.longitude,
            studentLoc.latitude,
            studentLoc.longitude
          );
    
          const student = await Student.findOne({ idNumber: studentLoc.studentId }).select("firstName lastName");
    
          if (distance > DISTANCE_THRESHOLD_KM) {
            const alert = {
              studentId: studentLoc.studentId,
              firstName: student?.firstName || "Unknown",
              lastName: student?.lastName || "Unknown",
              distance: Math.round(distance * 10) / 10,
              tooFar: true,
            };
            alerts.push(alert);
            if (io) io.to(`teacher:${teacherId}`).emit("alert:distance", alert);
          } else {
            if (io) io.to(`teacher:${teacherId}`).emit("alert:clear", {
              studentId: studentLoc.studentId,
            });
          }
        })
      );  
  
    return alerts;
  };
  
  module.exports = { getDistanceKm, isTooFar, checkAndEmitAlerts };