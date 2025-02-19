const prisma = require('../utils/prisma');


const getMovies = async (req, res) => {
    if (!req.query.filter) {
        const movies = await prisma.movie.findMany({
            where: {
                screenings: {
                    some: {
                        startsAt: {
                            gte: new Date()
                        }
                    }
                }

            },
            include: {
                screenings: true
            }
        })
        console.log("getMovies", movies);
        return res.json({ data: movies });
    }

    const movies = await filterMovies(req, res);
    console.log("getfilteredMovies", movies);
    return res.json({ data: movies });

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

const createMovie = async (req, res) => {
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
        res.status(400).send({
            message: error
        })
    }

}

const getSingleMovie = async (req, res) => {
    const { idorname } = req.params;
    try {
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
        if (movie.length < 1) {
            throw "movie not found"
        }
        console.log("getoneMovie", movie)
        res.json({ data: movie })
    }

    catch (error) {
        console.error(error);
        res.status(400).send({
            message: error
        })
    }
}

const updateSingleMovie = async (req, res) => {
    console.log("update")
    const { id } = req.params;
    const { title, runtimeMins, screenings } = req.body;
    if (screenings) {
        for (let i = 0; i < screenings.length; i++) {
            const updatedScreens = await prisma.screening.update({
                where: {
                    id: screenings[i].id
                },
                data: {
                    screenId: screenings[i].screenId,
                    startsAt: screenings[i].startsAt
                }
            })
        }
    }
    const updatedMovie = await prisma.movie.update({
        where: {
            id: parseInt(id)
        },
        data: {
            title: title,
            runtimeMins: runtimeMins,
        },
        include: {
            screenings: true
        }
    })

    res.json({ data: updatedMovie })
}

module.exports = {
    getMovies,
    filterMovies,
    createMovie,
    getSingleMovie,
    updateSingleMovie
};