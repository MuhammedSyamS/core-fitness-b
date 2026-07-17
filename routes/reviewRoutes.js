const express = require('express');
const router = express.Router();
const { 
  getReviews, 
  createReview, 
  adminLogin, 
  deleteReview 
} = require('../controllers/reviewController');

// Standard Public Pipelines
router.get('/', getReviews);
router.post('/', createReview);

// Secure Admin System Sub-routes
router.post('/admin/login', adminLogin);
router.delete('/admin/delete/:id', deleteReview);

module.exports = router;