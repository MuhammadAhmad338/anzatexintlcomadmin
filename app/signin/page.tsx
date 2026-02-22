"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../store";
import { loginUser, logout } from "../store/slices/authSlices";
import { Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react";

export default function AdminLoginPage() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading, error } = useSelector((state: RootState) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (user) {
      if (user.role === "admin") {
        router.push("/dashboard");
      } else {
        dispatch(logout());
      }
    }
  }, [user, dispatch, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  return (
    // "items-center justify-center" keeps it perfectly centered in the viewport
    <main className="min-h-screen flex items-center justify-center bg-[#F9FAFB] px-4 font-sans">

      {/* Reduced max-width to 380px for a "smaller" look */}
      <div className="w-full max-w-[380px] bg-white rounded-3xl shadow-xl p-6 md:p-8 flex flex-col border border-gray-100">

        {/* Header Section - More compact spacing */}
        <div className="flex flex-col items-center mb-6">
          <div className="bg-black p-2.5 rounded-2xl mb-3">
            <ShieldCheck className="text-white w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">
            Anzatexintl
          </h1>
          <p className="text-gray-400 text-xs mt-0.5 font-medium">
            Admin Seller Center
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-600 ml-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
              required
            />
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-gray-600 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 bg-gray-50/50 rounded-2xl px-4 py-2.5 text-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                spellCheck={false}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* Messages - Compacted */}
          {error && (
            <div className="bg-red-50 text-red-600 text-[12px] p-2.5 rounded-xl text-center font-medium">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-2xl text-sm font-bold hover:opacity-90 transition-all active:scale-[0.97] disabled:opacity-50 flex justify-center items-center mt-2"
          >
            {loading ? (
              <Loader2 className="animate-spin w-4 h-4" />
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <footer className="mt-6 pt-4 border-t border-gray-50 text-center">
          <p className="text-[10px] text-gray-300 uppercase tracking-widest font-bold">
            Secure Access Only
          </p>
        </footer>
      </div>
    </main>
  );
}