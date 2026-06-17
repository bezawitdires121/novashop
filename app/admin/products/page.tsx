"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import toast from "react-hot-toast";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = () => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm("Delete this product? This cannot be undone.")) return;

    const res = await fetch("/api/admin/products/" + id, { method: "DELETE" });
    if (res.ok) {
      toast.success("Product deleted");
      loadProducts();
    } else {
      toast.error("Failed to delete product");
    }
  };

  if (loading) {
    return <p className="text-gray-500">Loading products...</p>;
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Products</h1>
          <p className="text-gray-400">Manage your product catalog</p>
        </div>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#6272f6] hover:bg-[#4f54ea] text-white font-semibold transition-colors"
        >
          <Plus size={18} />
          Add Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-500">
          <Package size={48} className="mx-auto mb-4 text-gray-700" />
          No products yet.
        </div>
      ) : (
        <div className="rounded-2xl border border-white/5 overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/5 text-left text-gray-500">
                <th className="px-5 py-3 font-medium">Product</th>
                <th className="px-5 py-3 font-medium">Category</th>
                <th className="px-5 py-3 font-medium">Price</th>
                <th className="px-5 py-3 font-medium">Stock</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product, i) => (
                <motion.tr
                  key={product.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.images && product.images[0] ? product.images[0].url : ""}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <span className="font-medium line-clamp-1">{product.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-400">
                    {product.category ? product.category.name : "-"}
                  </td>
                  <td className="px-5 py-4 font-semibold">{formatPrice(Number(product.price))}</td>
                  <td className="px-5 py-4">
                    <span className={product.stock <= 10 ? "text-orange-400" : "text-gray-300"}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={"px-2 py-1 rounded-full text-xs " + (product.isPublished ? "text-green-400 bg-green-400/10" : "text-gray-400 bg-gray-400/10")}>
                      {product.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={"/admin/products/" + product.id + "/edit"}
                        className="p-2 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-colors"
                      >
                        <Pencil size={15} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}