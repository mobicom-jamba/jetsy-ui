// client/src/components/MetaApps/MetaAppSetup.tsx (UPDATED with shadcn/ui)
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateMetaAppData } from "@/types/auth";
import {
  useCreateMetaApp,
  useMetaApps,
  useDeleteMetaApp,
  useVerifyMetaApp,
} from "@/hooks/useMetaApps";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  PlusIcon,
  CheckCircle,
  AlertCircle,
  Trash2,
  Edit,
  ExternalLink,
} from "lucide-react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function MetaAppSetup() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: metaApps, isLoading } = useMetaApps();
  const createMetaApp = useCreateMetaApp();
  const deleteMetaApp = useDeleteMetaApp();
  const verifyMetaApp = useVerifyMetaApp();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateMetaAppData>();

  const onSubmit = async (data: CreateMetaAppData) => {
    try {
      await createMetaApp.mutateAsync(data);
      setShowCreateModal(false);
      reset();
    } catch (error) {
      console.error("Failed to create Meta app:", error);
    }
  };

  const handleDelete = async (appId: string, appName: string) => {
    if (
      confirm(
        `Are you sure you want to delete "${appName}"? This will disconnect all associated ad accounts.`
      )
    ) {
      try {
        await deleteMetaApp.mutateAsync(appId);
      } catch (error) {
        console.error("Failed to delete Meta app:", error);
      }
    }
  };

  const handleVerify = async (appId: string) => {
    try {
      await verifyMetaApp.mutateAsync(appId);
    } catch (error) {
      console.error("Failed to verify Meta app:", error);
    }
  };

  const hasMetaApps = metaApps && metaApps.length > 0;

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="h-6 bg-gray-200 rounded w-32 animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded w-64 mt-1 animate-pulse"></div>
          </div>
          <div className="h-10 bg-gray-200 rounded w-32 animate-pulse"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="h-48 bg-gray-200 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Meta Apps</h2>
          <p className="text-sm text-gray-600 mt-1">
            Add your Meta (Facebook) app credentials to connect ad accounts
          </p>
        </div>

        <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon className="h-4 w-4 mr-2" />
              Add Meta App
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Add Meta App</DialogTitle>
              <DialogDescription>
                Add your Meta app credentials to connect advertising accounts
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <Alert>
                <ExclamationTriangleIcon className="h-4 w-4" />
                <AlertDescription>
                  You need to create a Meta app in the{" "}
                  <a
                    href="https://developers.facebook.com/apps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline inline-flex items-center"
                  >
                    Meta for Developers portal
                    <ExternalLink className="h-3 w-3 ml-1" />
                  </a>{" "}
                  and add the Marketing API product.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="appName">App Name</Label>
                  <Input
                    id="appName"
                    {...register("appName", {
                      required: "App name is required",
                    })}
                    placeholder="My Marketing App"
                    className={errors.appName ? "border-red-500" : ""}
                  />
                  {errors.appName && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.appName.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    A friendly name to identify your app
                  </p>
                </div>

                <div>
                  <Label htmlFor="appId">Meta App ID</Label>
                  <Input
                    id="appId"
                    {...register("appId", {
                      required: "Meta App ID is required",
                    })}
                    placeholder="432566358978550"
                    className={errors.appId ? "border-red-500" : ""}
                  />
                  {errors.appId && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.appId.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Found in your Meta app dashboard
                  </p>
                </div>

                <div>
                  <Label htmlFor="appSecret">Meta App Secret</Label>
                  <Input
                    id="appSecret"
                    type="password"
                    {...register("appSecret", {
                      required: "Meta App Secret is required",
                    })}
                    placeholder="5f713841fbc1921e1f3a64292c481c18"
                    className={errors.appSecret ? "border-red-500" : ""}
                  />
                  {errors.appSecret && (
                    <p className="text-sm text-red-600 mt-1">
                      {errors.appSecret.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Keep this secret secure - it will be encrypted
                  </p>
                </div>

                <div>
                  <Label htmlFor="webhookUrl">Webhook URL (Optional)</Label>
                  <Input
                    id="webhookUrl"
                    {...register("webhookUrl")}
                    placeholder="https://yourdomain.com/webhooks/meta"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    For receiving real-time updates from Meta
                  </p>
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={createMetaApp.isPending}>
                  {createMetaApp.isPending ? "Adding..." : "Add Meta App"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {!hasMetaApps && !isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Meta Apps Connected
              </h3>
              <p className="text-gray-600 mb-4">
                You need to add your Meta app credentials to start creating ad
                campaigns.
              </p>
              <Button onClick={() => setShowCreateModal(true)}>
                <PlusIcon className="h-4 w-4 mr-2" />
                Add Your First Meta App
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {hasMetaApps && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {metaApps.map((app) => (
            <MetaAppCard
              key={app.id}
              app={app}
              onDelete={handleDelete}
              onVerify={handleVerify}
              isDeleting={deleteMetaApp.isPending}
              isVerifying={verifyMetaApp.isPending}
            />
          ))}
        </div>
      )}

      <SetupInstructions />
    </div>
  );
}

function MetaAppCard({
  app,
  onDelete,
  onVerify,
  isDeleting,
  isVerifying,
}: {
  app: any;
  onDelete: (id: string, name: string) => void;
  onVerify: (id: string) => void;
  isDeleting: boolean;
  isVerifying: boolean;
}) {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{app.appName}</CardTitle>
          <Badge
            variant={app.isVerified ? "default" : "secondary"}
            className={
              app.isVerified
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }
          >
            {app.isVerified ? (
              <CheckCircle className="h-3 w-3 mr-1" />
            ) : (
              <AlertCircle className="h-3 w-3 mr-1" />
            )}
            {app.isVerified ? "Verified" : "Pending"}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">App ID:</span>
            <code className="text-xs bg-gray-100 px-2 py-1 rounded">
              {app.appId}
            </code>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Status:</span>
            <span className="font-medium">{app.verificationStatus}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Created:</span>
            <span>{new Date(app.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {!app.isVerified && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription className="text-xs">
              App credentials need verification before use
            </AlertDescription>
          </Alert>
        )}
      </CardContent>

      <CardFooter className="pt-3">
        <div className="flex items-center justify-between w-full space-x-2">
          {!app.isVerified && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onVerify(app.id)}
              disabled={isVerifying}
              className="flex-1"
            >
              {isVerifying ? "Verifying..." : "Verify"}
            </Button>
          )}

          <Button size="sm" variant="outline" className="px-3">
            <Edit className="h-4 w-4" />
          </Button>

          <Button
            size="sm"
            variant="outline"
            onClick={() => onDelete(app.id, app.appName)}
            disabled={isDeleting}
            className="px-3 text-red-600 border-red-200 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function SetupInstructions() {
  const steps = [
    {
      id: 1,
      title: "Create Meta for Developers Account",
      description: "Sign up or log in to Meta for Developers",
      link: "https://developers.facebook.com/",
    },
    {
      id: 2,
      title: "Create New App",
      description: 'Click "Create App" and select "Business" type',
    },
    {
      id: 3,
      title: "Add Marketing API",
      description: 'In your app dashboard, add the "Marketing API" product',
    },
    {
      id: 4,
      title: "Configure App Settings",
      description: "Add your domain to App Domains and set up redirect URLs",
    },
    {
      id: 5,
      title: "Get Credentials",
      description: "Copy your App ID and App Secret from the Basic Settings",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 mr-2 text-blue-600" />
          Setup Instructions
        </CardTitle>
        <CardDescription>
          Follow these steps to create and configure your Meta app
        </CardDescription>
      </CardHeader>

      <CardContent>
        <div className="space-y-4">
          {steps.map((step, index) => (
            <div key={step.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-xs font-medium text-primary-600">
                  {step.id}
                </span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {step.title}
                  </h4>
                  {step.link && (
                    <a
                      href={step.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary-600 hover:text-primary-700"
                    >
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>
            <strong>Important:</strong> Your app credentials are encrypted and
            stored securely. You can add multiple Meta apps for different use
            cases.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  );
}
