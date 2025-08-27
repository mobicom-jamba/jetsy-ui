"use client";

import { useState } from "react";
import { useCampaign, useUpdateCampaignStatus } from "@/hooks/useCampaigns";
import { useCampaignMetrics } from "@/hooks/useAnalytics";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Play,
  Pause,
  MoreHorizontal,
  TrendingUp,
  TrendingDown,
  Eye,
  MousePointer,
  DollarSign,
  Target,
  Calendar,
  Settings,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Users,
  MapPin,
  ArrowLeft,
  Plus,
} from "lucide-react";
import Link from "next/link";
import {
  formatCurrency,
  formatNumber,
  formatPercentage,
  formatDate,
} from "@/lib/utils";

import { toast } from "sonner";

interface CampaignDetailsProps {
  campaignId: string;
}

export default function CampaignDetails({ campaignId }: CampaignDetailsProps) {
  const [dateRange, setDateRange] = useState("last7days");
  const [selectedMetric, setSelectedMetric] = useState("impressions");

  const { data: campaign, isLoading, error } = useCampaign(campaignId);
  const { data: metrics, isLoading: metricsLoading } = useCampaignMetrics(
    campaignId,
    getDateRangeValues(dateRange)
  );
  const updateCampaignStatus = useUpdateCampaignStatus();

  if (isLoading) {
    return <CampaignDetailsSkeleton />;
  }

  if (error || !campaign) {
    return (
      <div className="space-y-6">
        <Alert variant="destructive">
          <AlertDescription>
            Campaign not found or you don't have permission to view it.
          </AlertDescription>
        </Alert>
        <Button asChild variant="outline">
          <Link href="/campaigns">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Campaigns
          </Link>
        </Button>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: string) => {
    try {
      await updateCampaignStatus.mutateAsync({
        id: campaignId,
        status: newStatus,
      });

      toast.success("Status updated", {
        description: `Campaign ${newStatus.toLowerCase()} successfully.`,
      });
    } catch (error) {
      toast.success("Update failed", {
        description: `Failed to update campaign status.`,
      });
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PAUSED":
        return "secondary";
      case "DELETED":
        return "destructive";
      default:
        return "outline";
    }
  };

  const chartData =
    metrics?.map((metric) => ({
      date: new Date(metric.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      impressions: metric.impressions,
      clicks: metric.clicks,
      spend: metric.spend,
      conversions: metric.conversions,
      ctr: metric.ctr,
      cpc: metric.cpc,
    })) || [];

  const totalMetrics = metrics?.reduce(
    (acc, metric) => ({
      impressions: acc.impressions + metric.impressions,
      clicks: acc.clicks + metric.clicks,
      spend: acc.spend + metric.spend,
      conversions: acc.conversions + metric.conversions,
    }),
    { impressions: 0, clicks: 0, spend: 0, conversions: 0 }
  ) || { impressions: 0, clicks: 0, spend: 0, conversions: 0 };

  const averageCTR =
    totalMetrics.impressions > 0
      ? (totalMetrics.clicks / totalMetrics.impressions) * 100
      : 0;
  const averageCPC =
    totalMetrics.clicks > 0 ? totalMetrics.spend / totalMetrics.clicks : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm" asChild>
              <Link href="/campaigns">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-2xl font-bold tracking-tight">
              {campaign.name}
            </h1>
            <Badge variant={getStatusVariant(campaign.status)}>
              {campaign.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            {campaign.objective.replace("OUTCOME_", "").toLowerCase()} •{" "}
            {campaign.MetaAccount?.accountName}
          </p>
          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
            <span>Created {formatDate(campaign.createdAt)}</span>
            {campaign.budget && (
              <span>
                Budget:{" "}
                {formatCurrency(
                  campaign.budget,
                  campaign.MetaAccount?.currency
                )}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {campaign.status === "ACTIVE" ? (
            <Button
              variant="outline"
              onClick={() => handleStatusChange("PAUSED")}
              disabled={updateCampaignStatus.isPending}
            >
              <Pause className="mr-2 h-4 w-4" />
              Pause
            </Button>
          ) : (
            <Button
              onClick={() => handleStatusChange("ACTIVE")}
              disabled={updateCampaignStatus.isPending}
            >
              <Play className="mr-2 h-4 w-4" />
              Activate
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Edit className="mr-2 h-4 w-4" />
                Edit Campaign
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="mr-2 h-4 w-4" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => handleStatusChange("DELETED")}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Impressions"
          value={formatNumber(totalMetrics.impressions)}
          change="+12.5%"
          trend="up"
          icon={Eye}
        />
        <MetricCard
          title="Clicks"
          value={formatNumber(totalMetrics.clicks)}
          change="+8.2%"
          trend="up"
          icon={MousePointer}
        />
        <MetricCard
          title="Spend"
          value={formatCurrency(
            totalMetrics.spend,
            campaign.MetaAccount?.currency
          )}
          change="-3.1%"
          trend="down"
          icon={DollarSign}
        />
        <MetricCard
          title="Conversions"
          value={formatNumber(totalMetrics.conversions)}
          change="+15.3%"
          trend="up"
          icon={Target}
        />
      </div>

      {/* Main Content */}
      <Tabs defaultValue="performance" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="adsets">Ad Sets</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* Performance Tab */}
        <TabsContent value="performance" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Performance Overview</CardTitle>
                  <CardDescription>
                    Track your campaign metrics over time
                  </CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-40">
                      <Calendar className="mr-2 h-4 w-4" />
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="today">Today</SelectItem>
                      <SelectItem value="yesterday">Yesterday</SelectItem>
                      <SelectItem value="last7days">Last 7 days</SelectItem>
                      <SelectItem value="last30days">Last 30 days</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select
                    value={selectedMetric}
                    onValueChange={setSelectedMetric}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="impressions">Impressions</SelectItem>
                      <SelectItem value="clicks">Clicks</SelectItem>
                      <SelectItem value="spend">Spend</SelectItem>
                      <SelectItem value="conversions">Conversions</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {metricsLoading ? (
                <Skeleton className="h-80 w-full" />
              ) : (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <defs>
                        <linearGradient
                          id="colorMetric"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.8}
                          />
                          <stop
                            offset="95%"
                            stopColor="hsl(var(--primary))"
                            stopOpacity={0.1}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip
                        formatter={(value, name) => [
                          selectedMetric === "spend"
                            ? formatCurrency(Number(value))
                            : formatNumber(Number(value)),
                          name,
                        ]}
                      />
                      <Area
                        type="monotone"
                        dataKey={selectedMetric}
                        stroke="hsl(var(--primary))"
                        fillOpacity={1}
                        fill="url(#colorMetric)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Additional Performance Metrics */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Click-Through Rate</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatPercentage(averageCTR)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">+0.3%</span>
                  <span className="ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Cost Per Click</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">
                  {formatCurrency(averageCPC)}
                </div>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <TrendingDown className="h-3 w-3 text-green-600 mr-1" />
                  <span className="text-green-600">-$0.12</span>
                  <span className="ml-1">vs last period</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Audience Tab */}
        <TabsContent value="audience" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Audience Insights
              </CardTitle>
              <CardDescription>
                Understand who's seeing and engaging with your campaign
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Top Demographics</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Women 25-34</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-3/4 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            34%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Men 35-44</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-1/2 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            28%
                          </span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Women 35-44</span>
                        <div className="flex items-center space-x-2">
                          <div className="w-20 h-2 bg-muted rounded-full">
                            <div className="w-1/3 h-2 bg-primary rounded-full"></div>
                          </div>
                          <span className="text-sm text-muted-foreground">
                            22%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Top Locations</h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇺🇸</span>
                          <span className="text-sm">United States</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          45%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇨🇦</span>
                          <span className="text-sm">Canada</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          23%
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg">🇬🇧</span>
                          <span className="text-sm">United Kingdom</span>
                        </div>
                        <span className="text-sm text-muted-foreground">
                          18%
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Ad Sets Tab */}
        <TabsContent value="adsets" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Ad Sets</CardTitle>
                  <CardDescription>
                    Manage your campaign's ad sets
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Ad Set
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {campaign.AdSets && campaign.AdSets.length > 0 ? (
                <div className="space-y-4">
                  {campaign.AdSets.map((adSet) => (
                    <div
                      key={adSet.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <h4 className="font-medium">{adSet.name}</h4>
                        <p className="text-sm text-muted-foreground">
                          {adSet.budget
                            ? formatCurrency(adSet.budget)
                            : "No budget set"}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={getStatusVariant(adSet.status)}>
                          {adSet.status}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium">No ad sets yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your first ad set to start running ads
                  </p>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create Ad Set
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Settings Tab */}
        <TabsContent value="settings" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign Settings</CardTitle>
              <CardDescription>
                Configure your campaign settings and targeting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Basic Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Name:</span>
                        <span>{campaign.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Objective:
                        </span>
                        <span>
                          {campaign.objective
                            .replace("OUTCOME_", "")
                            .toLowerCase()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Status:</span>
                        <Badge
                          variant={getStatusVariant(campaign.status)}
                          className="text-xs"
                        >
                          {campaign.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-2">Budget & Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">
                          Budget Type:
                        </span>
                        <span>{campaign.budgetType}</span>
                      </div>
                      {campaign.budget && (
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Budget:</span>
                          <span>
                            {formatCurrency(
                              campaign.budget,
                              campaign.MetaAccount?.currency
                            )}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Start:</span>
                        <span>
                          {campaign.startTime
                            ? formatDate(campaign.startTime)
                            : "Immediately"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">End:</span>
                        <span>
                          {campaign.endTime
                            ? formatDate(campaign.endTime)
                            : "Ongoing"}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t">
                <div className="flex space-x-2">
                  <Button variant="outline">
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Settings
                  </Button>
                  <Button variant="outline">
                    <Copy className="mr-2 h-4 w-4" />
                    Duplicate Campaign
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Utility Components
function MetricCard({
  title,
  value,
  change,
  trend,
  icon: Icon,
}: {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: any;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center text-xs text-muted-foreground">
          {trend === "up" ? (
            <TrendingUp className="h-3 w-3 text-green-600 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 text-red-600 mr-1" />
          )}
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>
            {change}
          </span>
          <span className="ml-1">from last period</span>
        </div>
      </CardContent>
    </Card>
  );
}

function CampaignDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex space-x-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-9" />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="pt-6">
              <Skeleton className="h-16 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-80 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

// Utility function
function getDateRangeValues(range: string) {
  const now = new Date();
  switch (range) {
    case "today":
      return {
        start: now.toISOString().split("T")[0],
        end: now.toISOString().split("T")[0],
      };
    case "yesterday":
      const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      return {
        start: yesterday.toISOString().split("T")[0],
        end: yesterday.toISOString().split("T")[0],
      };
    case "last7days":
      return {
        start: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        end: now.toISOString().split("T")[0],
      };
    case "last30days":
      return {
        start: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        end: now.toISOString().split("T")[0],
      };
    default:
      return undefined;
  }
}
