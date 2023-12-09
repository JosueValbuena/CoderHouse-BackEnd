import User from "../dao/users/users.dao.js";
import Product from "../dao/products/products.dao.js";
import UsersRepository from "./users/user.repository.js";
import ProductsRepository from "./products/products.repository.js";
import TicketRepository from "./tickets/tickets.repository.js";
import Ticket from "../dao/tickets/ticket.dao.js";
import { logger } from "../utils/index.logger.js";


export const usersService = new UsersRepository(new User(logger));
export const productsService = new ProductsRepository(new Product());
export const ticketService = new TicketRepository(new Ticket());