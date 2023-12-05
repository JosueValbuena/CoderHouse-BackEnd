import { Router } from "express";

import productsRoutes from "./products/products.routes.js";
import cartsRoutes from "./carts/carts.routes.js";
import usersRoutes from "./users/users.routes.js";
import ticketsRoutes from "./tickets/tickets.routes.js";

const router = Router();

router.use('/api/products', productsRoutes);
router.use('/api/carts', cartsRoutes);
router.use('/api/users', usersRoutes);
router.use('/api/purchases', ticketsRoutes);

export default router;