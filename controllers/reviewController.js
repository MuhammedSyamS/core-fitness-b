// server/controllers/reviewController.js
const Review = require('../models/Review');

const RATING_FIELDS = ['coachRating', 'atmosphereRating', 'equipmentRating', 'cleanlinessRating'];

// GET /api/reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 }).lean();
    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Could not load reviews.' });
  }
};

// POST /api/reviews
exports.createReview = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required.' });
    }

    for (const field of RATING_FIELDS) {
      const value = Number(req.body[field]);
      if (!Number.isFinite(value) || value < 1 || value > 5) {
        return res.status(400).json({ success: false, message: `${field} must be between 1 and 5.` });
      }
    }

    const newReview = await Review.create({
      username: username.trim(),
      phone: req.body.phone ? String(req.body.phone).trim() : '',
      comment: req.body.comment ? String(req.body.comment).trim() : '',
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

// POST /api/reviews/admin/login
exports.adminLogin = (req, res) => {
  const { key } = req.body;
  const cleanUserKey = key ? String(key).trim() : '';
  const envKey = process.env.ADMIN_SECRET_KEY ? String(process.env.ADMIN_SECRET_KEY).trim() : null;
  const hardcodedKey = 'Corefitness@HighP';

  if (cleanUserKey === envKey || cleanUserKey === hardcodedKey) {
    return res.status(200).json({ success: true, message: 'Authenticated' });
  }
  res.status(401).json({ success: false, message: 'Invalid secret credentials token.' });
};

// DELETE /api/reviews/admin/delete/:id
exports.deleteReview = async (req, res) => {
  const clientKey = req.headers['admin-key'];
  const cleanClientKey = clientKey ? String(clientKey).trim() : '';
  const envKey = process.env.ADMIN_SECRET_KEY ? String(process.env.ADMIN_SECRET_KEY).trim() : null;
  const hardcodedKey = 'Corefitness@HighP';

  if (cleanClientKey !== envKey && cleanClientKey !== hardcodedKey) {
    return res.status(403).json({ success: false, message: 'Unauthorized access.' });
  }

  try {
    await Review.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Review deleted successfully.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Deletion failed.' });
  }
};