"use client";
import RecentlyViewed, { addRecentlyViewed } from "@/components/common/RecentlyViewed";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShoppingBag, Star, Truck, Shield, RotateCcw } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import ProductCarousel from "@/components/common/ProductCarousel";
import { useCartStore } from "@/store/cart";
import toast from "react-hot-toast";
import ReviewSection from "@/components/product/ReviewSection";
export default function ProductDetailPage() {
  const params = useParams();
  const [product, setProduct] = useState<any>(null);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const addItem = useCartStore((state) => state.addItem);
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        const found = data.find((p: any) => p.slug === params.slug);
        setProduct(found || null);
        setAllProducts(Array.isArray(data) ? data : []);
        if (found) addRecentlyViewed(found.id);
        if (found && found.colors && found.colors.length > 0) setSelectedColor(found.colors[0]);
        if (found && found.sizes && found.sizes.length > 0) setSelectedSize(found.sizes[0]);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [params.slug]);
  const relatedProducts = allProducts.filter(function(p) {
    return product && p.id !== product.id && p.categoryId === product.categoryId;
  }).slice(0, 8);
  const frequentlyBought = allProducts.filter(function(p) {
    return product && p.id !== product.id && p.categoryId !== product.categoryId;
  }).slice(0, 3);
  if (loading) {
    return <main className="min-h-screen bg-[#05050a] pt-32 flex items-center justify-center"><div className="text-gray-500">Loading...</div></main>;
  }
  if (!product) {
    return <main className="min-h-screen bg-[#05050a] pt-32 flex items-center justify-center text-white">Product not found.</main>;
  }
  const image = product.images[0] ? product.images[0].url : "";
  const discount = product.comparePrice ? Math.round(((Number(product.comparePrice) - Number(product.price)) / Number(product.comparePrice)) * 100) : null;
  const handleAddToCart = () => {
    addItem({ id: product.id, productId: product.id, name: product.name, price: Number(product.price), image: image, quantity: quantity, stock: product.stock });
    toast.success(quantity + " x " + product.name + " added to cart");
  };
  return (
    <main className="min-h-screen bg-[#05050a] text-white pt-28 pb-20 px-6">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="relative rounded-3xl overflow-hidden border border-white/5 aspect-square" style={{ background: "rgba(255,255,255,0.02)" }}>
          <img src={image} alt={product.name} className="w-full h-full object-cover" />
          {discount && discount > 0 && (
            <div className="absolute top-4 left-4 px-3 py-1.5 rounded-lg bg-[#6272f6] text-white text-sm font-bold">-{discount}% OFF</div>
          )}
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col">
          {product.category && <p className="text-sm text-[#8196fb] font-medium mb-2 uppercase tracking-wide">{product.category.name}</p>}
          <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
          <div className="flex items-center gap-2 mb-6">
            {[1,2,3,4,5].map((i) => (<Star key={i} size={16} className="fill-[#6272f6] text-[#6272f6]" />))}
            <span className="text-gray-500 text-sm ml-1">(128 reviews)</span>
          </div>
          <div className="flex items-baseline gap-3 mb-6">
            <span className="text-4xl font-bold">{formatPrice(Number(product.price))}</span>
            {product.comparePrice && <span className="text-xl text-gray-500 line-through">{formatPrice(Number(product.comparePrice))}</span>}
          </div>
          <p className="text-gray-400 leading-relaxed mb-8">{product.description}</p>
          <div className="mb-6">
            {product.stock > 0 ? (
              <span className="inline-flex items-center gap-2 text-sm text-green-400"><span className="w-2 h-2 rounded-full bg-green-400" />In Stock ({product.stock} available)</span>
            ) : (
              <span className="inline-flex items-center gap-2 text-sm text-red-400"><span className="w-2 h-2 rounded-full bg-red-400" />Out of Stock</span>
            )}
          </div>
          {product.colors && product.colors.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Color: <span className="text-white">{selectedColor}</span></p>
              <div className="flex gap-2">
                {product.colors.map((color: string) => (
                  <button key={color} onClick={() => setSelectedColor(color)} className={(selectedColor === color ? "border-[#6272f6] bg-[#6272f6]/10 text-white" : "border-white/10 text-gray-400") + " px-4 py-2 rounded-xl border text-sm transition-colors"}>{color}</button>
                ))}
              </div>
            </div>
          )}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mb-6">
              <p className="text-sm text-gray-400 mb-3">Size: <span className="text-white">{selectedSize}</span></p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((size: string) => (
                  <button key={size} onClick={() => setSelectedSize(size)} className={(selectedSize === size ? "border-[#6272f6] bg-[#6272f6]/10 text-white" : "border-white/10 text-gray-400") + " w-12 h-10 rounded-xl border text-sm font-medium transition-colors"}>{size}</button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-gray-400">Quantity</span>
            <div className="flex items-center gap-3 rounded-xl border border-white/10 px-3 py-2">
              <button onClick={() => setQuantity(function(q) { return Math.max(1, q-1); })} className="text-lg hover:text-[#6272f6] transition-colors">-</button>
              <span className="w-8 text-center">{quantity}</span>
              <button onClick={() => setQuantity(function(q) { return Math.min(product.stock, q+1); })} className="text-lg hover:text-[#6272f6] transition-colors">+</button>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={handleAddToCart} disabled={product.stock === 0} className="flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold text-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed mb-8">
            <ShoppingBag size={20} />
            {product.stock === 0 ? "Sold Out" : "Add to Cart"}
          </motion.button>
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/5">
            <div className="flex flex-col items-center text-center gap-2"><Truck size={20} className="text-[#6272f6]" /><span className="text-xs text-gray-500">Fast Delivery</span></div>
            <div className="flex flex-col items-center text-center gap-2"><Shield size={20} className="text-[#6272f6]" /><span className="text-xs text-gray-500">Secure Payment</span></div>
            <div className="flex flex-col items-center text-center gap-2"><RotateCcw size={20} className="text-[#6272f6]" /><span className="text-xs text-gray-500">Easy Returns</span></div>
          </div>
        </motion.div>
      </div>
      {relatedProducts.length > 0 && (
        <div className="mt-8">
          <ProductCarousel products={relatedProducts} title="You Might Also Like" subtitle={product.category ? "More from " + product.category.name : "Related Products"} />
        </div>
      )}
      {frequentlyBought.length > 0 && (
        <div className="max-w-6xl mx-auto mt-8">
          <h2 className="text-2xl font-bold mb-6">Frequently Bought Together</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {frequentlyBought.map((p) => (
              <a key={p.id} href={"/products/" + p.slug} className="flex gap-4 p-4 rounded-2xl border border-white/5 hover:border-[#6272f6]/30 transition-colors" style={{ background: "rgba(255,255,255,0.02)" }}>
                <img src={p.images && p.images[0] ? p.images[0].url : ""} alt={p.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <p className="text-sm font-medium line-clamp-1">{p.name}</p>
                  <p className="text-[#8196fb] font-semibold mt-1">{formatPrice(Number(p.price))}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      )}
      <RecentlyViewed currentId={product.id} allProducts={allProducts} />
      <ReviewSection productId={product.id} />
    </main>
  );
}