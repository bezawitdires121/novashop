
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Save } from "lucide-react";
import toast from "react-hot-toast";
import { supabase } from "@/lib/supabase";

export default function NewProductPage() {
  const router = useRouter();

  const [saving, setSaving] = useState(false);

  const [categories, setCategories] = useState<any[]>([]);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    price: "",
    comparePrice: "",
    stock: "",
    categoryId: "",
    isPublished: true,
    isFeatured: false,
    imageUrl: "",
    tags: "",
    colors: "",
    sizes: "",
  });


  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
    setForm({ ...form, name, slug });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.stock) {
      toast.error("Please fill in all required fields");
      return;
    }
    setSaving(true);

    try {
      const productId = "prod_" + Date.now();
      const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);

      const colors = form.colors.split(",").map((c) => c.trim()).filter(Boolean);
      const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);

      const { error: productError } = await supabase.from("Product").insert({
        id: productId,
        name: form.name,
        slug: form.slug || productId,
        description: form.description,
        price: Number(form.price),
        comparePrice: form.comparePrice ? Number(form.comparePrice) : null,
        stock: Number(form.stock),
        categoryId: form.categoryId || null,
        isPublished: form.isPublished,
        isFeatured: form.isFeatured,
        tags,
        colors,
        sizes,
        updatedAt: new Date().toISOString(),
      });

      if (productError) {
        toast.error("Failed to create product: " + productError.message);
        setSaving(false);
        return;
      }

      if (form.imageUrl) {
        await supabase.from("ProductImage").insert({
          id: "img_" + Date.now(),
          productId,
          url: form.imageUrl,
          publicId: "manual_" + productId,
          isPrimary: true,
          sortOrder: 0,
        });
      }

      toast.success("Product created successfully!");
      router.push("/admin/products");
    } catch (error: any) {
      toast.error("Something went wrong");
      setSaving(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 focus:border-[#6272f6] outline-none text-sm text-white transition-colors";
  const labelClass = "block text-sm text-gray-400 mb-2";

  return (
    <div>
      <div className="flex items-center gap-4 mb-8">
        <Link href="/admin/products" className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Add Product</h1>
          <p className="text-gray-400 text-sm">Create a new product listing</p>
        </div>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="grid lg:grid-cols-3 gap-8"
      >
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold mb-5">Product Information</h2>

            <div className="space-y-4">
              <div>
                <label className={labelClass}>Product Name *</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={handleNameChange}
                  placeholder="e.g. Premium Wireless Headphones"
                  className={inputClass}
                  required
                />
              </div>

              <div>
                <label className={labelClass}>Slug (auto-generated)</label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value })}
                  placeholder="product-url-slug"
                  className={inputClass}
                />
              </div>
            
    

              <div>
                <label className={labelClass}>Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  placeholder="Describe the product..."
                  rows={4}
                  className={inputClass + " resize-none"}
                />
              </div>

              <div>
                <label className={labelClass}>Tags (comma separated)</label>
                <input
                  type="text"
                  value={form.tags}
                  onChange={(e) => setForm({ ...form, tags: e.target.value })}
                  placeholder="wireless, premium, audio"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Colors (comma separated, optional)</label>
                <input
                  type="text"
                  value={form.colors}
                  onChange={(e) => setForm({ ...form, colors: e.target.value })}
                  placeholder="Black, White, Navy"
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Sizes (comma separated, optional)</label>
                <input
                  type="text"
                  value={form.sizes}
                  onChange={(e) => setForm({ ...form, sizes: e.target.value })}
                  placeholder="S, M, L, XL"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold mb-5">Pricing & Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Price ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Compare Price ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={form.comparePrice}
                  onChange={(e) => setForm({ ...form, comparePrice: e.target.value })}
                  placeholder="0.00"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Stock Quantity *</label>
               <input
                  type="number"
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="0"
                  className={inputClass}
                  required
                />
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold mb-5">Product Image</h2>
            <div>
              <label className={labelClass}>Image URL</label>
              <input
                type="url"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className={inputClass}
              />
              {form.imageUrl && (
                <img
                  src={form.imageUrl}
                  alt="Preview"
                  className="mt-4 w-32 h-32 rounded-xl object-cover border border-white/10"
                />
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold mb-5">Visibility</h2>
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#6272f6]"
                />
                <span className="text-sm">Published (visible in store)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                  className="w-4 h-4 accent-[#6272f6]"
                />
                <span className="text-sm">Featured product</span>
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-white/5 p-6" style={{ background: "rgba(255,255,255,0.02)" }}>
            <h2 className="font-semibold mb-5">Category</h2>
            <select
              value={form.categoryId}
              onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
              className={inputClass}
            >
              <option value="" className="bg-[#0a0a0f]">No category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id} className="bg-[#0a0a0f]">
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 py-4 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold transition-colors disabled:opacity-60"
          >
            <Save size={18} />
            {saving ? "Saving..." : "Save Product"}
          </motion.button>
        </div>
      </motion.form>
    </div>
  );
}