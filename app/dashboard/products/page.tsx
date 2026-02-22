"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createProduct, getProducts, clearSuccess } from "../../store/slices/productsSlice";

type ProductImage = string | { url?: string };
type Product = {
  _id: string;
  name: string;
  brand?: string;
  price: number;
  discountPrice?: number;
  stock?: number;
  images?: ProductImage[];
};

type ProductsState = {
  loading: boolean;
  listLoading?: boolean;
  error: string | null;
  success: string | null;
  products?: Product[];
};

export default function Products() {
  const dispatch = useAppDispatch();

  // Get products from Redux state
  const { loading, error, success, products } = useAppSelector((state) => state.products as {
    loading: boolean;
    error: string | null;
    success: string | null;
    products: Product[];
  });

  const [open, setOpen] = useState(false);

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

  const resetForm = () => {
    imagePreviews.forEach((url) => URL.revokeObjectURL(url));
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
  };

  const closeDialog = () => {
    setOpen(false);
  };

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
    const newFiles = fileArray.filter(
      (newFile) =>
        !images.some(
          (existing) =>
            existing.name === newFile.name && existing.size === newFile.size
        )
    );

    setImages((prev) => [...prev, ...newFiles]);

    const newPreviews = newFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prev) => [...prev, ...newPreviews]);

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    URL.revokeObjectURL(imagePreviews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
    if (form.category) formData.append("category", form.category);
    formData.append("stock", form.stock || "0");
    formData.append("brand", form.brand);
    formData.append("isActive", String(form.isActive));

    images.forEach((image) => formData.append("images", image));

    dispatch(createProduct(formData));
  };

  useEffect(() => {
    if (!products || products.length === 0) {
      dispatch(getProducts());
    }
  }, [dispatch, products?.length]);

  useEffect(() => {
    if (success) {
      setOpen(false);
      resetForm();
      const t = setTimeout(() => {
        dispatch(clearSuccess());
      }, 3000);
      return () => clearTimeout(t);
    }
  }, [success, dispatch]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [imagePreviews]);

  return (
    <main className="mx-auto max-w-6xl px-4 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Products</h1>
          <p className="mt-2 text-sm text-neutral-600">
            Add and manage garment or cosmetic products.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen(true)}
          className="rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800"
        >
          Add Product
        </button>
      </div>
      {/* 
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
      {success && <p className="mt-4 text-sm text-green-600">{success}</p>} */}

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/55 p-4 backdrop-blur-sm"
          onClick={closeDialog}
        >
          <div
            className="w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white px-6 py-5">
              <div>
                <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                  Add Product
                </h2>
                <p className="mt-1 text-sm text-neutral-500">
                  Fill product details and upload images.
                </p>
              </div>
              <button
                type="button"
                onClick={closeDialog}
                className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
              <form onSubmit={handleSubmit} className="grid gap-5">
                <div>
                  <label className="text-sm font-medium text-neutral-800">Name</label>
                  <input
                    name="name"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    Description
                  </label>
                  <textarea
                    name="description"
                    className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-neutral-800">
                      Price
                    </label>
                    <input
                      name="price"
                      type="number"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                      value={form.price}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-800">
                      Discount Price
                    </label>
                    <input
                      name="discountPrice"
                      type="number"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                      value={form.discountPrice}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-neutral-800">
                      Category
                    </label>
                    <select
                      name="category"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200 bg-white"
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
                    <label className="text-sm font-medium text-neutral-800">
                      Brand
                    </label>
                    <input
                      name="brand"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                      value={form.brand}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-neutral-800">
                    Product Images
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="mt-1.5 w-full rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-3 py-2.5 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-neutral-900 file:px-3 file:py-1.5 file:text-xs file:font-medium file:text-white hover:bg-neutral-100"
                  />

                  {imagePreviews.length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-3 md:grid-cols-4">
                      {imagePreviews.map((preview, index) => (
                        <div key={index} className="relative">
                          <img
                            src={preview}
                            alt={`Preview ${index + 1}`}
                            className="h-24 w-full rounded-xl border border-neutral-200 object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -right-2 -top-2 rounded-full bg-red-500 px-2 py-1 text-xs text-white shadow hover:bg-red-600"
                          >
                            x
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <label className="text-sm font-medium text-neutral-800">
                      Stock
                    </label>
                    <input
                      name="stock"
                      type="number"
                      className="mt-1.5 w-full rounded-xl border border-neutral-300 px-3 py-2.5 text-sm outline-none transition focus:border-neutral-500 focus:ring-2 focus:ring-neutral-200"
                      value={form.stock}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="flex items-center gap-2 pt-8">
                    <input
                      type="checkbox"
                      name="isActive"
                      checked={form.isActive}
                      onChange={handleChange}
                      className="h-4 w-4 rounded border-neutral-300"
                    />
                    <label className="text-sm font-medium text-neutral-800">
                      Active
                    </label>
                  </div>
                </div>

                <div className="flex gap-3 pt-1">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {loading ? (
                      <>
                        <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      "Create Product"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-lg font-semibold text-neutral-900">All Products</h2>

        {loading ? (
          <p className="mt-3 text-sm text-neutral-600">Loading products...</p>
        ) : products.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">No products found.</p>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const firstImage = product.images?.[0];
              const imageUrl =
                typeof firstImage === "string" ? firstImage : firstImage?.url;

              return (
                <Link key={product._id} href={`/dashboard/products/${product._id}`}>
                  <article
                    className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm transition hover:shadow-md"
                  >
                    <div className="h-44 w-full bg-neutral-100">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-neutral-500">
                          No image
                        </div>
                      )}
                    </div>

                    <div className="p-4">
                      <h3 className="line-clamp-1 text-base font-semibold text-neutral-900">
                        {product.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500">
                        {product.brand || "No brand"}
                      </p>

                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-base font-bold text-neutral-900">
                          ${Number(product.price).toFixed(2)}
                        </span>
                        {product.discountPrice ? (
                          <span className="text-sm font-medium text-green-600">
                            ${Number(product.discountPrice).toFixed(2)}
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-xs text-neutral-500">
                        Stock: {product.stock ?? 0}
                      </p>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </main>
  );
}
