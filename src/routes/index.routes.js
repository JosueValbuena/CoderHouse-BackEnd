import { Router } from "express";

import productsRoutes from "./products/products.routes.js";

const router = Router();

router.use('/api/products', productsRoutes);

export default router;