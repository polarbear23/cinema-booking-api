const prisma = require('../utils/prisma');


const createScreen = async (req, res) => {
    const { number, screenings } = req.body;
    const createdScreen = await prisma.screen.create({
        data: {
            number: number,
            screenings: screenings ? {
                createMany: {
                    data: screenings
                }
            } : {

            }
        },
        include: {
            screenings: true
        }
    })
    res.json({ data: createdScreen })
}



module.exports = {
    createScreen
}