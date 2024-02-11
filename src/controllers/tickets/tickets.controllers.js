import { ticketService } from "../../repository/index.repository.js";

export const getTicket = async (req, res) => {
    try {
        const { phid, uid } = req.params;
        const result = await ticketService.getTicket(phid, uid);
        res.status(200).json({
            status: 'Success',
            message: 'Consulta de compra realizada con exito',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor',
            error: error.message
        })
    };
};

export const createTicket = async (req, res) => {
    try {
        const { cid, uid } = req.params;
        const result = await ticketService.createTicket(uid, cid);
        console.log({ result });
        res.status(201).send({
            status: 'Success',
            payload: result
        });
    } catch (error) {
        res.status(500).json({
            status: 'Error',
            message: 'Error en el servidor',
            error: error.message
        });
    };
};