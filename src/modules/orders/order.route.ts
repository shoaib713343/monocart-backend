// src/modules/orders/order.route.ts
import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth';
import { createOrderHandler } from './order.controller';

const router = Router();

router.post('/', authMiddleware, createOrderHandler);

export default router;