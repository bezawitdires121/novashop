export type ProductWithImages = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: any;
  comparePrice: any;
  stock: number;
  isPublished: boolean;
  isFeatured: boolean;
  tags: string[];
  categoryId: string | null;
  category: { id: string; name: string; slug: string } | null;
  images: ProductImage[];
  createdAt: Date;
  updatedAt: Date;
};

export type ProductImage = {
  id: string;
  productId: string;
  url: string;
  publicId: string;
  alt: string | null;
  isPrimary: boolean;
  sortOrder: number;
};

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
};

export type OrderWithItems = {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: any;
  shippingCost: any;
  discountAmount: any;
  totalAmount: any;
  shippingAddress: any;
  couponCode: string | null;
  trackingNumber: string | null;
  createdAt: Date;
  items: OrderItem[];
};

export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  productImage: string | null;
  price: any;
  quantity: number;
};

export type ShippingAddress = {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
};