"use client";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { getOrders, updateOrderStatusThunk } from "../../store/slices/ordersSlice";

export default function Orders() {
  const dispatch = useAppDispatch();
  const { orders, loading, updatingId } = useAppSelector((state) => state.orders as any);

  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(getOrders());
    }
  }, [dispatch, orders?.length]);

  const updateOrderStatus = async (orderId: string, currentStatus: string) => {
    // Determine next status logically
    let nextStatus = "Processing";
    if (currentStatus === "Pending") nextStatus = "Processing";
    else if (currentStatus === "Processing") nextStatus = "Shipped";
    else if (currentStatus === "Shipped") nextStatus = "Delivered";

    dispatch(updateOrderStatusThunk({ orderId, status: nextStatus }));
  };

  return (
    <main className="mx-auto max-w-7xl p-6 lg:p-10">
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Manage Orders</h1>
          <p className="mt-1 text-sm text-neutral-500">Track and update customer order fulfillment statuses.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-neutral-600">
            <thead className="bg-neutral-50 text-xs uppercase text-neutral-400">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">Loading orders...</td>
                </tr>
              ) : !orders || orders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-sm text-neutral-500">No orders found.</td>
                </tr>
              ) : (
                orders.map((order: any) => {
                  const status = order.orderStatus || 'Pending';

                  return (
                    <tr key={order._id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900 whitespace-nowrap">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-neutral-900">{order.shippingAddress?.fullName || 'Guest'}</div>
                        <div className="text-xs text-neutral-500 mt-0.5">{order.shippingAddress?.city}, {order.shippingAddress?.country}</div>
                      </td>
                      <td className="px-6 py-4">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 font-medium text-neutral-900">${order.totalPrice?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                          <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold w-24 justify-center ${status === "Delivered" ? "bg-green-100 text-green-700" :
                            status === "Shipped" ? "bg-purple-100 text-purple-700" :
                              status === "Processing" ? "bg-blue-100 text-blue-700" :
                                "bg-yellow-100 text-yellow-800"
                            }`}>
                            {status}
                          </span>

                          {/* Only show update button if not completely delivered */}
                          {status !== "Delivered" && (
                            <button
                              disabled={updatingId === order._id}
                              onClick={() => updateOrderStatus(order._id, status)}
                              className="text-xs font-medium text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {updatingId === order._id ? "Updating..." : `Mark as ${status === "Pending" ? "Processing" :
                                status === "Processing" ? "Shipped" : "Delivered"
                                }`}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
}