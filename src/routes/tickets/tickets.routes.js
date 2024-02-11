import { Router } from "express";
import { createTicket, getTicket } from "../../controllers/tickets/tickets.controllers.js";

const ticketsRoutes = Router();

ticketsRoutes.get('/getticket/:phid/user/:uid', getTicket);

ticketsRoutes.post('/createpurchase/cart/:cid/user/:uid', createTicket);

export default ticketsRoutes;
