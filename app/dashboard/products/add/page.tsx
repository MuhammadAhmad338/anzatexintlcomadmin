"use client";

import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { createProduct, clearSuccess, clearError } from "../../../store/slices/productsSlice";
import { useRouter } from "next/navigation";
import { ArrowLeft, Tag, Image as ImageIcon, Package, DollarSign, CheckCircle2, AlertCircle, X, Info, Layers, Zap, Eye, BarChart3 } from "lucide-react";

export default function AddProductPage() {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const { loading, error, success } = useAppSelector((state: any) => state.products);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        discountPrice: "",
        category: "",
        stock: "",
        brand: "Anzatex Intl",
        isActive: true,
    });

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSuccessfullySaved, setIsSuccessfullySaved] = useState(false);

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

    const handleSubmit = async (e: React.FormEvent) => {
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
        if (success) {
            setIsSuccessfullySaved(true);
            const t = setTimeout(() => {
                dispatch(clearSuccess());
                router.push("/dashboard/products");
            }, 2000);
            return () => clearTimeout(t);
        }
    }, [success, dispatch, router]);

    if (isSuccessfullySaved) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[80vh] bg-white animate-in fade-in duration-500">
                <div className="relative">
                    <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
                    <div className="h-24 w-24 rounded-full bg-neutral-900 flex items-center justify-center relative z-10">
                        <CheckCircle2 size={42} className="text-white" />
                    </div>
                </div>
                <h1 className="text-3xl font-bold text-neutral-900 mt-8">Product Successfully Listed</h1>
                <p className="text-neutral-400 mt-2 font-medium">Updating your master inventory...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            {/* Dynamic Action Bar */}
            <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-100 px-8 py-4 flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => router.push("/dashboard/products")}
                        className="h-10 w-10 flex items-center justify-center rounded-full hover:bg-neutral-50 border border-neutral-100 transition-all text-neutral-400 hover:text-neutral-900"
                    >
                        <ArrowLeft size={18} />
                    </button>
                    <div>
                        <h1 className="text-sm font-black uppercase tracking-widest text-neutral-900">New Product Entry</h1>
                        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-tighter">Inventory / Catalog / Create</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border ${form.isActive ? 'bg-green-50 text-green-600 border-green-100' : 'bg-neutral-50 text-neutral-400 border-neutral-200'}`}>
                        <div className={`h-1.5 w-1.5 rounded-full ${form.isActive ? 'bg-green-500 animate-pulse' : 'bg-neutral-300'}`}></div>
                        {form.isActive ? 'Status: Live' : 'Status: Draft'}
                    </div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="bg-neutral-900 text-white px-8 py-2.5 rounded-full text-xs font-black uppercase tracking-widest hover:bg-neutral-800 transition shadow-xl shadow-neutral-200 disabled:opacity-50 active:scale-95"
                    >
                        {loading ? "Publishing..." : "Publish Item"}
                    </button>
                </div>
            </div>

            <div className="max-w-[1400px] mx-auto flex">
                {/* Left Column: Form Fields */}
                <div className="flex-1 p-12 space-y-20">

                    {/* Section 01: Core Details */}
                    <div className="space-y-12">
                        <div className="flex items-start gap-12">
                            <div className="w-1/3">
                                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">01. Identity</h2>
                                <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">Establish the core identity of the product. This information will be displayed prominently on the store front.</p>
                            </div>
                            <div className="flex-1 space-y-8">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Full Product Name</label>
                                    <input
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b-2 border-neutral-100 focus:border-neutral-900 transition-all py-3 text-2xl font-bold outline-none placeholder:text-neutral-100"
                                        placeholder="e.g. Classic Cotton Overshirt"
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Market Category</label>
                                        <select
                                            name="category"
                                            value={form.category}
                                            onChange={handleChange}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none appearance-none hover:border-neutral-200 transition"
                                            required
                                        >
                                            <option value="" disabled>Choose category...</option>
                                            <option value="Garments">Garments</option>
                                            <option value="Cosmetics">Cosmetics</option>
                                        </select>
                                    </div>
                                    <div className="space-y-3">
                                        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Brand Identifier</label>
                                        <input
                                            name="brand"
                                            value={form.brand}
                                            onChange={handleChange}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 text-sm font-bold outline-none placeholder:text-neutral-200"
                                            placeholder="Anzatex Intl"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 02: Description */}
                    <div className="space-y-12">
                        <div className="flex items-start gap-12">
                            <div className="w-1/3">
                                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">02. Storytelling</h2>
                                <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">Describe the materials, craftsmanship, and key selling points of this item.</p>
                            </div>
                            <div className="flex-1">
                                <textarea
                                    name="description"
                                    value={form.description}
                                    onChange={handleChange}
                                    className="w-full bg-neutral-50 border border-neutral-100 rounded-2xl p-6 text-sm font-medium outline-none min-h-[200px] hover:border-neutral-200 focus:ring-4 focus:ring-neutral-50 transition"
                                    placeholder="Tell the product's story..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Section 03: Values */}
                    <div className="space-y-12">
                        <div className="flex items-start gap-12">
                            <div className="w-1/3">
                                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">03. Logic & Value</h2>
                                <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">Configure the pricing architecture and initial stock levels for this entry.</p>
                            </div>
                            <div className="flex-1 grid grid-cols-3 gap-6">
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Base Price</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-[10px]">PKR</span>
                                        <input
                                            name="price"
                                            type="number"
                                            value={form.price}
                                            onChange={handleChange}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pl-12 pr-4 py-3.5 text-base font-black outline-none"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Discount</label>
                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-black text-[10px]">PKR</span>
                                        <input
                                            name="discountPrice"
                                            type="number"
                                            value={form.discountPrice}
                                            onChange={handleChange}
                                            className="w-full bg-neutral-50 border border-neutral-100 rounded-xl pl-12 pr-4 py-3.5 text-base font-black text-green-600 outline-none"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Inventory</label>
                                    <input
                                        name="stock"
                                        type="number"
                                        value={form.stock}
                                        onChange={handleChange}
                                        className="w-full bg-neutral-50 border border-neutral-100 rounded-xl px-4 py-3.5 text-base font-black outline-none"
                                        placeholder="0"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Section 04: Visuals */}
                    <div className="space-y-12 pb-24">
                        <div className="flex items-start gap-12">
                            <div className="w-1/3">
                                <h2 className="text-sm font-black text-neutral-900 uppercase tracking-widest">04. Visual Gallery</h2>
                                <p className="text-xs text-neutral-400 mt-2 font-medium leading-relaxed">Upload high-resolution media to represent the product quality.</p>
                            </div>
                            <div className="flex-1 space-y-6">
                                <div className="relative group min-h-[160px] rounded-3xl border-2 border-dashed border-neutral-100 bg-neutral-50/50 flex flex-col items-center justify-center hover:bg-neutral-50 hover:border-neutral-200 transition-all">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    />
                                    <div className="h-12 w-12 rounded-full bg-white shadow-sm flex items-center justify-center border border-neutral-100 mb-2">
                                        <ImageIcon size={20} className="text-neutral-300" />
                                    </div>
                                    <p className="text-[10px] font-black text-neutral-900 uppercase tracking-widest">Select Media Assets</p>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-4 gap-4">
                                        {imagePreviews.map((src, i) => (
                                            <div key={i} className="relative aspect-square rounded-2xl overflow-hidden border border-neutral-100 group shadow-sm bg-neutral-50">
                                                <img src={src} className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition duration-500" alt="" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(i)}
                                                    className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm h-7 w-7 flex items-center justify-center rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-all shadow-lg"
                                                >
                                                    <X size={14} strokeWidth={3} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column: Mini Settings & Status */}
                <div className="w-[380px] border-l border-neutral-100 p-12 space-y-8 sticky top-20 h-[calc(100vh-80px)] overflow-y-auto hidden xl:block">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Configuration</h3>

                        <div className="space-y-4">
                            <div className="p-5 rounded-2xl border border-neutral-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-900">Visibility</span>
                                    <button
                                        type="button"
                                        onClick={() => setForm(prev => ({ ...prev, isActive: !prev.isActive }))}
                                        className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${form.isActive ? 'bg-neutral-900' : 'bg-neutral-200'}`}
                                    >
                                        <span className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform ${form.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                    </button>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-medium leading-relaxed">Toggle whether this product is visible to public visitors.</p>
                            </div>

                            <div className="p-5 rounded-2xl border border-neutral-100 space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-neutral-900">Catalog Health</span>
                                    <Zap size={14} className="text-yellow-500" />
                                </div>
                                <div className="grid grid-cols-4 gap-1 h-1.5">
                                    <div className={`rounded-full ${form.name ? 'bg-green-500' : 'bg-neutral-100'}`}></div>
                                    <div className={`rounded-full ${form.category ? 'bg-green-500' : 'bg-neutral-100'}`}></div>
                                    <div className={`rounded-full ${form.price ? 'bg-green-500' : 'bg-neutral-100'}`}></div>
                                    <div className={`rounded-full ${images.length > 0 ? 'bg-green-500' : 'bg-neutral-100'}`}></div>
                                </div>
                                <p className="text-[10px] text-neutral-400 font-medium tracking-tight">Requirement Checklist</p>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-red-50 rounded-2xl border border-red-100 flex items-start gap-3">
                                <AlertCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                                <p className="text-[10px] font-bold text-red-600 leading-relaxed uppercase tracking-widest">{error}</p>
                            </div>
                        )}
                    </div>

                    <div className="pt-8 border-t border-neutral-100 space-y-4">
                        <h3 className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Summary</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-neutral-400">Inventory Status</span>
                                <span className={Number(form.stock) > 0 ? "text-neutral-900" : "text-red-500"}>{form.stock || 0} Base Units</span>
                            </div>
                            <div className="flex justify-between text-[11px] font-bold">
                                <span className="text-neutral-400">Net Valuation</span>
                                <span className="text-neutral-900">PKR {Number(form.price).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
