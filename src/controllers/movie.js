const prisma = require('../utils/prisma');


const getMovies = async (req, res) => {
    if (!req.query.filter) {
        const movies = await prisma.movie.findMany({
            include: {
                screenings: true
            }
        })
        console.log("getMovies", movies);
        res.json({ data: movies });
    }
    if (req.query.filter) {
        const movies = await filterMovies(req, res);
        console.log("getfilteredMovies", movies);
        res.json({ data: movies });
    }
}

const filterMovies = async (req, res) => {
    // filter
    const movies = await prisma.movie.findMany({
        where: {
            runtimeMins: req.query.filter === "lessthan" ? {
                lte: parseInt(req.query.runtime)
            } : {
                gte: parseInt(req.query.runtime)
            }
        },
        include: {
            screenings: true
        }
    })
    return movies;

}

module.exports = {
    getMovies,
    filterMovies
};