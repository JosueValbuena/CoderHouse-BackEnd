import { Router } from "express";
import { createTicket } from "../../controllers/tickets/tickets.controllers.js";

const ticketsRoutes = Router();

ticketsRoutes.post('/:cid/purchase/:uid', createTicket);

export default ticketsRoutes;
