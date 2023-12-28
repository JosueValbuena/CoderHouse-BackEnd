import { Router } from "express";
import { createProduct, deleteProduct, getAllProducts, getProductByID } from "../../controllers/products/products.controllers.js";

const productsRoutes = Router();

productsRoutes.get('/all', getAllProducts);

productsRoutes.get('/:pid', getProductByID);

productsRoutes.post('/create', createProduct);

productsRoutes.delete('/delete/:pid', deleteProduct);

export default productsRoutes;