"use client";

import { useAuth } from "@/hooks/useAuthContext";
import MainLayout from "@/components/Layout/MainLayout";
import CampaignDetails from "@/components/Campaigns/CampaignDetails";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { use } from "react";

export default function Page(props: { params: Promise<{ id: string }> }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { id } = use(props.params);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) return null;

  return (
    <MainLayout>
      <CampaignDetails campaignId={id} />
    </MainLayout>
  );
}
