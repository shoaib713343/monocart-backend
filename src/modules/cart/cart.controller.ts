import { Request, Response, NextFunction } from "express";
import {db} from '../../db';
import {carts, cartItems} from '../../db/schema';
import {and, eq} from 'drizzle-orm';

export async function addToCartHandler(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const {productId, quantity} = req.body;
        const userId = req.user!.id;

        let [cart] = await db.select().from(carts).where(eq(carts.userId, userId));

        if(!cart){
            [cart] = await db.insert(carts).values({userId}).returning();
        }

        const [existingItem] = await db
        .select()
        .from(cartItems)
        .where(
            and(
            eq(cartItems.cartId, cart.id),
            eq(cartItems.productId, productId)
            )
    );

    if(existingItem) {
        const [updatedItem] = await db
        .update(cartItems)
        .set({ quantity: existingItem.quantity + quantity })
        .where(eq(cartItems.id, existingItem.id))
        .returning();
        return res.status(200).json(updatedItem);
    } else {
        const [newItem] = await db
        .insert(cartItems)
        .values({
            cartId: cart.id,
            productId,
            quantity,
        })
        .returning();
      return res.status(201).json(newItem);
    }
 
    } catch (error) {
        return next(error);
    }
}

export async function getCartHandler(
    req: Request,
    res: Response,
    next: NextFunction
){
    try {
        const userId = req.user!.id;

        const cart = await db.query.carts.findFirst({
            where: eq(carts.userId, userId),
            with: {
                cartItems: {
                    with: {
                        product: true,
                    }
                }
            }
        });
         if (!cart) {
     
      return res.status(200).json({ cartItems: [] });
    }

    return res.status(200).json(cart);
    } catch (error) {
         return next(error);
    }
}

export async function updateCartItemHandler(
    req: Request,
    res: Response,
    next: NextFunction
){
    try{0
        const {itemId} = req.params;
        const {quantity} = req.body;
        const userId = req.user!.id;

        const [item] = await db.select({cartUserId: carts.userId}).from(cartItems)
        .leftJoin(carts, eq(cartItems.cartId, carts.id))
        .where(eq(cartItems.id, Number(itemId)));

        if(!item || item.cartUserId !== userId) {
            return res.status(403).json({message: "Forbidden"});
        }

        const [updatedItem] = await db
        .update(cartItems)
        .set({quantity})
        .where(eq(cartItems.id, Number(itemId)))
        .returning();

        return res.status(200).json(updatedItem);
          } catch (error) {
    return next(error);
  }
}

export async function removeCartItemHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const {itemId} = req.params;
        const userId = req.user!.id;

        const [item] = await db.select({cartUserId: carts.userId}).from(cartItems)
        .leftJoin(carts, eq(cartItems.cartId, carts.id)).where(eq(cartItems.id, Number(itemId)));

        if(!item || item.cartUserId !== userId) {
            return res.status(403).json({ message: "Forbidden"});
        }

        await db.delete(cartItems).where(eq(cartItems.id, Number(itemId)));
         return res.sendStatus(204);
    } catch (error) {
        return next(error);
    }
}