const express = require('express');
const router = express.Router();
const { createReview, getReviews, adminLogin, deleteReview } = require('../controllers/reviewController');

router.get('/', getReviews);
router.post('/', createReview);
router.post('/admin/login', adminLogin);
router.delete('/admin/delete/:id', deleteReview);

module.exports = router;