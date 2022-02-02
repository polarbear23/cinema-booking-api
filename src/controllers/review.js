const { movie } = require('../utils/prisma');
const prisma = require('../utils/prisma');


const postReview = async (req, res) => {
    const { title, content, customerId, movieId } = req.body;
    const createdReview = await prisma.review.create({
        data: {
            title: title,
            content: content,
            customer: {
                connect: {
                    id: customerId
                }
            },
            movie: {
                connect: {
                    id: movieId
                }
            }
        }
    });
    res.json({ data: createdReview });
}

module.exports = { postReview }