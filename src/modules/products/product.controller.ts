import { Request, Response, NextFunction } from 'express';
import {db} from '../../db';
import {products} from '../../db/schema';
import { and, asc, desc, eq } from 'drizzle-orm';

export async function createProductHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const { name, description, price, stockQuantity, categoryId } = req.body;

        const imagePath = req.file?.path;

         const newProduct = await db
      .insert(products)
      .values({
        name,
        description,
        price,
        stockQuantity,
        categoryId,
        images: imagePath ? [imagePath] : [], 
      })
      .returning();
      return res.status(201).json(newProduct[0]);
    } catch (error) {
        return next(error);
    }
}

export async function listProductsHandler(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        //Pagination
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const offsett = (page-1) * limit;

        //Filtering
        const whereConditions = [];
        if(req.query.categoryId){
            const categoryId = parseInt(req.query.categoryId as string);
            whereConditions.push(eq(products.categoryId, categoryId));
        }

        //sorting
        let orderByClause = [desc(products.id)];
        if(req.query.sortBy === 'price'){
            if(req.query.order === 'asc') {
                orderByClause = [asc(products.price)];
            }else {
        orderByClause = [desc(products.price)];
      }
        }
        //Database query
        const productList = await db.query.products.findMany({
            with: {
                category: true,
            },
            where: and(...whereConditions),
            orderBy: orderByClause,
            limit: limit,
            offset: offsett,
        });
         return res.status(200).json(productList);
    } catch (error) {
        return next(error);
    }
}