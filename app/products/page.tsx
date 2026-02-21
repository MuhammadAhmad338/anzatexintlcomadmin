"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../hooks/redux";
import { createProduct, getProducts, clearError, clearSuccess } from "../store/slices/productsSlice";

interface Product {
  _id?: string;
  id?: string;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  category?: string;
  images: string[];
  stock: number;
  brand: string;
  isActive: boolean;
  createdAt?: string;
}

export default function Products() {
  const dispatch = useAppDispatch();
  const { loading, error, success, products } = useAppSelector((state) => state.products as {
    loading: boolean;
    error: string | null;
    success: string | null;
    products: Product[];
  });

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    discountPrice: "",
    category: "",
    stock: "",
    brand: "",
    isActive: true,
  });

  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  useEffect(() => {
    console.log("Fetching products...");
    dispatch(getProducts());
  }, [dispatch]);

  // Debug: Log products state
  useEffect(() => {
    console.log("Products state updated:", products);
    console.log("Loading:", loading);
    console.log("Error:", error);
  }, [products, loading, error]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm((prev) => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImages(fileArray);

    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    URL.revokeObjectURL(imagePreviews[index]);
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Debug: Log form data
    console.log("Form data:", form);
    console.log("Images:", images);

    const formData = new FormData();

    // Add all form fields
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
    if (form.category) formData.append("category", form.category);
    formData.append("stock", form.stock || "0");
    formData.append("brand", form.brand);
    formData.append("isActive", String(form.isActive));

    // Add images
    images.forEach((image, index) => {
      console.log(`Adding image ${index}:`, image.name, image.size);
      formData.append("images", image);
    });

    // Debug: Log FormData contents
    console.log("FormData entries:");
    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (success) {
      setForm({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        stock: "",
        brand: "",
        isActive: true,
      });
      setImages([]);
      setImagePreviews([]);
      setShowForm(false);

      const t = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);

      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  useEffect(() => {
    if (error) {
      const t = setTimeout(() => {
        dispatch(clearError());
      }, 5000);

      return () => clearTimeout(t);
    }
  }, [error, dispatch]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Manage your garment and cosmetic products.
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-black text-white px-4 py-2 rounded-lg hover:bg-neutral-800 transition-colors"
        >
          {showForm ? "Cancel" : "Add Product"}
        </button>
      </div>

      {error && <p className="mb-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mb-4 text-sm text-green-600">{success}</p>}

      {/* Debug Section */}
      {process.env.NODE_ENV === 'development' && (
        <div className="mb-4 p-4 bg-gray-100 rounded-lg text-xs">
          <h3 className="font-semibold mb-2">Debug Info:</h3>
          <p>Products count: {products.length}</p>
          <p>Loading: {loading ? 'Yes' : 'No'}</p>
          <p>Error: {error || 'None'}</p>
          <p>First product: {products[0] ? JSON.stringify(products[0].name) : 'None'}</p>
          <details className="mt-2">
            <summary className="cursor-pointer">Products data (first 3):</summary>
            <pre className="mt-2 whitespace-pre-wrap">
              {JSON.stringify(products.slice(0, 3), null, 2)}
            </pre>
          </details>
        </div>
      )}

      {showForm && (
        <div className="bg-white rounded-lg border border-neutral-200 p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Create New Product</h2>
          <form onSubmit={handleSubmit} className="grid gap-4">
            <div>
              <label className="text-sm font-medium">Name *</label>
              <input
                name="name"
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium">Description</label>
              <textarea
                name="description"
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                rows={4}
                value={form.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Price *</label>
                <input
                  name="price"
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  value={form.price}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium">Discount Price</label>
                <input
                  name="discountPrice"
                  type="number"
                  step="0.01"
                  min="0"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  value={form.discountPrice}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Category</label>
                <select
                  name="category"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm bg-white"
                  value={form.category}
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled>Select Category</option>
                  <option value="Garments">Garments</option>
                  <option value="Cosmetics">Cosmetics</option>
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Brand</label>
                <input
                  name="brand"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  value={form.brand}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Product Images</label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              />
              <p className="mt-1 text-xs text-neutral-500">
                Select one or more images from your computer.
              </p>

              {imagePreviews.length > 0 && (
                <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="h-24 w-full rounded-md object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="text-sm font-medium">Stock</label>
                <input
                  name="stock"
                  type="number"
                  min="0"
                  className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
                  value={form.stock}
                  onChange={handleChange}
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <label className="text-sm font-medium">Active</label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Create Product"}
            </button>
          </form>
        </div>
      )}

      {/* Products List */}
      <div className="bg-white rounded-lg border border-neutral-200">
        <div className="p-6 border-b border-neutral-200">
          <h2 className="text-lg font-semibold">Product List ({products.length})</h2>
        </div>

        {products.length === 0 ? (
          <div className="p-8 text-center text-neutral-500">
            <p>No products found. Add your first product above.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Stock</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Brand</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {products.map((product) => (
                  <tr key={product.id || product._id} className="hover:bg-neutral-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {product.images && product.images.length > 0 && (
                          <img
                            src={product.images[0]}
                            alt={product.name}
                            className="h-10 w-10 rounded-md object-cover mr-3"
                          />
                        )}
                        <div>
                          <div className="text-sm font-medium text-neutral-900">{product.name}</div>
                          <div className="text-sm text-neutral-500 capitalize">
                            {typeof product.category === "object"
                              ? (product.category as any).name
                              : product.category === "6998b729c465cfbcbf767e4d"
                                ? "Garments"
                                : product.category || "No category"}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-neutral-900">
                        ${product.price}
                        {product.discountPrice && (
                          <span className="ml-2 text-sm text-red-600 line-through">
                            ${product.discountPrice}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`text-sm ${product.stock > 10 ? 'text-green-600' : product.stock > 0 ? 'text-yellow-600' : 'text-red-600'}`}>
                        {product.stock} units
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-900">
                      {product.brand || 'No brand'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${product.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                        }`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-blue-600 hover:text-blue-900 mr-3">Edit</button>
                      <button className="text-red-600 hover:text-red-900">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
