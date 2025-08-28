// client/src/components/Settings/SettingsPage.tsx (UPDATED)
"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuthContext";
import { useMetaAccounts } from "@/hooks/useAccounts";
import { useMetaApps } from "@/hooks/useMetaApps";
import MetaAppSetup from "@/components/MetaApps/MetaAppSetup";
import ConnectedAccounts from "@/components/Settings/ConnectedAccounts";
import ProfileSettings from "@/components/Settings/ProfileSettings";
import { UserIcon, LinkIcon, CpuChipIcon } from "@heroicons/react/24/outline";

export default function SettingsPage() {
  const { user } = useAuth();
  const { data: metaAccounts, isLoading: accountsLoading } = useMetaAccounts();
  const { data: metaApps, isLoading: appsLoading } = useMetaApps();
  const [activeTab, setActiveTab] = useState("profile");

  const tabs = [
    { id: "profile", name: "Profile", icon: UserIcon },
    { id: "meta-apps", name: "Meta Apps", icon: CpuChipIcon },
    { id: "accounts", name: "Connected Accounts", icon: LinkIcon },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Manage your account settings and Meta app integrations
        </p>
      </div>

      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  group inline-flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors
                  ${
                    activeTab === tab.id
                      ? "border-primary-500 text-primary-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }
                `}
              >
                <Icon className="h-5 w-5 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="bg-white shadow rounded-lg">
        {activeTab === "profile" && <ProfileSettings user={user} />}

        {activeTab === "meta-apps" && (
          <div className="p-6">
            <MetaAppSetup />
          </div>
        )}

        {activeTab === "accounts" && (
          <ConnectedAccounts
            accounts={metaAccounts || []}
            loading={accountsLoading}
            metaApps={metaApps || []}
          />
        )}
      </div>
    </div>
  );
}
