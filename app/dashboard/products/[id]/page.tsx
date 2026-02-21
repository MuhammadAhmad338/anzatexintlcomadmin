"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { getProducts } from "../../../store/slices/productsSlice";

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
                            <button className="flex-1 rounded-xl bg-neutral-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800">
                                Edit Product
                            </button>
                            <button className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-100">
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
