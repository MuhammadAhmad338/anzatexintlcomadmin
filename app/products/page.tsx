"use client";

import { useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

export default function Products() {
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    if (type === "checkbox") {
      setForm((prev) => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const fileArray = Array.from(files);
    setImages(fileArray);

    // Create preview URLs
    const previews = fileArray.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    
    // Revoke the URL to free memory
    URL.revokeObjectURL(imagePreviews[index]);
    
    setImages(newImages);
    setImagePreviews(newPreviews);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const token = typeof window !== "undefined" ? localStorage.getItem("authToken") : null;

      // Create FormData for file upload
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("price", form.price);
      if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
      if (form.category) formData.append("category", form.category);
      formData.append("stock", form.stock || "0");
      formData.append("brand", form.brand);
      formData.append("isActive", String(form.isActive));

      // Append images
      images.forEach((image) => {
        formData.append("images", image);
      });

      const res = await fetch(`${API_URL}/api/products`, {
        method: "POST",
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          // Don't set Content-Type - browser will set it with boundary for FormData
        },
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.message || "Failed to create product");
      } else {
        setSuccess("Product created successfully");
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
      }
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-2xl font-semibold">Add Product</h1>
      <p className="mt-2 text-sm text-neutral-600">
        Create a new garment or cosmetic product.
      </p>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>}

      <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
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
            <label className="text-sm font-medium">Price</label>
            <input
              name="price"
              type="number"
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
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              value={form.discountPrice}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="text-sm font-medium">Category ID</label>
            <input
              name="category"
              className="mt-1 w-full rounded-md border border-neutral-300 px-3 py-2 text-sm"
              value={form.category}
              onChange={handleChange}
              placeholder="Mongo ObjectId"
            />
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

          {/* Image Previews */}
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
    </main>
  );
}