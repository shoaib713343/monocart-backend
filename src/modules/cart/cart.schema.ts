import {z} from 'zod';

export const addToCartSchema = z.object({
    body: z.object({
        productId: z.number(),
        quantity: z.number().int().min(1),
    }),
});

export const updateCartItemSchema = z.object({
    body: z.object({
        quantity: z.number().int().min(1, 'Quanity must be at least 1'),
    }),
    params: z.object({
        itemId: z.coerce.number(),
    }),
});

export const deleteCartItemSchema = z.object({
    params: z.object({
        itemId: z.coerce.number(),
    }),
});