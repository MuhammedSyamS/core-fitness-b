// server/controllers/reviewController.js
const Review = require('../models/Review');

const RATING_FIELDS = ['coachRating', 'atmosphereRating', 'equipmentRating', 'cleanlinessRating'];

// GET /api/reviews
exports.getReviews = async (req, res) => {
  try {
    // .lean() skips Mongoose document hydration since we only need
    // plain JSON back to the client — noticeably faster on larger lists.
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load reviews. Please try again.' });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { username, comment } = req.body;

    if (!username || !username.trim() || !comment || !comment.trim()) {
      console.warn('Rejected review — missing name/comment. Received body:', req.body);
      return res.status(400).json({ success: false, message: 'Name and comment are required.' });
    }

    for (const field of RATING_FIELDS) {
      const value = Number(req.body[field]);
      if (!Number.isFinite(value) || value < 1 || value > 5) {
        console.warn(`Rejected review — bad "${field}" value:`, req.body[field], 'Full body:', req.body);
        return res.status(400).json({ success: false, message: `${field} must be between 1 and 5.` });
      }
    }

    const newReview = await Review.create({
      username: username.trim(),
      comment: comment.trim(),
      coachRating: Number(req.body.coachRating),
      atmosphereRating: Number(req.body.atmosphereRating),
      equipmentRating: Number(req.body.equipmentRating),
      cleanlinessRating: Number(req.body.cleanlinessRating),
    });

    res.status(201).json({ success: true, data: newReview });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};