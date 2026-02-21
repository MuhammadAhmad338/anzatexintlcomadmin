"use client"

import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import type { AppDispatch } from "../store";
import { logout } from "../store/slices/authSlices";

export default function Header() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push("/signin");
  };

  return (
    <header className="h-14 border-b border-neutral-200 bg-white px-6 flex items-center justify-between">
      <h1 className="text-lg font-bold tracking-tight">Anzatexintl Seller Center</h1>
      <div className="flex items-center gap-3 text-sm text-neutral-600">
        <span className="hidden md:inline">Welcome back</span>
        <button
          onClick={handleLogout}
          className="rounded-md border border-neutral-300 px-3 py-1.5 text-xs hover:border-neutral-900"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
