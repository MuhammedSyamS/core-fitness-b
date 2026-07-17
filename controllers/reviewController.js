// server/controllers/reviewController.js
const Review = require('../models/Review'); // Correct direct import of the model

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const { 
      username, 
      phone, 
      comment, 
      coachRating, 
      atmosphereRating, 
      equipmentRating, 
      cleanlinessRating 
    } = req.body;

    // 1. Validation check for required fields
    if (!username || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'Name and Phone number are required fields.' 
      });
    }

    if (!coachRating || !atmosphereRating || !equipmentRating || !cleanlinessRating) {
      return res.status(400).json({ 
        success: false, 
        message: 'All star ratings are required.' 
      });
    }

    // 2. Check for the 7-day rate-limiting block per phone number
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    const existingReview = await Review.findOne({
      phone: phone.trim(),
      createdAt: { $gte: oneWeekAgo }
    });

    if (existingReview) {
      const nextAvailableTime = new Date(existingReview.createdAt);
      nextAvailableTime.setDate(nextAvailableTime.getDate() + 7);

      return res.status(429).json({
        success: false,
        isLocked: true,
        message: 'You have already submitted a review this week.',
        nextAvailableTime: nextAvailableTime.toISOString()
      });
    }

    // 3. Save the new review (comment will default to "" if empty)
    const newReview = new Review({
      username: username.trim(),
      phone: phone.trim(),
      comment: comment ? comment.trim() : '',
      coachRating,
      atmosphereRating,
      equipmentRating,
      cleanlinessRating
    });

    await newReview.save();

    res.status(201).json({
      success: true,
      data: newReview
    });

  } catch (error) {
    console.error('Error saving review:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while submitting your review.' 
    });
  }
};

// Get all reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching review log feed.' 
    });
  }
};

// Admin delete review
exports.deleteReview = async (req, res) => {
  try {
    const adminKeyHeader = req.headers['admin-key'];
    if (adminKeyHeader !== process.env.ADMIN_SECRET_KEY) {
      return res.status(403).json({ success: false, message: 'Unauthorized action.' });
    }

    const deletedReview = await Review.findByIdAndDelete(req.params.id);
    if (!deletedReview) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    res.status(200).json({ success: true, message: 'Review successfully deleted.' });
  } catch (error) {
    console.error('Error deleting review:', error);
    res.status(500).json({ success: false, message: 'Server error during deletion.' });
  }
};

// Admin login validation
exports.adminLogin = async (req, res) => {
  try {
    const { key } = req.body;
    if (key === process.env.ADMIN_SECRET_KEY) {
      return res.status(200).json({ success: true });
    }
    res.status(401).json({ success: false, message: 'Invalid secret credentials token.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server authentication error.' });
  }
};