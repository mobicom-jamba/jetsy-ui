"use client";

import { useCampaigns } from "@/hooks/useCampaigns";
import { useMetaAccounts } from "@/hooks/useAccounts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Plus,
  AlertCircle,
} from "lucide-react";
import Link from "next/link";
import ConnectMeta from "@/components/Auth/ConnectMeta";
import { MetricCard } from "./MetricsCards";
import { DashboardSkeleton } from "./DashboardSkeleton";
import { CampaignsSkeleton } from "./CampaignsSkeleton";

export default function DashboardOverview() {
  const { data: campaigns, isLoading: campaignsLoading } = useCampaigns();
  const { data: metaAccounts, isLoading: accountsLoading } = useMetaAccounts();

  if (accountsLoading) {
    return <DashboardSkeleton />;
  }

  if (!metaAccounts || metaAccounts.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome to Jetsy Ads Platform Manager
          </p>
        </div>
        <ConnectMeta />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Monitor your Meta advertising performance
          </p>
        </div>
        <Button asChild size="lg">
          <Link href="/campaigns/create">
            <Plus className="mr-2 h-4 w-4" />
            New Campaign
          </Link>
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Impressions"
          value="125,432"
          change="+12.5%"
          trend="up"
          icon={Eye}
        />
        <MetricCard
          title="Clicks"
          value="8,234"
          change="+8.2%"
          trend="up"
          icon={MousePointer}
        />
        <MetricCard
          title="Spend"
          value="$2,450.32"
          change="-3.1%"
          trend="down"
          icon={DollarSign}
        />
        <MetricCard
          title="Conversions"
          value="156"
          change="+15.3%"
          trend="up"
          icon={Target}
        />
      </div>

      {/* Recent Campaigns */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>
                Your latest campaign performance
              </CardDescription>
            </div>
            <Button variant="outline" asChild>
              <Link href="/campaigns">View all</Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {campaignsLoading ? (
            <CampaignsSkeleton />
          ) : campaigns && campaigns.length > 0 ? (
            <div className="space-y-4">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="space-y-1">
                    <h4 className="font-semibold">{campaign.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {campaign.objective.replace("OUTCOME_", "").toLowerCase()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge
                      variant={
                        campaign.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {campaign.status}
                    </Badge>
                    <Button variant="ghost" size="sm" asChild>
                      <Link href={`/campaigns/${campaign.id}`}>View</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No campaigns found. Create your first campaign to get started.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Connected Accounts */}
      <Card>
        <CardHeader>
          <CardTitle>Connected Accounts</CardTitle>
          <CardDescription>Your Meta advertising accounts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {metaAccounts.map((account) => (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-semibold">M</span>
                  </div>
                  <div>
                    <h4 className="font-semibold">{account.accountName}</h4>
                    <p className="text-sm text-muted-foreground">
                      {account.currency} • {account.accountStatus}
                    </p>
                  </div>
                </div>
                <Badge variant="outline">
                  {account.isActive ? "Connected" : "Disconnected"}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
