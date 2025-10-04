import { NextFunction, Request, Response } from "express";
import {db} from '../../db';
import {carts, cartItems, orders, orderItems, products, payments} from "../../db/schema";
import {eq, sql} from "drizzle-orm";
import crypto from "crypto";
import { wss } from "../../server";
import WebSocket from "ws";


export async function createOrderHandler(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.user!.id;

  try {
    const newOrder = await db.transaction(async (tx) => {
      // 1. Get the user's cart and all items with product details
      const userCart = await tx.query.carts.findFirst({
        where: eq(carts.userId, userId),
        with: {
          cartItems: {
            with: {
              product: true,
            },
          },
        },
      });

      if (!userCart || userCart.cartItems.length === 0) {
        throw new Error('Cart is empty');
      }
      //check for sufficient stock before doing anything else
        for(const item of userCart.cartItems) {
            if(item.product.stockQuantity < item.quantity){
                throw new Error(`Not enough stock for product: ${item.product.name}`);
            }
        }

      // 2. Calculate the total amount
      const totalAmount = userCart.cartItems.reduce((total, item) => {
        return total + item.product.price * item.quantity;
      }, 0);

      // 3. Create the main order record (This section is now fixed)
      const [order] = await tx
        .insert(orders)
        .values({
          userId,
          totalAmount, 
          status: 'Paid',
        })
        .returning();

    // Create a payment record
        await tx.insert(payments).values({
            orderId: order.id,
            amount: totalAmount,
            provider: 'mock_razorpay',
            status: "SUCCESS",
            transactionId: `txn_${crypto.randomBytes(10).toString('hex')}`,

        })

      // 4. Create an order_item for each item in the cart
      await tx.insert(orderItems).values(
        userCart.cartItems.map((item) => ({
          orderId: order.id,
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price, // Store the price at time of purchase
        }))
      );
      
      //Decrement product stock quantitiies
      for(const item of userCart.cartItems){
       const [updatedProduct] = await tx.update(products).set({
            stockQuantity: sql`${products.stockQuantity} - ${item.quantity}`,
        })
        .where(eq(products.id, item.productId)).returning();

        const payload = JSON.stringify({
            type: 'INVENTORY_UPDATE',
            productId: updatedProduct.id,
            newStockQuantity: updatedProduct.stockQuantity,
        });

        wss.clients.forEach((client) => {
            if(client.readyState === WebSocket.OPEN) {
                client.send(payload);
            }
        });

      }

      // 5. Clear the user's cart
      await tx.delete(cartItems).where(eq(cartItems.cartId, userCart.id));

      return order;
    });

    return res.status(201).json(newOrder);
  } catch (error) {
    return next(error);
  }
}