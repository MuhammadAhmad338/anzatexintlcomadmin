import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const getOrders = createAsyncThunk(
    'orders/getOrders',
    async (_, { rejectWithValue }) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(`${API_URL}/api/orders`, {
                headers: {
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                }
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data?.message || 'Failed to fetch orders');
            }
            return Array.isArray(data) ? data : data.data || [];
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

export const updateOrderStatusThunk = createAsyncThunk(
    'orders/updateStatus',
    async ({ orderId, status }: { orderId: string, status: string }, { rejectWithValue }) => {
        try {
            const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;
            const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
            const res = await fetch(`${API_URL}/api/orders/${orderId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { Authorization: `Bearer ${token}` } : {})
                },
                body: JSON.stringify({
                    status,
                    isPaid: true
                })
            });
            const data = await res.json();
            if (!res.ok) {
                return rejectWithValue(data?.message || 'Failed to update order');
            }
            return { orderId, status };
        } catch (error: any) {
            return rejectWithValue(error.message || 'Network error');
        }
    }
);

interface OrdersState {
    orders: any[];
    loading: boolean;
    error: string | null;
    updatingId: string | null;
}

const initialState: OrdersState = {
    orders: [],
    loading: false,
    error: null,
    updatingId: null,
};

const ordersSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.pending, (state) => {
                state.loading = true;
            })
            .addCase(getOrders.fulfilled, (state, action) => {
                state.loading = false;
                state.orders = action.payload;
            })
            .addCase(getOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateOrderStatusThunk.pending, (state, action) => {
                state.updatingId = action.meta.arg.orderId;
            })
            .addCase(updateOrderStatusThunk.fulfilled, (state, action) => {
                state.updatingId = null;
                const index = state.orders.findIndex(o => o._id === action.payload.orderId);
                if (index !== -1) {
                    state.orders[index] = {
                        ...state.orders[index],
                        orderStatus: action.payload.status,
                        isDelivered: action.payload.status === "Delivered"
                    };
                }
            })
            .addCase(updateOrderStatusThunk.rejected, (state, action) => {
                state.updatingId = null;
                state.error = action.payload as string;
            });
    }
});

export default ordersSlice.reducer;
