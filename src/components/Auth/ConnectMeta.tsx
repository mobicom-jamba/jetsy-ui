"use client";

import { useConnectMetaAccount } from "@/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Loader2, Link as LinkIcon, Facebook } from "lucide-react";

interface ConnectMetaProps {
  className?: string;
}

export default function ConnectMeta({ className }: ConnectMetaProps) {
  const connectMeta = useConnectMetaAccount();

  const handleConnect = () => {
    connectMeta.mutate();
  };

  return (
    <div className={className}>
      <Card className="max-w-md mx-auto">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
            <Facebook className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle>Connect Your Meta Account</CardTitle>
          <CardDescription>
            Connect your Meta (Facebook) advertising account to start creating
            and managing campaigns.
          </CardDescription>
        </CardHeader>

        <CardContent className="text-center">
          <Button
            onClick={handleConnect}
            disabled={connectMeta.isPending}
            size="lg"
            className="w-full"
          >
            {connectMeta.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <LinkIcon className="mr-2 h-4 w-4" />
            )}
            Connect Meta Account
          </Button>

          <div className="mt-4 text-xs text-muted-foreground">
            <p>
              We'll redirect you to Facebook to authorize access to your ad
              accounts.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
