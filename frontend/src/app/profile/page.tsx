"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function ProfileRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.push("/login"); return; }
    if (user.role === "SERVICE_PROVIDER") router.replace("/provider/profile");
    else if (user.role === "SERVICE_AVAILER") router.replace("/availer/profile");
    else router.replace("/admin/dashboard");
  }, [user, loading, router]);

  return null;
}
