// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 60 },
    comment: { type: String, default: '', trim: true, maxlength: 1000 },
    phone: { type: String, default: '', trim: true, maxlength: 20 },
    coachRating: { type: Number, required: true, min: 1, max: 5 },
    atmosphereRating: { type: Number, required: true, min: 1, max: 5 },
    equipmentRating: { type: Number, required: true, min: 1, max: 5 },
    cleanlinessRating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);