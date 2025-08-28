// client/src/components/Auth/MetaSetupGuide.tsx
"use client";

import { useState } from "react";
import { useConnectMetaAccount } from "@/hooks/useAccounts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  ExternalLink,
  AlertTriangle,
  Facebook,
  Globe,
  Shield,
  Settings,
  Copy,
  Check,
} from "lucide-react";

export default function MetaSetupGuide() {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const connectMeta = useConnectMetaAccount();

  const handleStepComplete = (stepId: string, completed: boolean) => {
    setCompletedSteps((prev) =>
      completed
        ? Array.from(new Set([...prev, stepId]))
        : prev.filter((id) => id !== stepId)
    );
  };

  const allStepsCompleted = ["domains", "oauth", "platform"].every((s) =>
    completedSteps.includes(s)
  );

  const progressPercentage = (completedSteps.length / 3) * 100;

  const handleConnect = () => {
    if (!allStepsCompleted) return;
    connectMeta.mutate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Facebook className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Meta Account Setup</CardTitle>
          <CardDescription>
            Complete these three steps in Meta Developer Console
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Setup Progress</span>
            <Badge variant="outline">
              {completedSteps.length} / 3 completed
            </Badge>
          </div>
          <Progress value={progressPercentage} className="w-full" />
        </CardContent>
      </Card>

      {/* Step 1: App Domains */}
      <StepCard
        id="domains"
        icon={<Globe className="h-5 w-5 text-blue-600" />}
        title="App Domains"
        description="Add your frontend & API domains in Settings → Basic → App Domains"
        values={[
          { label: "Frontend Domain", value: "jetsy-ui.vercel.app" },
          {
            label: "API Domain",
            value: "express-production-3cab.up.railway.app",
          },
        ]}
        checked={completedSteps.includes("domains")}
        onCheck={(c) => handleStepComplete("domains", !!c)}
      />

      {/* Step 2: OAuth Setup */}
      <StepCard
        id="oauth"
        icon={<Shield className="h-5 w-5 text-purple-600" />}
        title="OAuth Setup"
        description="Add your Valid OAuth Redirect URI in Facebook Login → Settings"
        values={[
          {
            label: "Production Callback",
            value:
              "https://express-production-3cab.up.railway.app/api/auth/meta/callback",
          },
        ]}
        checked={completedSteps.includes("oauth")}
        onCheck={(c) => handleStepComplete("oauth", !!c)}
      />

      {/* Step 3: Platform & Policy */}
      <StepCard
        id="platform"
        icon={<Settings className="h-5 w-5 text-emerald-600" />}
        title="Platform & Policy"
        description="Add Website URL, Privacy Policy, and Terms of Service in Settings → Basic"
        values={[
          { label: "Website URL", value: "https://jetsy-ui.vercel.app/" },
        ]}
        checked={completedSteps.includes("platform")}
        onCheck={(c) => handleStepComplete("platform", !!c)}
      />

      {/* Connect Button */}
      <Card>
        <CardContent className="pt-4">
          <Button
            onClick={handleConnect}
            disabled={!allStepsCompleted || connectMeta.isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            {connectMeta.isPending ? "Connecting..." : "Connect Meta Account"}
          </Button>
          {!allStepsCompleted && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Complete all steps above to enable Meta account connection.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

/* --------- Helper StepCard --------- */
function StepCard({
  id,
  icon,
  title,
  description,
  values,
  checked,
  onCheck,
}: {
  id: string;
  icon: React.ReactNode;
  title: string;
  description: string;
  values: { label: string; value: string }[];
  checked: boolean;
  onCheck: (c: boolean | "indeterminate") => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center">
            {icon}
          </div>
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            <CardDescription>{description}</CardDescription>
          </div>
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
      </CardHeader>
      <CardContent className="space-y-4">
        {values.map((v) => (
          <CopyableField key={v.value} label={v.label} value={v.value} />
        ))}
        <div className="flex items-center gap-2">
          <Checkbox
            id={`${id}-check`}
            checked={checked}
            onCheckedChange={onCheck}
          />
          <label
            htmlFor={`${id}-check`}
            className="text-sm font-medium cursor-pointer"
          >
            I have configured {title}
          </label>
        </div>
      </CardContent>
    </Card>
  );
}

/* --------- Copy Field --------- */
function CopyableField({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };
  return (
    <div className="flex items-center justify-between p-3 bg-muted rounded-lg border">
      <div>
        <h5 className="text-sm font-medium">{label}</h5>
        <code className="block text-xs font-mono">{value}</code>
      </div>
      <Button variant="outline" size="sm" onClick={handleCopy}>
        {copied ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </div>
  );
}
