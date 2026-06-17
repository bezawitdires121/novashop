import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const electronics = await prisma.category.upsert({
    where: { slug: "electronics" },
    update: {},
    create: {
      name: "Electronics",
      slug: "electronics",
      description: "Cutting-edge tech and gadgets",
    },
  });

  const apparel = await prisma.category.upsert({
    where: { slug: "apparel" },
    update: {},
    create: {
      name: "Apparel",
      slug: "apparel",
      description: "Premium clothing",
    },
  });

  const home = await prisma.category.upsert({
    where: { slug: "home-living" },
    update: {},
    create: {
      name: "Home & Living",
      slug: "home-living",
      description: "Elevate your space",
    },
  });

  const products = [
    {
      name: "ProMax Wireless Headphones",
      slug: "promax-wireless-headphones",
      description: "Studio-quality sound with 40-hour battery life and active noise cancellation. Premium materials, all-day comfort.",
      price: 299.99,
      comparePrice: 399.99,
      stock: 47,
      categoryId: electronics.id,
      isFeatured: true,
      isPublished: true,
      tags: ["audio", "wireless"],
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
    },
    {
      name: "NovaPad Pro 12",
      slug: "novapad-pro-12",
      description: "The ultimate tablet for creatives. 12-inch OLED display, lightning-fast chip, all-day battery life.",
      price: 899.0,
      comparePrice: 1099.0,
      stock: 23,
      categoryId: electronics.id,
      isFeatured: true,
      isPublished: true,
      tags: ["tablet", "oled"],
      image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80",
    },
    {
      name: "Urban Minimal Watch",
      slug: "urban-minimal-watch",
      description: "Swiss-movement timepiece with sapphire crystal and 5ATM water resistance. Timeless design.",
      price: 245.0,
      comparePrice: null,
      stock: 12,
      categoryId: electronics.id,
      isFeatured: false,
      isPublished: true,
      tags: ["watch", "minimal"],
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80",
    },
    {
      name: "Merino Wool Crewneck",
      slug: "merino-wool-crewneck",
      description: "100% extra-fine merino wool. Temperature-regulating, odor-resistant, sustainably sourced.",
      price: 128.0,
      comparePrice: 160.0,
      stock: 85,
      categoryId: apparel.id,
      isFeatured: true,
      isPublished: true,
      tags: ["wool", "sustainable"],
      image: "https://images.unsplash.com/photo-1578587018452-892bacefd3f2?w=800&q=80",
    },
    {
      name: "Ergonomic Desk Chair",
      slug: "ergonomic-desk-chair",
      description: "12-point lumbar support, breathable mesh, fully adjustable. All-day comfort guaranteed.",
      price: 649.0,
      comparePrice: 849.0,
      stock: 8,
      categoryId: home.id,
      isFeatured: true,
      isPublished: true,
      tags: ["ergonomic", "office"],
      image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=800&q=80",
    },
    {
      name: "Smart Home Hub",
      slug: "smart-home-hub",
      description: "Control every device in your home from one place. Compatible with all major smart home ecosystems.",
      price: 149.0,
      comparePrice: 199.0,
      stock: 31,
      categoryId: electronics.id,
      isFeatured: false,
      isPublished: true,
      tags: ["smart-home", "iot"],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
    },
  ];

  for (const p of products) {
    const { image, ...productData } = p;
    const product = await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        ...productData,
        images: {
          create: [{ url: image, publicId: `seed_${p.slug}`, isPrimary: true, sortOrder: 0 }],
        },
      },
    });
    console.log(`Created product: ${product.name}`);
  }

  console.log("Seeding complete!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });