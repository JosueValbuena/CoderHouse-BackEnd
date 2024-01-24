import { Router } from "express";
import { createProduct, deleteProduct, editProduct, getAllProducts, getAllProductsFromUser, getProductByID } from "../../controllers/products/products.controllers.js";

const productsRoutes = Router();

productsRoutes.get('/all', getAllProducts);

productsRoutes.get('/allproductsuser/:uid', getAllProductsFromUser);

productsRoutes.get('/product/:pid', getProductByID);

productsRoutes.post('/create', createProduct);

productsRoutes.put('/product/:pid/user/:uid', editProduct);

productsRoutes.delete('/delete/:pid/user/:uid', deleteProduct);

export default productsRoutes;