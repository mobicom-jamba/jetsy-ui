// app/campaigns/create/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuthContext";
import MainLayout from "@/components/Layout/MainLayout";
import CampaignWizard from "@/components/Campaigns/CampaignWizard";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Plug,
  Shield,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  ExternalLink,
} from "lucide-react";
import { useMetaAccounts, useConnectMetaAccount } from "@/hooks/useAccounts";
import React from "react";

export default function CreateCampaignPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!authLoading && !user) router.push("/login");
  }, [user, authLoading, router]);

  const {
    data: accounts,
    isLoading: accountsLoading,
    refetch,
  } = useMetaAccounts();

  const connectMeta = useConnectMetaAccount();

  // 👇 One-time refetch after coming back from OAuth
  useEffect(() => {
    const cameFromOAuth =
      typeof window !== "undefined" &&
      localStorage.getItem("metaConnectInProgress");
    const hasOAuthParams =
      !!searchParams.get("connected") ||
      !!searchParams.get("code") ||
      !!searchParams.get("state");

    if (cameFromOAuth || hasOAuthParams) {
      refetch(); // force pull latest
      localStorage.removeItem("metaConnectInProgress");
    }
  }, [searchParams, refetch]);

  const hasConnectedAccount = Array.isArray(accounts) && accounts.length > 0;

  if (authLoading || accountsLoading) {
    return (
      <MainLayout>
        <CreateCampaignSkeleton />
      </MainLayout>
    );
  }

  if (!user) return null;

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Campaign
          </h1>
          <p className="text-muted-foreground">
            Set up your Meta advertising campaign in just a few steps
          </p>
        </div>

        {hasConnectedAccount ? (
          <CampaignWizard />
        ) : (
          <NoAccountGuard
            onConnect={() => connectMeta.mutate()}
            connecting={connectMeta.isPending}
            onRefresh={() => refetch()}
          />
        )}
      </div>
    </MainLayout>
  );
}

/* … keep your NoAccountGuard / StepRow / CopyButton / Skeleton exactly as-is … */

/* =========================
   Guard: No Meta Account
   ========================= */
function NoAccountGuard({
  onConnect,
  connecting,
  onRefresh,
}: {
  onConnect: () => void;
  connecting: boolean;
  onRefresh: () => void;
}) {
  return (
    <Card className="border-blue-200 bg-blue-50/40">
      <CardHeader className="text-center space-y-2">
        <div className="mx-auto w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center">
          <Plug className="h-7 w-7 text-blue-700" />
        </div>
        <CardTitle className="text-xl">
          Connect a Meta Account to Continue
        </CardTitle>
        <CardDescription>
          You need at least one connected Meta account before creating a
          campaign.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Minimal step list (inline, simple) */}
        <div className="grid gap-4">
          <StepRow
            num={1}
            title="App Domains"
            desc="Add your domains in Settings → Basic → App Domains"
            items={[
              { label: "Frontend Domain", value: "jetsy-ui.vercel.app" },
              {
                label: "API Domain",
                value: "express-production-3cab.up.railway.app",
              },
            ]}
          />
          <StepRow
            num={2}
            title="OAuth Setup"
            desc="Add your Valid OAuth Redirect URI in Facebook Login → Settings"
            items={[
              {
                label: "Production Callback",
                value:
                  "https://express-production-3cab.up.railway.app/api/auth/meta/callback",
              },
            ]}
          />
          <StepRow
            num={3}
            title="Platform & Policy"
            desc="Add Website URL, Privacy Policy URL, and Terms of Service URL in Settings → Basic"
            items={[
              { label: "Website URL", value: "https://jetsy-ui.vercel.app/" },
              {
                label: "Privacy Policy URL",
                value: "https://your-privacy-policy.com",
              },
              {
                label: "Terms of Service URL",
                value: "https://your-terms.com",
              },
            ]}
          />
        </div>

        <Separator />

        {/* Live Mode + Permissions reminders */}
        <div className="grid gap-3">
          <Alert className="border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertDescription className="text-amber-800">
              <span className="font-medium">Required for Live Mode:</span>{" "}
              public <strong>Privacy Policy</strong> &{" "}
              <strong>Terms of Service</strong> URLs.
            </AlertDescription>
          </Alert>

          <Alert className="border-blue-200 bg-blue-50">
            <Shield className="h-4 w-4 text-blue-700" />
            <AlertDescription className="text-blue-900">
              <span className="font-medium">Required API Permissions:</span>{" "}
              <Badge variant="outline" className="ml-1">
                ads_management
              </Badge>{" "}
              <Badge variant="outline">ads_read</Badge>{" "}
              <Badge variant="outline">business_management</Badge>{" "}
              <Badge variant="outline">read_insights</Badge>
            </AlertDescription>
          </Alert>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onConnect}
            disabled={connecting}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
          >
            {connecting ? "Connecting..." : "Connect Meta Account"}
          </Button>

          {/* Optional: direct link to Meta Dev Console */}
          <Button
            type="button"
            variant="link"
            className="flex-1 text-blue-700 hover:text-blue-900"
            onClick={() =>
              window.open("https://developers.facebook.com/apps", "_blank")
            }
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Go to Meta Developer Console
          </Button>

          <Button
            type="button"
            variant="outline"
            onClick={onRefresh}
            className="sm:w-40"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>

        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertDescription>
            Complete all steps above to enable Meta account connection. Once
            connected, you can create your campaign here.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}

/* ================
   Step Row (simple)
   ================ */
function StepRow({
  num,
  title,
  desc,
  items,
}: {
  num: number;
  title: string;
  desc: string;
  items: { label: string; value: string }[];
}) {
  return (
    <div className="rounded-lg border bg-white">
      <div className="flex items-start gap-3 p-4">
        <div className="flex-shrink-0 mt-0.5">
          <Badge
            variant="outline"
            className="rounded-full w-7 h-7 flex items-center justify-center"
          >
            {num}
          </Badge>
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold">{title}</h3>
              <p className="text-sm text-muted-foreground">{desc}</p>
            </div>
            <Button
              variant="link"
              className="text-blue-600 hover:text-blue-800"
              onClick={() =>
                window.open("https://developers.facebook.com/apps", "_blank")
              }
            >
              <ExternalLink className="h-4 w-4 mr-1" />
              Go to Console
            </Button>
          </div>

          <div className="mt-3 grid gap-2">
            {items.map(({ label, value }) => (
              <div
                key={`${label}-${value}`}
                className="flex items-center justify-between p-3 bg-muted rounded-lg border"
              >
                <div>
                  <div className="text-xs uppercase tracking-wide text-muted-foreground">
                    {label}
                  </div>
                  <code className="text-sm font-mono break-all">{value}</code>
                </div>
                {/* copy button kept super minimal */}
                <CopyButton value={value} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ================
   Copy Button
   ================ */
function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={async () => {
        await navigator.clipboard.writeText(value);
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      }}
    >
      {copied ? (
        <>
          <CheckCircle2 className="h-3 w-3 mr-1 text-green-600" />
          Copied
        </>
      ) : (
        "Copy"
      )}
    </Button>
  );
}

/* =========================
   Loading Skeleton
   ========================= */
function CreateCampaignSkeleton() {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <Skeleton className="h-8 w-64 mx-auto" />
        <Skeleton className="h-4 w-96 mx-auto" />
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-full" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
