import { ticketService } from "../../repository/index.repository.js";

export const createTicket = async (req, res) => {
    try {
        const { cid, uid } = req.params;
        console.log('controller')
        const result = ticketService.createTicket(uid, cid);
        res.status(201).send({ status: 'success', result });
    } catch (error) {
        res.status(500).json({ status: 'Error', message: 'Error en el servidor', error: error.message })
    };
};