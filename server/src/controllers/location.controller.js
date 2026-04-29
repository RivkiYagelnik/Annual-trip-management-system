const locationService = require("../services/location.service");

/**
 * POST /api/location
 * Receives a tracking device ping (no auth – device sends directly)
 */
const receiveLocation = async (req, res) => {
  try {
    const location = await locationService.saveLocation(req.body);
    return res.status(201).json({ success: true, data: location });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

/**
 * GET /api/location/latest
 * Returns latest location per student – teachers only (JWT protected)
 */
const getLatestLocations = async (req, res) => {
  try {
    const locations = await locationService.getLatestLocations();

    const teacherId = req.user.idNumber;
    const { checkAndEmitAlerts } = require("../services/distanceService");
    
    const alerts = await checkAndEmitAlerts(teacherId, locations.map((l) => ({
      studentId: l.studentId,
      latitude: l.latitude,
      longitude: l.longitude,
    })));
    return res.status(200).json({ success: true, data: locations, alerts });
  } catch (err) {
    return res
      .status(err.status || 500)
      .json({ success: false, message: err.message || "Server error" });
  }
};

module.exports = { receiveLocation, getLatestLocations, getAlerts };