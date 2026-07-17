// server/models/Review.js
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true, // REQUIRED
    trim: true
  },
  phone: {
    type: String,
    required: true, // REQUIRED
    trim: true
  },
  comment: {
    type: String,
    required: false, // OPTIONAL
    trim: true,
    default: ''
  },
  coachRating: { 
    type: Number, 
    required: true, // REQUIRED
    min: 1, 
    max: 5 
  },
  atmosphereRating: { 
    type: Number, 
    required: true, // REQUIRED
    min: 1, 
    max: 5 
  },
  equipmentRating: { 
    type: Number, 
    required: true, // REQUIRED
    min: 1, 
    max: 5 
  },
  cleanlinessRating: { 
    type: Number, 
    required: true, // REQUIRED
    min: 1, 
    max: 5 
  }
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);