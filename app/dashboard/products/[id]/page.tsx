"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { deleteProduct, editProduct, getProducts } from "../../../store/slices/productsSlice";

type ProductImage = string | { url?: string };
type Product = {
    _id: string;
    name: string;
    brand?: string;
    price: number;
    discountPrice?: number;
    description?: string;
    category?: string;
    stock?: number;
    isActive?: boolean;
    images?: ProductImage[];
};

export default function ProductDetails() {
    const params = useParams();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { id } = params as { id: string };

    const { products, loading } = useAppSelector((state) => state.products as {
        loading: boolean;
        products: Product[];
    });

    const [product, setProduct] = useState<Product | null>(null);
    const [selectedImage, setSelectedImage] = useState<number>(0);

    const [isEditOpen, setIsEditOpen] = useState(false);
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
    const [isSaving, setIsSaving] = useState(false);

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

    const handleOpenEdit = () => {
        if (product) {
            let catValue = "";
            if (typeof product.category === "object") {
                catValue = (product.category as any).name;
            } else if (product.category === "6998b729c465cfbcbf767e4d") {
                catValue = "Garments";
            } else {
                catValue = product.category || "";
            }

            if (!["Garments", "Cosmetics"].includes(catValue)) {
                if (catValue.toLowerCase() === "garments") catValue = "Garments";
                else if (catValue.toLowerCase() === "cosmetics") catValue = "Cosmetics";
            }

            setForm({
                name: product.name || "",
                description: product.description || "",
                price: String(product.price || ""),
                discountPrice: String(product.discountPrice || ""),
                category: catValue,
                stock: String(product.stock || 0),
                brand: product.brand || "",
                isActive: product.isActive !== false,
            });
            setImages([]);
            setImagePreviews([]);
            setIsEditOpen(true);
        }
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
        setImages((prev) => [...prev, ...fileArray]);

        const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
        setImagePreviews((prev) => [...prev, ...newPreviews]);

        e.target.value = "";
    };

    const removeImage = (index: number) => {
        URL.revokeObjectURL(imagePreviews[index]);
        setImages((prev) => prev.filter((_, i) => i !== index));
        setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    };

    useEffect(() => {
        if (products.length === 0) {
            dispatch(getProducts());
        }
    }, [dispatch, products.length]);

    useEffect(() => {
        if (products.length > 0) {
            const foundProduct = products.find((p) => p._id === id);
            setProduct(foundProduct || null);
        }
    }, [id, products]);

    const handleDelete = async (id: string) => {
        try {
            await dispatch(deleteProduct(id)).unwrap();
            await dispatch(getProducts());

            router.push("/dashboard/products"); // go back to list page
        } catch (err) {
            console.error(err);
        }
    };

    const handleEditSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        try {
            const formData = new FormData();
            formData.append("name", form.name);
            formData.append("description", form.description);
            formData.append("price", form.price);
            if (form.discountPrice) formData.append("discountPrice", form.discountPrice);
            if (form.category) formData.append("category", form.category);
            formData.append("stock", form.stock || "0");
            formData.append("brand", form.brand);
            formData.append("isActive", String(form.isActive));
            images.forEach((image) => {
                formData.append("images", image);
            });
            await dispatch(editProduct({ productId: id.toString(), productData: formData })).unwrap();
            await dispatch(getProducts());
            setIsEditOpen(false);
            // Optional: If you want to automatically go back after saving:
            // router.push("/dashboard/products");
        } catch (err) {
            console.error(err);
        } finally {
            setIsSaving(false);
        }
    };


    if (loading && !product) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <p className="text-neutral-500">Loading product details...</p>
            </div>
        );
    }

    if (!loading && !product) {
        return (
            <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
                <p className="text-neutral-500">Product not found.</p>
                <button
                    onClick={() => router.push("/dashboard/products")}
                    className="rounded-xl bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800"
                >
                    Back to Products
                </button>
            </div>
        );
    }

    if (!product) return null;

    return (
        <main className="mx-auto max-w-7xl px-4 py-10">
            <div className="mb-6 flex items-center gap-4">
                <Link
                    href="/dashboard/products"
                    className="rounded-full p-2 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M19 12H5"></path>
                        <path d="m12 19-7-7 7-7"></path>
                    </svg>
                </Link>
                <h1 className="text-2xl font-semibold text-neutral-900">Product Details</h1>
            </div>

            <div>
                <div className="grid md:grid-cols-2">
                    {/* Images Section */}
                    <div className="border-r border-neutral-100 bg-white p-6 lg:p-10 flex flex-col lg:flex-row gap-6 lg:gap-8">
                        {product.images && product.images.length > 0 ? (
                            <>
                                {/* Thumbnails */}
                                <div className="flex lg:flex-col gap-3 overflow-x-auto lg:overflow-y-auto order-2 lg:order-1 scrollbar-hide py-1">
                                    {product.images.map((image, idx) => {
                                        const imgUrl = typeof image === "string" ? image : image?.url;
                                        return (
                                            <button
                                                key={idx}
                                                onClick={() => setSelectedImage(idx)}
                                                onMouseEnter={() => setSelectedImage(idx)}
                                                className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white transition-all ${selectedImage === idx
                                                    ? "ring-2 ring-black border-transparent shadow-sm"
                                                    : "border border-neutral-200 hover:border-neutral-400 hover:shadow-sm"
                                                    }`}
                                            >
                                                <img
                                                    src={imgUrl}
                                                    alt={`${product.name} thumbnail ${idx + 1}`}
                                                    className="h-full w-full object-contain p-1"
                                                />
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Main Large Image */}
                                <div className="relative flex-1 order-1 lg:order-2 bg-white rounded-lg flex items-center justify-center p-4 min-h-[400px]">
                                    <img
                                        src={
                                            typeof product.images[selectedImage] === "string"
                                                ? product.images[selectedImage]
                                                : (product.images[selectedImage] as { url?: string })?.url
                                        }
                                        alt={product.name}
                                        className="max-h-[500px] w-full object-contain transition-transform duration-300 pointer-events-none"
                                    />
                                </div>
                            </>
                        ) : (
                            <div className="flex w-full h-80 flex-col items-center justify-center rounded-lg bg-neutral-50 border border-dashed border-neutral-200 text-neutral-400">
                                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-2 opacity-50"><rect width="18" height="18" x="3" y="3" rx="2" ry="2" /><circle cx="9" cy="9" r="2" /><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" /></svg>
                                <span>No images available</span>
                            </div>
                        )}
                    </div>

                    {/* Details Section */}
                    <div className="bg-white p-6 lg:p-10">
                        <div className="mb-4">
                            <h2 className="text-3xl font-bold tracking-tight text-neutral-900">{product.name}</h2>
                            <p className="mt-2 text-sm font-medium text-blue-600 hover:underline cursor-pointer inline-block">
                                Visit the {product.brand || "Generic"} Store
                            </p>
                        </div>

                        <div className="flex items-center gap-3 mb-6">
                            <span
                                className={`rounded-sm px-2 py-0.5 text-xs font-bold uppercase tracking-wide ${product.isActive !== false
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                                    }`}
                            >
                                {product.isActive !== false ? "In Stock" : "Out of Stock"}
                            </span>
                        </div>

                        <div className="mb-6 pb-6 border-b border-neutral-100">
                            <div className="flex items-baseline gap-2">
                                <span className="text-sm font-medium text-neutral-500">Price:</span>
                                <span className="text-3xl font-semibold text-neutral-900">
                                    <span className="text-lg align-top mr-1">$</span>
                                    {Number(product.price).toFixed(2)}
                                </span>
                            </div>
                            {product.discountPrice ? (
                                <div className="mt-1 flex items-center gap-2 text-sm">
                                    <span className="text-neutral-500">Discounted Price:</span>
                                    <span className="font-medium text-red-600">
                                        ${Number(product.discountPrice).toFixed(2)}
                                    </span>
                                </div>
                            ) : null}
                        </div>

                        <div className="space-y-6 text-sm text-neutral-900">
                            <div className="grid grid-cols-[100px_1fr] gap-4">
                                <div className="font-medium text-neutral-500">Category</div>
                                <div className="capitalize capitalize">
                                    {typeof product.category === "object"
                                        ? (product.category as any).name
                                        : product.category === "6998b729c465cfbcbf767e4d"
                                            ? "Garments"
                                            : product.category || "Uncategorized"}
                                </div>

                                <div className="font-medium text-neutral-500">Brand</div>
                                <div>{product.brand || "None"}</div>

                                <div className="font-medium text-neutral-500">Quantity</div>
                                <div>{product.stock ?? 0} units available</div>
                            </div>

                            <hr className="border-neutral-100" />

                            <div>
                                <h3 className="font-bold text-base mb-2">About this item</h3>
                                <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap">
                                    {product.description ? (
                                        <ul className="list-disc pl-5 space-y-1">
                                            {product.description.split('\n').map((line, i) => (
                                                <li key={i}>{line}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        "No description provided."
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-10 pt-6 border-t border-neutral-100 flex gap-3">
                            <button onClick={handleOpenEdit} className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800 cursor-pointer">
                                Edit Product
                            </button>
                            <button onClick={() => handleDelete(product._id)} className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100 cursor-pointer">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {isEditOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/55 p-4 backdrop-blur-sm"
                    onClick={() => setIsEditOpen(false)}
                >
                    <div
                        className="w-full max-w-5xl overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-start justify-between border-b border-neutral-200 bg-gradient-to-r from-neutral-50 to-white px-6 py-5">
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight text-neutral-900">
                                    Edit Product
                                </h2>
                                <p className="mt-1 text-sm text-neutral-500">
                                    Update product details and upload new images.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsEditOpen(false)}
                                className="rounded-full border border-neutral-300 px-3 py-1.5 text-xs font-medium text-neutral-700 transition hover:bg-neutral-100 cursor-pointer"
                            >
                                Close
                            </button>
                        </div>

                        <div className="max-h-[78vh] overflow-y-auto px-6 py-6">
                            <form onSubmit={handleEditSubmit} className="grid gap-5">
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
                                    <label className="text-sm font-medium text-neutral-800 mb-2 block">
                                        Current Images
                                    </label>
                                    <div className="mb-4">
                                        {product && product.images && product.images.length > 0 ? (
                                            <div className="flex overflow-x-auto gap-3 pb-2 scrollbar-hide">
                                                {product.images.map((image, idx) => {
                                                    const imgUrl = typeof image === "string" ? image : image?.url;
                                                    return (
                                                        <div key={idx} className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-neutral-200 bg-white">
                                                            <img
                                                                src={imgUrl}
                                                                alt={`${product.name} image ${idx + 1}`}
                                                                className="h-full w-full object-contain p-1"
                                                            />
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        ) : (
                                            <p className="text-sm text-neutral-500">No images currently uploaded.</p>
                                        )}
                                    </div>

                                    <label className="text-sm font-medium text-neutral-800">
                                        Upload New Images (Optional)
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
                                        onClick={() => setIsEditOpen(false)}
                                        className="w-full rounded-xl border border-neutral-300 px-4 py-2.5 text-sm font-medium text-neutral-700 hover:bg-neutral-100 cursor-pointer"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isSaving}
                                        className="w-full flex justify-center items-center gap-2 rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-neutral-800 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                                    >
                                        {isSaving ? (
                                            <>
                                                <svg className="h-4 w-4 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Saving...
                                            </>
                                        ) : (
                                            "Save Changes"
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}
