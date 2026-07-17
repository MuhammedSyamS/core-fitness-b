// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, trim: true, maxlength: 60 },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
    coachRating: { type: Number, required: true, min: 1, max: 5 },
    atmosphereRating: { type: Number, required: true, min: 1, max: 5 },
    equipmentRating: { type: Number, required: true, min: 1, max: 5 },
    cleanlinessRating: { type: Number, required: true, min: 1, max: 5 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Reviews are always listed newest-first — index it so that query
// stays fast as the collection grows instead of full-scanning + sorting.
reviewSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Review', reviewSchema);