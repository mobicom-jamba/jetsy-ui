// ================================================================
// SETUP INSTRUCTIONS COMPONENT
// ================================================================

// client/src/components/MetaApps/SetupInstructions.tsx
"use client";

import { CheckIcon } from "@heroicons/react/24/outline";
import { ExternalLinkIcon } from "lucide-react";

export default function SetupInstructions() {
  const steps = [
    {
      id: 1,
      title: "Create Meta for Developers Account",
      description: "Sign up or log in to Meta for Developers",
      link: "https://developers.facebook.com/",
      completed: false,
    },
    {
      id: 2,
      title: "Create New App",
      description: 'Click "Create App" and select "Business" type',
      completed: false,
    },
    {
      id: 3,
      title: "Add Marketing API",
      description: 'In your app dashboard, add the "Marketing API" product',
      completed: false,
    },
    {
      id: 4,
      title: "Configure App Settings",
      description: "Add your domain to App Domains and set up redirect URLs",
      completed: false,
    },
    {
      id: 5,
      title: "Get Credentials",
      description: "Copy your App ID and App Secret from the Basic Settings",
      completed: false,
    },
  ];

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Setup Your Meta App
      </h3>

      <div className="space-y-4">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start space-x-3">
            <div
              className={`
              flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium
              ${
                step.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-600"
              }
            `}
            >
              {step.completed ? <CheckIcon className="h-4 w-4" /> : step.id}
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
                    <ExternalLinkIcon className="h-4 w-4" />
                  </a>
                )}
              </div>
              <p className="text-sm text-gray-600">{step.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-md">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          Important Notes:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Your app credentials are encrypted and stored securely</li>
          <li>• You can add multiple Meta apps for different use cases</li>
          <li>• Each app can connect to multiple ad accounts</li>
          <li>
            • Webhook URLs are optional but recommended for real-time updates
          </li>
        </ul>
      </div>
    </div>
  );
}
