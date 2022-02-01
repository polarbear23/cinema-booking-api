const express = require("express");
const {
    getMovies, createMovie, getSingleMovie, updateSingleMovie
} = require('../controllers/movie');

const router = express.Router();

router.get("/", getMovies);
router.post("/", createMovie);
router.get("/:idorname", getSingleMovie);
router.put("/:id/edit", updateSingleMovie)

module.exports = router;
