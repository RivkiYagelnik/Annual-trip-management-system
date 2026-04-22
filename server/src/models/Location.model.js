const mongoose = require("mongoose");
 
const locationSchema = new mongoose.Schema({
  studentId: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    required: true,
  },
});
 
// Index for fast "latest per student" queries
locationSchema.index({ studentId: 1, timestamp: -1 });
 
module.exports = mongoose.model("Location", locationSchema);