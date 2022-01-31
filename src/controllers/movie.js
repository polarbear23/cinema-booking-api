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

const createMovie = async (req, res, next) => {
    const {
        title,
        runtimeMins,
        screenings
    } = req.body;

    const movieExists = await prisma.movie.findMany({
        where: {
            title: title
        }
    });
    console.log("movie already exists", movieExists);
    try {
        if (movieExists.length > 0) {
            throw "movie already Exists"
        }

        const createdMovie = await prisma.movie.create({
            data: {
                title: title,
                runtimeMins: runtimeMins,
                screenings: screenings ? {
                    createMany:
                    {
                        data: screenings
                    }
                } : {

                }
            }
        }
        )
        res.json({ data: createdMovie });
    }
    catch (err) {
        console.error(err);
        next(err);
    }

}

const getSingleMovie = async (req, res) => {
    const { idorname } = req.params;
    const movie = await prisma.movie.findMany({
        where: {
            OR: [{
                title: idorname
            },
            {
                id: isNaN(parseInt(idorname)) ? 0 : parseInt(idorname)
            }
            ]
        }
    })
    console.log("getoneMovie", movie)
    res.json({ data: movie })
}

module.exports = {
    getMovies,
    filterMovies,
    createMovie,
    getSingleMovie
};