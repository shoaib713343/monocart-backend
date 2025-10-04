import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { addToCartSchema, deleteCartItemSchema, updateCartItemSchema } from "./cart.schema";
import { addToCartHandler, getCartHandler, removeCartItemHandler, updateCartItemHandler } from "./cart.controller";





const router = Router();

router.get('/', authMiddleware, getCartHandler);
router.post('/', authMiddleware, validate(addToCartSchema), addToCartHandler);
router.put('/items/:itemId', authMiddleware, validate(updateCartItemSchema), updateCartItemHandler);
router.delete('/items/:itemId', authMiddleware, validate(deleteCartItemSchema), removeCartItemHandler);


export default router;