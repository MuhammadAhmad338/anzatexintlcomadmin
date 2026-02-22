"use client";

import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getProducts, deleteProduct } from "../../store/slices/productsSlice";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Eye, Package, Tag, List } from "lucide-react";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category?: any;
  images: string[];
  stock: number;
  brand: string;
  isActive: boolean;
  createdAt?: string;
}

export default function Products() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { products, loading } = useAppSelector((state: any) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleDelete = async (id: string) => {
    if (window.confirm("Delete this product from inventory?")) {
      try {
        await dispatch(deleteProduct(id)).unwrap();
        dispatch(getProducts());
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-10">
        <h1 className="text-3xl font-black text-neutral-900 tracking-tight">Products</h1>
        <p className="text-neutral-400 text-xs font-bold uppercase tracking-widest mt-2">
          Master Inventory & Catalog Management
        </p>
      </div>

      {/* Main Table Interface */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/50">
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Preview</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Title</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Price</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Stock</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Active Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {products.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-neutral-400">
                    <div className="flex flex-col items-center">
                      <Package size={40} strokeWidth={1} className="mb-4 opacity-20" />
                      <p className="text-sm font-medium">No products listed in your inventory yet.</p>
                      <button
                        onClick={() => router.push("/dashboard/products/add")}
                        className="mt-4 text-xs font-bold text-neutral-900 border-b border-neutral-900 pb-0.5 hover:opacity-70 transition"
                      >
                        Create your first product
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                products.map((p: Product) => (
                  <tr key={p.id || p._id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="h-12 w-12 rounded-xl bg-neutral-100 border border-neutral-100 overflow-hidden flex-shrink-0 focus:ring-2 focus:ring-neutral-200 transition">
                        {p.images && (p.images[0] as any) ? (
                          <img
                            src={typeof p.images[0] === 'string' ? p.images[0] : (p.images[0] as any).url}
                            className="w-full h-full object-cover grayscale-[0.3] group-hover:grayscale-0 transition-all duration-500"
                            alt={p.name}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[10px] font-bold text-neutral-300">MISSING</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="max-w-[240px]">
                        <div className="text-sm font-bold text-neutral-900 truncate">{p.name}</div>
                        <div className="text-[10px] font-bold text-neutral-400 uppercase tracking-tight mt-0.5">
                          {typeof p.category === "object" ? p.category?.name : (p.category === "6998b744c465cfbcbf767e4f" ? "Cosmetics" : (p.category === "6998b729c465cfbcbf767e4d" ? "Garments" : p.category || "General"))}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-neutral-900 whitespace-nowrap">
                        PKR {p.price.toLocaleString()}
                        {p.discountPrice && <div className="text-[10px] text-red-500 line-through font-medium opacity-60">PKR {p.discountPrice.toLocaleString()}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${p.stock > 10 ? 'bg-green-50 text-green-700' : p.stock > 0 ? 'bg-orange-50 text-orange-700' : 'bg-red-50 text-red-700'}`}>
                          {p.stock} Units
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${p.isActive ? 'bg-blue-50 text-blue-600' : 'bg-neutral-100 text-neutral-400'}`}>
                        <div className={`w-1 h-1 rounded-full ${p.isActive ? 'bg-blue-600 animate-pulse' : 'bg-neutral-400'}`}></div>
                        {p.isActive ? "Live" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => router.push(`/dashboard/products/${p._id || p.id}`)}
                          className="p-2 text-neutral-400 hover:text-neutral-900 hover:bg-white rounded-lg border border-transparent hover:border-neutral-100 transition shadow-none hover:shadow-sm"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p._id || p.id!)}
                          className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg border border-transparent hover:border-red-100 transition shadow-none hover:shadow-sm"
                          title="Delete Product"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
