// src/db/schema.ts
import { relations } from 'drizzle-orm';
// Import everything as 'pgCore'
import * as pgCore from 'drizzle-orm/pg-core';

// --- User Schema ---
export const roleEnum = pgCore.pgEnum('role', ['admin', 'customer']);

export const users = pgCore.pgTable('users', {
  id: pgCore.serial('id').primaryKey(),
  fullName: pgCore.text('full_name').notNull(),
  email: pgCore.varchar('email', { length: 256 }).notNull().unique(),
  password: pgCore.text('password').notNull(),
  role: roleEnum('role').default('customer').notNull(),
  isEmailVerified: pgCore.boolean('is_email_verified').default(false).notNull(),
  emailVerificationToken: pgCore.text('email_verification_token'),
  phone: pgCore.varchar('phone', { length: 20 }),
  isPhoneVerified: pgCore.boolean('is_phone_verified').default(false).notNull(),
  phoneOtp: pgCore.varchar('phone_otp', { length: 10 }),
  phoneOtpExpires: pgCore.timestamp('phone_otp_expires'),
});

// --- Categories Table ---
export const categories = pgCore.pgTable('categories', {
  id: pgCore.serial('id').primaryKey(),
  name: pgCore.varchar('name', { length: 256 }).notNull().unique(),
});

// --- Products Table ---
export const products = pgCore.pgTable('products', {
  id: pgCore.serial('id').primaryKey(),
  name: pgCore.varchar('name', { length: 256 }).notNull(),
  description: pgCore.text('description'),
  price: pgCore.integer('price').notNull(),
  images: pgCore.json('images').$type<string[]>().default([]),
  stockQuantity: pgCore.integer('stock_quantity').notNull(),
  categoryId: pgCore.integer('category_id')
    .notNull()
    .references(() => categories.id),
});

// --- Carts & Cart Items Schemas ---
export const carts = pgCore.pgTable('carts', {
    id: pgCore.serial('id').primaryKey(),
    userId: pgCore.integer('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
});

export const cartItems = pgCore.pgTable('cart_items', {
    id: pgCore.serial('id').primaryKey(),
    cartId: pgCore.integer('cart_id').notNull().references(() => carts.id, { onDelete: 'cascade' }),
    productId: pgCore.integer('product_id').notNull().references(() => products.id, { onDelete: 'cascade' }),
    quantity: pgCore.integer('quantity').notNull().default(1),
});

// --- Orders & Order Items Schemas ---
export const orderStatusEnum = pgCore.pgEnum('order_status', ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']);

export const orders = pgCore.pgTable('orders', {
    id: pgCore.serial('id').primaryKey(),
    userId: pgCore.integer('user_id').notNull().references(() => users.id),
    totalAmount: pgCore.integer('total_amount').notNull(),
    status: orderStatusEnum('status').default('Pending').notNull(),
    createdAt: pgCore.timestamp('created_at').defaultNow().notNull(),
});

export const orderItems = pgCore.pgTable('order_items', {
    id: pgCore.serial('id').primaryKey(),
    orderId: pgCore.integer('order_id').notNull().references(() => orders.id, { onDelete: 'cascade' }),
    productId: pgCore.integer('product_id').notNull().references(() => products.id),
    quantity: pgCore.integer('quantity').notNull(),
    price: pgCore.integer('price').notNull(),
});

// --- Payments Schema ---
export const paymentStatusEnum = pgCore.pgEnum('payment_status', ['PENDING', 'SUCCESS', 'FAILED']);
export const paymentProviderEnum = pgCore.pgEnum('payment_provider', ['mock_razorpay']);

export const payments = pgCore.pgTable('payments', {
    id: pgCore.serial('id').primaryKey(),
    orderId: pgCore.integer('order_id').notNull().references(() => orders.id),
    amount: pgCore.integer('amount').notNull(),
    provider: paymentProviderEnum('provider'),
    status: paymentStatusEnum('status').notNull(),
    transactionId: pgCore.varchar('transaction_id'),
    createdAt: pgCore.timestamp('created_at').defaultNow().notNull(),
});


// --- RELATIONS ---
// (Relations code remains the same as it doesn't use the pgCore prefix)
export const productRelations = relations(products, ({ one }) => ({
    category: one(categories, { fields: [products.categoryId], references: [categories.id] }),
}));
export const categoryRelations = relations(categories, ({ many }) => ({ products: many(products) }));
export const cartsRelations = relations(carts, ({ one, many }) => ({
    user: one(users, { fields: [carts.userId], references: [users.id] }),
    cartItems: many(cartItems),
}));
export const cartItemsRelations = relations(cartItems, ({ one }) => ({
    cart: one(carts, { fields: [cartItems.cartId], references: [carts.id] }),
    product: one(products, { fields: [cartItems.productId], references: [products.id] }),
}));
export const orderRelations = relations(orders, ({ one, many }) => ({
    user: one(users, { fields: [orders.userId], references: [users.id] }),
    orderItems: many(orderItems),
    payment: one(payments, { fields: [orders.id], references: [payments.orderId] }),
}));
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
    order: one(orders, { fields: [orderItems.orderId], references: [orders.id] }),
    product: one(products, { fields: [orderItems.productId], references: [products.id] }),
}));
export const paymentRelations = relations(payments, ({ one }) => ({
    order: one(orders, { fields: [payments.orderId], references: [orders.id] }),
}));