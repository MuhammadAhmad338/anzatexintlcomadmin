
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

type User = {
    id?: string;
    name?: string;
    email?: string;
    role?: string;
    address?: {
        street?: string;
        city?: string;
        country?: string;
        phone?: string;
    };
};

type AuthState = {
    user: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
};

const initialState: AuthState = {
    user: null,
    token: null,
    loading: false,
    error: null,
};

type RegisterPayload = {
    name: string;
    email: string;
    password: string;
    street?: string;
    city?: string;
    country?: string;
    phone?: string;
};

type LoginPayload = {
    email: string;
    password: string;
};

export const registerUser = createAsyncThunk(
    "auth/register",
    async (payload: RegisterPayload, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/api/users/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: payload.name,
                    email: payload.email,
                    password: payload.password,
                    address: {
                        street: payload.street,
                        city: payload.city,
                        country: payload.country,
                        phone: payload.phone
                    },
                }),
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data?.message || "Signup failed");
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Signup failed");
        }
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (payload: LoginPayload, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/api/users/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data?.message || "Login failed");
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Login failed");
        }
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await fetch(`${API_URL}/api/users/logout`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });

            const data = await res.json();
            if (!res.ok) return rejectWithValue(data?.message || "Logout failed");
            return data;
        } catch (err: any) {
            return rejectWithValue(err.message || "Logout failed");
        }
    }
);


const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        logout(state) {
            state.user = null;
            state.token = null;
            state.error = null;
            if (typeof window !== "undefined") {
                localStorage.removeItem("authToken");
                localStorage.removeItem("authUser");
            }
        },
        hydrateFromStorage(state) {
            if (typeof window !== "undefined") {
                const token = localStorage.getItem("authToken");
                const user = localStorage.getItem("authUser");
                state.token = token ? token : null;
                state.user = user ? JSON.parse(user) : null;
            }
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.token = null; // register does not return token
                if (typeof window !== "undefined") {
                    if (state.user) localStorage.setItem("authUser", JSON.stringify(state.user));
                }
            })
            .addCase(registerUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload || "Signup failed";
            })
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.user = action.payload.user || null;
                state.token = action.payload.token || null;
                if (typeof window !== "undefined") {
                    if (state.token) localStorage.setItem("authToken", state.token);
                    if (state.user) localStorage.setItem("authUser", JSON.stringify(state.user));
                }
            })
            .addCase(loginUser.rejected, (state, action: any) => {
                state.loading = false;
                state.error = action.payload || "Login failed";
            });
    },
});

export const { logout, hydrateFromStorage } = authSlice.actions;
export default authSlice.reducer;
