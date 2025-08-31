"use client";

import { useState } from "react";
import { useMetaApps } from "@/hooks/useMetaApps";
import { useFacebookPages } from "@/hooks/useFacebook";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Link, Users, TrendingUp, Facebook } from "lucide-react";
import api from "@/lib/api";

export default function FacebookConnect() {
  const [selectedApp, setSelectedApp] = useState("");
  const [connecting, setConnecting] = useState(false);
  const { data: metaApps } = useMetaApps();
  const { data: facebookPages, refetch } = useFacebookPages();

  const verifiedApps = metaApps?.filter(
    (app) => app.isVerified && app.businessConfigEnabled
  );

  const handleConnect = async () => {
    // if (!selectedApp) return;

    setConnecting(true);
    try {
      const response = await api.get("/facebook/auth", {
        params: {
          //   metaAppId: selectedApp,
          features: "ads_management",
        },
      });

      window.location.href = response.data.authUrl;
    } catch (error) {
      console.error("Failed to initiate Facebook connection:", error);
      alert("Failed to connect. Please try again.");
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Facebook className="h-5 w-5 text-blue-600" />
            <span>Connect Facebook Pages</span>
          </CardTitle>
          <CardDescription>
            Connect your Facebook pages to manage posts and access insights
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* {!verifiedApps?.length ? (
            <div className="text-center py-4">
              <p className="text-gray-600 mb-4">
                You need a verified Meta app with Business Configuration to
                connect Facebook pages.
              </p>
              <Button variant="outline">Set Up Meta App</Button>
            </div>
          ) : ( */}
          <div className="flex items-center space-x-4">
            {/* <Select value={selectedApp} onValueChange={setSelectedApp}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Choose a Meta app..." />
              </SelectTrigger>
              <SelectContent>
                {verifiedApps.map((app) => (
                  <SelectItem key={app.id} value={app.id}>
                    {app.appName} ({app.appId})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select> */}

            <Button
              onClick={handleConnect}
              //   disabled={!selectedApp || connecting}
            >
              {connecting ? "Connecting..." : "Connect Pages"}
            </Button>
          </div>
          {/* )} */}
        </CardContent>
      </Card>

      {facebookPages?.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Connected Pages</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {facebookPages.map((page: any) => (
              <FacebookPageCard key={page.id} page={page} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function FacebookPageCard({ page }: { page: any }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{page.pageName}</CardTitle>
          <Badge variant="secondary">{page.pageCategory}</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Users className="h-4 w-4" />
          <span>{page.fanCount?.toLocaleString() || 0} followers</span>
        </div>

        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Link className="h-4 w-4" />
          <a
            href={page.pageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:underline truncate"
          >
            View Page
          </a>
        </div>

        <div className="flex space-x-2 pt-2">
          <Button size="sm" variant="outline" className="flex-1">
            <TrendingUp className="h-3 w-3 mr-1" />
            Insights
          </Button>
          <Button size="sm" variant="outline" className="flex-1">
            Post
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
