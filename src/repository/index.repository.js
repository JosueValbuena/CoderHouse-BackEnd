import User from "../dao/users/users.dao.js";
import Product from "../dao/products/products.dao.js";
import UsersRepository from "./users/user.repository.js";
import ProductsRepository from "./products/products.repository.js";
import TicketRepository from "./tickets/tickets.repository.js";
import Ticket from "../dao/tickets/ticket.dao.js";
import { logger } from "../utils/index.logger.js";
import CartsRepository from "./carts/carts.repository.js";
import Cart from "../dao/carts/carts.dao.js";


export const usersService = new UsersRepository(new User(logger));
export const productsService = new ProductsRepository(new Product(logger));
export const ticketService = new TicketRepository(new Ticket());
export const cartsService = new CartsRepository(new Cart());