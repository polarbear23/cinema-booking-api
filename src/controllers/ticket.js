const prisma = require('../utils/prisma');


const createTicket = async (req, res) => {
    const { screeningId, customerId } = req.body;
    const createdTicket = await prisma.ticket.create({
        data: {
            screeningId,
            customerId
        },
        include: {
            customer: true,
            screening: true,
            screening: {
                include: {
                    movie: true,
                    screen: true
                }
            }
        }
    })
    res.json({ data: createdTicket });
}

module.exports = { createTicket }