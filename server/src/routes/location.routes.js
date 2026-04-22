const express = require("express");
const router = express.Router();
const { receiveLocation, getLatestLocations } = require("../controllers/location.controller");
const authMiddleware = require("../middleware/auth.middleware");

// POST /api/location – open (tracking device, no auth)
router.post("/", receiveLocation);

// GET /api/location/latest – teachers only
router.get("/latest", authMiddleware, getLatestLocations);

module.exports = router;