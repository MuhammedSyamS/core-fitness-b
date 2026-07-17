const Review = require("../models/Review");

// ==============================
// Create Review
// ==============================
const createReview = async (req, res) => {
    try {
        let { username, phone, comment } = req.body;

        // Validate input
        if (!username || !phone || !comment) {
            return res.status(400).json({
                success: false,
                message: "Username, phone number, and comment are required."
            });
        }

        // Clean phone number
        const cleanPhone = phone.toString().replace(/\D/g, "").trim();

        // Find latest review from this phone
        const lastReview = await Review.findOne({
            phone: cleanPhone,
        }).sort({ createdAt: -1 });

        if (lastReview) {
            const sevenDays = 7 * 24 * 60 * 60 * 1000;
            const timePassed = Date.now() - new Date(lastReview.createdAt).getTime();

            if (timePassed < sevenDays) {
                const daysLeft = Math.ceil((sevenDays - timePassed) / (24 * 60 * 60 * 1000));

                return res.status(429).json({
                    success: false,
                    message: `You have already submitted a review. Please try again in ${daysLeft} day(s).`
                });
            }
        }

        // Save review
        const newReview = await Review.create({
            username,
            phone: cleanPhone,
            comment,
            ...req.body
        });

        return res.status(201).json({
            success: true,
            message: "Review submitted successfully.",
            data: newReview,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ==============================
// Get All Reviews
// ==============================
const getReviews = async (req, res) => {
    try {
        const reviews = await Review.find().sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: reviews.length,
            data: reviews,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ==============================
// Admin Login
// ==============================
const adminLogin = (req, res) => {
    const { key } = req.body;

    if (!key) {
        return res.status(400).json({
            success: false,
            message: "Admin key is required.",
        });
    }

    if (key === process.env.ADMIN_KEY) {
        return res.status(200).json({
            success: true,
            message: "Login successful.",
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid admin key.",
    });
};

// ==============================
// Delete Review
// ==============================
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findByIdAndDelete(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found.",
            });
        }

        return res.status(200).json({
            success: true,
            message: "Review deleted successfully.",
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// ==============================
// Export
// ==============================
module.exports = {
    createReview,
    getReviews,
    adminLogin,
    deleteReview,
};