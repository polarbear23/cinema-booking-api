const express = require("express");
const {
    getMovies, createMovie, getSingleMovie
} = require('../controllers/movie');

const router = express.Router();

router.get("/", getMovies);
router.post("/", createMovie);
router.get("/:idorname", getSingleMovie);


module.exports = router;
