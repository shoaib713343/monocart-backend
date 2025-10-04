import { Router } from "express";
import { authMiddleware } from "../../middleware/auth";
import { validate } from "../../middleware/validate";
import { addToCartSchema, deleteCartItemSchema, updateCartItemSchema } from "./cart.schema";
import { addToCartHandler, getCartHandler, removeCartItemHandler, updateCartItemHandler } from "./cart.controller";
import { verifiedUserMiddleware } from "../../middleware/verifiedUser";





const router = Router();

router.get('/', authMiddleware, getCartHandler);
router.post('/', authMiddleware, verifiedUserMiddleware, validate(addToCartSchema), addToCartHandler);
router.put('/items/:itemId', authMiddleware, verifiedUserMiddleware,  validate(updateCartItemSchema), updateCartItemHandler);
router.delete('/items/:itemId', authMiddleware, verifiedUserMiddleware, validate(deleteCartItemSchema), removeCartItemHandler);


export default router;