"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown, ChevronRight, Package, LayoutDashboard, ShoppingCart, Settings, Box, PlusCircle, List } from "lucide-react";

export default function Sidebar() {
  const [isProductsOpen, setIsProductsOpen] = useState(false);

  return (
    <aside className="w-64 border-r border-neutral-200 bg-white p-4 h-full overflow-y-auto">
      <nav className="space-y-1.5 text-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all font-medium"
        >
          <LayoutDashboard size={18} />
          Dashboard
        </Link>

        {/* Collapsible Products Section */}
        <div className="space-y-1">
          <button
            onClick={() => setIsProductsOpen(!isProductsOpen)}
            className={`w-full flex items-center justify-between rounded-xl px-3 py-2.5 transition-all font-medium ${isProductsOpen ? "bg-neutral-50 text-neutral-900" : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
              }`}
          >
            <div className="flex items-center gap-3">
              <Package size={18} />
              Products
            </div>
            {isProductsOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </button>

          {isProductsOpen && (
            <div className="ml-9 space-y-1 animate-in slide-in-from-top-1 duration-200">
              <Link
                href="/dashboard/products"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <List size={12} />
                All Products
              </Link>
              <Link
                href="/dashboard/products/add"
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900 transition-colors"
              >
                <PlusCircle size={12} />
                Add Product
              </Link>
            </div>
          )}
        </div>

        <Link
          href="/dashboard/orders"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all font-medium"
        >
          <ShoppingCart size={18} />
          Orders
        </Link>

        <Link
          href="/dashboard/inventory"
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all font-medium"
        >
          <Box size={18} />
          Inventory
        </Link>

        <div className="pt-4 mt-4 border-t border-neutral-100">
          <Link
            href="/dashboard/settings"
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900 transition-all font-medium"
          >
            <Settings size={18} />
            Settings
          </Link>
        </div>
      </nav>
    </aside>
  );
}
