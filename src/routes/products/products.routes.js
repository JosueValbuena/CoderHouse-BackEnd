import { Router } from "express";
import { createProduct, deleteProductByUserOwner, editProductByAdmin, editProductByUserOwner, getAllProducts, getAllProductsFromUser, getProductByID } from "../../controllers/products/products.controllers.js";

const productsRoutes = Router();

productsRoutes.get('/all', getAllProducts);

productsRoutes.get('/allproductsuser/:uid', getAllProductsFromUser);

productsRoutes.get('/product/:pid', getProductByID);

productsRoutes.post('/create', createProduct);

productsRoutes.put('/product/:pid/user/:uid', editProductByUserOwner);

productsRoutes.put('/product/:pid/useradmin', editProductByAdmin);

productsRoutes.delete('/delete/:pid/user/:uid', deleteProductByUserOwner);

export default productsRoutes;