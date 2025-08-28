// client/src/components/MetaApps/MetaAppSetup.tsx
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { CreateMetaAppData } from "@/types/auth";
import { useCreateMetaApp, useMetaApps } from "@/hooks/useMetaApps";
import Button from "@/components/Common/Button";
import Input from "@/components/Common/Input";
import Modal from "@/components/Common/Modal";
import { PlusIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";

export default function MetaAppSetup() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const { data: metaApps, isLoading } = useMetaApps();
  const createMetaApp = useCreateMetaApp();

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

  const hasMetaApps = metaApps && metaApps.length > 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-medium text-gray-900">Meta Apps</h2>
          <p className="text-sm text-gray-500">
            Add your Meta (Facebook) app credentials to connect ad accounts
          </p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <PlusIcon className="h-4 w-4 mr-2" />
          Add Meta App
        </Button>
      </div>

      {!hasMetaApps && !isLoading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <ExclamationTriangleIcon className="h-6 w-6 text-blue-600" />
          </div>
          <h3 className="text-lg font-medium text-blue-900 mb-2">
            No Meta Apps Connected
          </h3>
          <p className="text-blue-700 mb-4">
            You need to add your Meta app credentials to start creating ad
            campaigns.
          </p>
          <Button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex"
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            Add Your First Meta App
          </Button>
        </div>
      )}

      {isLoading && (
        <div className="space-y-4">
          {[...Array(2)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-100 rounded-lg p-6 h-24"
            ></div>
          ))}
        </div>
      )}

      {hasMetaApps && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {metaApps.map((app) => (
            <MetaAppCard key={app.id} app={app} />
          ))}
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Add Meta App"
        size="lg"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
            <div className="flex">
              <ExclamationTriangleIcon className="h-5 w-5 text-yellow-400 mr-2 mt-0.5" />
              <div className="text-sm">
                <h3 className="font-medium text-yellow-800">
                  Before you start
                </h3>
                <p className="text-yellow-700 mt-1">
                  You need to create a Meta (Facebook) app in the{" "}
                  <a
                    href="https://developers.facebook.com/apps/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline"
                  >
                    Meta for Developers
                  </a>{" "}
                  portal and add the Marketing API product.
                </p>
              </div>
            </div>
          </div>

          <Input
            label="App Name"
            {...register("appName", { required: "App name is required" })}
            placeholder="My Marketing App"
            error={errors.appName?.message}
            helpText="A friendly name to identify your app"
          />

          <Input
            label="Meta App ID"
            {...register("appId", { required: "Meta App ID is required" })}
            placeholder="432566358978550"
            error={errors.appId?.message}
            helpText="Found in your Meta app dashboard"
          />

          <Input
            label="Meta App Secret"
            type="password"
            {...register("appSecret", {
              required: "Meta App Secret is required",
            })}
            placeholder="5f713841fbc1921e1f3a64292c481c18"
            error={errors.appSecret?.message}
            helpText="Keep this secret secure - it will be encrypted"
          />

          <Input
            label="Webhook URL (Optional)"
            {...register("webhookUrl")}
            placeholder="https://yourdomain.com/webhooks/meta"
            error={errors.webhookUrl?.message}
            helpText="For receiving real-time updates from Meta"
          />

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setShowCreateModal(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createMetaApp.isPending}>
              Add Meta App
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

function MetaAppCard({ app }: { app: any }) {
  const [showSecret, setShowSecret] = useState(false);

  return (
    <div className="card p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-medium text-gray-900">{app.appName}</h3>
        <div
          className={`status-badge ${
            app.isVerified
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {app.isVerified ? "Verified" : "Pending"}
        </div>
      </div>

      <div className="space-y-3 text-sm">
        <div>
          <span className="text-gray-500">App ID:</span>
          <span className="ml-2 font-mono text-gray-900">{app.appId}</span>
        </div>

        <div>
          <span className="text-gray-500">Created:</span>
          <span className="ml-2 text-gray-900">
            {new Date(app.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
        <Button variant="outline" size="sm">
          Edit
        </Button>
        <Button variant="outline" size="sm" className="text-red-600">
          Remove
        </Button>
      </div>
    </div>
  );
}
