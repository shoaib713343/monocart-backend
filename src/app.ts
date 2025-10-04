import express from 'express';
import userRoutes from './modules/users/user.route';
import productRoutes from './modules/products/product.route';
import cartRoutes from './modules/cart/cart.route';
import orderRoutes from './modules/orders/order.route';
import { errorHandler } from './middleware/errorHandler';

const app = express();

app.use(express.json());

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);
app.use('/api/v1/cart', cartRoutes);
app.use('/api/v1/orders', orderRoutes);

app.use(errorHandler);

export default app;