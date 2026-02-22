import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { log } from 'console';

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category?: string;
  images: string[] | File[];
  stock: number;
  brand: string;
  isActive: boolean;
}

interface ProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  success: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
  success: null
};

// Async thunk for creating a product with images
export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData: FormData, { rejectWithValue }) => {
    try {
      const API_URL = "http://localhost:3001";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      console.log("Sending FormData with images");
      console.log("Token:", token);

      // Send FormData as-is (includes both text fields and images)
      const response = await fetch(`${API_URL}/api/products`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: productData,
      });

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        return rejectWithValue(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const editProduct = createAsyncThunk(
  'products/editProduct',
  async ({ productId, productData }: { productId: string, productData: FormData }, { rejectWithValue }) => {
    try {
      const API_URL = "http://localhost:3001";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      // Send FormData as-is (includes both text fields and images)
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: productData,
      });

      const data = await response.json();
      console.log("API Response:", data);
      console.log("Response status:", response.status);

      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        return rejectWithValue(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (productId: string, { rejectWithValue }) => {
    try {
      const API_URL = "http://localhost:3001";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      // Send FormData as-is (includes both text fields and images)
      const response = await fetch(`${API_URL}/api/products/${productId}`, {
        method: 'DELETE',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("API Error Details:", {
          status: response.status,
          statusText: response.statusText,
          data: data
        });
        return rejectWithValue(data?.message || `HTTP ${response.status}: ${response.statusText}`);
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

// Async thunk for fetching products
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      const response = await fetch(`${API_URL}/api/products`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      const data = await response.json();
      console.log('Fetched products:', data);

      if (!response.ok) {
        return rejectWithValue(data?.message || 'Failed to fetch products');
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message || 'Network error');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccess: (state) => {
      state.success = null;
    },
    resetForm: (state) => {
      state.error = null;
      state.success = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.success = 'Product created successfully';
        // Handle different response structures
        const product = action.payload.data?.product || action.payload.product || action.payload.data;
        if (product && Array.isArray(state.products)) {
          state.products.push(product);
        }
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch products
      .addCase(getProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getProducts.fulfilled, (state, action) => {
        state.loading = false;
        // API returns { success: true, data: [products] }
        state.products = Array.isArray(action.payload.data) ? action.payload.data : Array.isArray(action.payload.products) ? action.payload.products : Array.isArray(action.payload) ? action.payload : [];
      })
      .addCase(getProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, clearSuccess, resetForm } = productsSlice.actions;
export default productsSlice.reducer;
