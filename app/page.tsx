"use client";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "./store";
import { useRouter } from "next/navigation";
import { useAppSelector } from "./hooks/redux";
import { hydrateFromStorage } from "./store/slices/authSlices";

export default function Page() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAppSelector((state) => state.auth);

  // read persisted auth from localStorage on mount
  useEffect(() => {
    dispatch(hydrateFromStorage());
  }, [dispatch]);

  // redirect based on auth state
  useEffect(() => {
    if (user) {
      router.push("/dashboard");
    } else {
      router.push("/signin");
    }
  }, [user, router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-sm text-neutral-600">Checking authentication…</p>
    </div>
  );
}
