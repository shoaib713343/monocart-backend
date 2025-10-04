// src/modules/orders/order.route.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { createOrderHandler } from './order.controller';
import { verifiedUserMiddleware } from '../../middleware/verifiedUser';

const router = Router();

router.post('/', authMiddleware, verifiedUserMiddleware, createOrderHandler);

export default router;