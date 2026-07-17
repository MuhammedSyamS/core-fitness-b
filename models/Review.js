const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: { type: String, required: true },
  phone: { type: String, required: true },
  comment: { type: String, required: true },
  coachRating: Number,
  atmosphereRating: Number,
  equipmentRating: Number,
  cleanlinessRating: Number
}, { timestamps: true }); // <--- THIS IS REQUIRED FOR lastReview.createdAt TO WORK

module.exports = mongoose.model('Review', reviewSchema);