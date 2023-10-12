import { Router } from "express";

import productsRoutes from "./products/products.routes.js";
import cartsRoutes from "./carts/carts.routes.js";

const router = Router();

router.use('/api/products', productsRoutes);
router.use('/api/carts', cartsRoutes);

export default router;