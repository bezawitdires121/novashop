# NovaShop : Advanced Full-Stack eCommerce Platform

> A production-grade, premium eCommerce platform built with Next.js 14, PostgreSQL, Stripe, and Clerk. 

**Live Demo:** [novashop-blush.vercel.app](https://novashop-blush.vercel.app)

---

## Tech Stack

 Frontend [Next.js 14 (App Router), TypeScript, Tailwind CSS ]
 Animations [Framer Motion ]
 Auth [Clerk (social login, JWT, role-based access) ]
 Database [PostgreSQL via Supabase] 
 ORM [Prisma v5] 
 Payments [Stripe Checkout (test + production ready) ]
 Image Storage [Cloudinary ]
 State Management [Zustand (cart, wishlist, preferences) ]
 Deployment [Vercel] 

---

## Features

### Storefront Experience

**Hero Slideshow**

**Categories Page**

**Product Discovery**
      **Product Detail Page**
- Color and size variant selectors that update state dynamically
- Stock level indicator (In Stock / Only X left / Out of Stock)
- Quantity selector with min/max validation
- "You Might Also Like" carousel — products from the same category
- "Frequently Bought Together" section — products from different categories
- Recently Viewed section that persists across the session using localStorage
- Customer review system with star ratings, verified purchase badges, and a rating breakdown histogram

---

### Shopping Cart & Checkout

**Cart Drawer**
Slide-in animated cart drawer with quantity controls, item removal animations, and real-time subtotal calculation. Cart state persists across page reloads using Zustand's localStorage persistence.

**Checkout Flow**
Multi-field shipping form feeding directly into a Stripe Checkout Session. Coupon code system with percentage and fixed-amount discount support. Two working test coupons: `NOVA20` (20% off) and `SAVE50` ($50 off orders over $200).

**Stripe Integration**
Full Stripe Checkout with test card support. After payment, a confirmation page verifies the session, prevents duplicate orders on refresh using a `useRef` guard, creates the order in the database with `PAID` status, and displays the order number.

---

### User Account

**Authentication**
Clerk handles signup, login, social auth, and session management. Role-based access splits users into `USER` and `ADMIN`. Protected routes (checkout, orders, wishlist, profile, admin) redirect unauthenticated users to sign-in automatically via Next.js middleware.

**Order History**
Logged-in users can view all past orders with an animated order tracker showing progression through Confirmed → Processing → Shipped → Delivered stages.

**Wishlist**
Heart icon on every product card toggles wishlist state instantly (Zustand) and syncs to the database. Dedicated `/wishlist` page shows all saved products. Requires sign-in.

**Profile Page**
Displays Clerk user info (name, email, avatar, member since) with quick links to Orders, Wishlist, and Reviews.

---

### Admin Dashboard

Accessible at `/admin` — only users with `ADMIN` role in the database can enter.

**Dashboard Overview**
Live KPI cards: Total Revenue, Total Orders, Product Count, Customer Count. Recent Orders panel with payment status badges. Low Stock Alerts panel highlighting products with 10 or fewer units remaining.

**Products Management**
Full product table with image thumbnails, category, price, stock level, and published status. Delete functionality with confirmation. "Add Product" form with name, description, pricing, stock, image URL preview, color/size variants, category selector, and published/featured toggles.

**Orders Management**
Complete orders table with inline status dropdown — admins can update any order from Pending through to Delivered or Refunded without leaving the page.

**Analytics Dashboard**
Recharts-powered visualizations: Revenue Over Time (line chart), Orders This Week (bar chart), Sales by Category (donut chart with legend). Live KPI cards with simulated month-over-month growth indicators.

---

### Global UX Features

**Currency & Language Selector**
**Dark / Light Mode**
**Review System**
**Coupon System**
Coupons stored in the database with type (percentage or fixed), minimum order amount, maximum uses, and expiry date. Validated server-side on apply.

---

### Security

- Row Level Security (RLS) enabled on all Supabase tables
- Clerk middleware protects all sensitive routes
- Stripe webhook signature verification ready for production webhook setup

---

## Database Schema

15 models: `User`, `Product`, `ProductImage`, `Category`, `Order`, `OrderItem`, `Review`, `WishlistItem`, `Coupon` ,with full relational integrity, enums for order/payment status, and array columns for tags, colors, and sizes.

---
