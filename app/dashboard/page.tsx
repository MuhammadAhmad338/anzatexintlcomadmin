"use client";
import Link from "next/link";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { getProducts } from "../store/slices/productsSlice";
import { getOrders } from "../store/slices/ordersSlice";

export default function DashboardHome() {
  const dispatch = useAppDispatch();
  const { products } = useAppSelector((state) => state.products as any);
  const { orders } = useAppSelector((state) => state.orders as any);

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products?.length]);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(getOrders());
    }
  }, [dispatch, orders?.length]);

  // Derived state from db
  const totalRevenue = orders
    ?.filter((order: any) => order.orderStatus === "Delivered")
    .reduce((acc: number, order: any) => acc + (order.totalPrice || 0), 0) || 0;
  const uniqueCustomers = new Set(orders?.map((o: any) => o.shippingAddress?.fullName || 'Guest')).size;

  const stats = [
    { label: "Total Revenue", value: `$${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, trend: "Lifetime", positive: true },
    { label: "Total Orders", value: orders?.length?.toString() || "0", trend: "Lifetime", positive: true },
    { label: "Total Products listed", value: products?.length?.toString() || "0", trend: "Real-time", positive: true },
    { label: "Active Customers", value: uniqueCustomers.toString(), trend: "Lifetime", positive: true },
  ];

  const lowStock = products?.filter((p: any) => (p.stock || 0) <= 5).slice(0, 5) || [];
  const recentOrdersList = [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 10);

  return (
    <main className="mx-auto max-w-7xl p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Dashboard Overview</h1>
          <p className="mt-1 text-sm text-neutral-500">Welcome back. Here's what's happening with your store today.</p>
        </div>
        {/* <Link
          href="/dashboard/products"
          className="inline-flex items-center justify-center rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white shadow transition hover:bg-neutral-800"
        >
          <svg className="mr-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
          Add New Product
        </Link> */}
      </div>

      {/* KPI Stats Grid */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <div key={i} className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-medium text-neutral-500">{stat.label}</h3>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-bold text-neutral-900">{stat.value}</span>
              <span className={`text-sm font-medium ${stat.positive ? "text-green-600" : "text-red-500"}`}>
                {stat.trend}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Recent Orders (Takes up 2 columns on large screens) */}
        <div className="lg:col-span-2 rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
          <div className="border-b border-neutral-100 p-6 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-neutral-900">Recent Orders</h2>
            <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-neutral-600">
              <thead className="bg-neutral-50 text-xs uppercase text-neutral-400">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Date</th>
                  <th className="px-6 py-4 font-medium">Total</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {recentOrdersList.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">No recent orders found.</td>
                  </tr>
                )}
                {recentOrdersList.map((order, i) => (
                  <tr key={i} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">#{order._id?.slice(-6).toUpperCase()}</td>
                    <td className="px-6 py-4">{order.shippingAddress?.fullName || 'Guest'}</td>
                    <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium text-neutral-900">${order.totalPrice?.toFixed(2)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${(order.orderStatus || 'Pending') === "Delivered" ? "bg-green-100 text-green-700" :
                        (order.orderStatus || 'Pending') === "Processing" ? "bg-blue-100 text-blue-700" :
                          "bg-yellow-100 text-yellow-800"
                        }`}>
                        {order.orderStatus || 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm flex flex-col">
          <div className="border-b border-neutral-100 p-6 flex items-center gap-2">
            <svg className="h-5 w-5 text-orange-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
            <h2 className="text-lg font-semibold text-neutral-900">Low Stock Alerts</h2>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-6">
              {lowStock.length === 0 && <p className="text-sm text-neutral-500">Inventory looks good.</p>}
              {lowStock.map((item: any) => (
                <div key={item._id || item.id} className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-neutral-900 line-clamp-1">{item.name}</h4>
                    <p className="text-xs text-neutral-500 mt-1 capitalize">
                      {typeof item.category === "object" ? item.category?.name : item.category === "6998b729c465cfbcbf767e4d" ? "Garments" : item.category || "Uncategorized"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`font-bold ${(item.stock || 0) === 0 ? "text-red-600" : "text-orange-500"}`}>
                      {item.stock || 0} left
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-neutral-100 bg-neutral-50 rounded-b-2xl">
            <Link href="/dashboard/products" className="text-sm font-medium text-neutral-700 hover:text-neutral-900 flex justify-center w-full">
              Manage Inventory →
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
