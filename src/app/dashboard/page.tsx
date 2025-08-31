"use client";

import { useAuth } from "@/hooks/useAuthContext";
import MainLayout from "@/components/Layout/MainLayout";
import DashboardOverview from "@/components/Dashboard/DashboardOverview";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import FacebookConnect from "@/components/Facebook/FacebookConnect";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <FacebookConnect />
      {/* <DashboardOverview /> */}
    </MainLayout>
  );
}
