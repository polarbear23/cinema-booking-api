const express = require("express");
const {
    postReview
} = require('../controllers/review');

const router = express.Router();

router.post("/", postReview);

module.exports = router;