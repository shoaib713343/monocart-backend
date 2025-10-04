import {z} from 'zod';

export const createProductSchema = z.object({
    body: z.object({
        name: z.string().min(1, {message: 'Name is required'}),
        description: z.string().optional(),
        price: z.coerce.number().min(0, { message: 'Price must be a positive number' }),
    stockQuantity: z.coerce.number().int().min(0, { message: 'Stock must be a positive integer' }),
    categoryId: z.coerce.number().int().min(1, { message: 'Category is required' }),
    })
})