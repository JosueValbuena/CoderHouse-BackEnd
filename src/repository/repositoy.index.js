import User from "../dao/users/users.dao.js";
import Product from "../dao/products/products.dao.js";
import UsersRepository from "./users/user.repository.js";
import ProductsRepository from "./products/products.repository.js";

export const usersService = new UsersRepository(new User());
export const productsService = new ProductsRepository(new Product());