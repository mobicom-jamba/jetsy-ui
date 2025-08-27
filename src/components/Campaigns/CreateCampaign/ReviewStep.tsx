"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  CheckCircle,
  DollarSign,
  Users,
  MapPin,
  Palette,
  Eye,
} from "lucide-react";
import {
  CAMPAIGN_OBJECTIVES,
  COUNTRIES,
  CALL_TO_ACTIONS,
} from "@/utils/constants";
import { formatCurrency } from "@/lib/utils";

interface ReviewStepProps {
  metaAccounts: any[];
  errors: any;
}

export default function ReviewStep({ metaAccounts, errors }: ReviewStepProps) {
  const { watch } = useFormContext();

  const formData = watch();
  const selectedAccount = metaAccounts.find(
    (acc) => acc.id === formData.metaAccountId
  );
  const selectedObjective = CAMPAIGN_OBJECTIVES.find(
    (obj) => obj.value === formData.objective
  );
  const selectedCTA = CALL_TO_ACTIONS.find(
    (cta) => cta.value === formData.callToAction
  );
  const selectedCountries = COUNTRIES.filter((country) =>
    formData.targeting?.locations?.includes(country.value)
  );

  const totalBudget =
    formData.budgetType === "DAILY" ? formData.budget * 30 : formData.budget;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5" />
          Review & Launch
        </CardTitle>
        <CardDescription>
          Review your campaign settings before launching
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Campaign Summary */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center">
              <DollarSign className="mr-2 h-4 w-4" />
              Campaign Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Account:</span>
                <span className="font-medium">
                  {selectedAccount?.accountName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name:</span>
                <span className="font-medium">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Objective:</span>
                <Badge variant="secondary">
                  {selectedObjective?.icon} {selectedObjective?.label}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Budget:</span>
                <span className="font-medium">
                  {formatCurrency(formData.budget, selectedAccount?.currency)}
                  {formData.budgetType === "DAILY" ? "/day" : " lifetime"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Monthly:</span>
                <span className="font-medium">
                  {formatCurrency(totalBudget, selectedAccount?.currency)}
                </span>
              </div>
            </div>
          </div>

          {/* Targeting */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center">
              <Users className="mr-2 h-4 w-4" />
              Targeting
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Age:</span>
                <span className="font-medium">
                  {formData.targeting?.ageMin} - {formData.targeting?.ageMax}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Gender:</span>
                <span className="font-medium">
                  {formData.targeting?.genders?.[0] === "all"
                    ? "All Genders"
                    : formData.targeting?.genders?.[0] === "1"
                    ? "Men"
                    : "Women"}
                </span>
              </div>
              <div>
                <div className="text-muted-foreground mb-1">Locations:</div>
                <div className="flex flex-wrap gap-1">
                  {selectedCountries.map((country) => (
                    <Badge
                      key={country.value}
                      variant="outline"
                      className="text-xs"
                    >
                      {country.label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ad Creative */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center">
            <Palette className="mr-2 h-4 w-4" />
            Ad Creative
          </h3>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Ad Details */}
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Ad Name:</span>
                <span className="font-medium">{formData.adName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Headline:</span>
                <span className="font-medium">{formData.headline}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Call to Action:</span>
                <Badge variant="secondary">{selectedCTA?.label}</Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Destination:</span>
                <span className="font-medium text-xs break-all">
                  {formData.destinationUrl}
                </span>
              </div>
            </div>

            {/* Ad Preview */}
            <div className="border rounded-lg p-3 bg-white shadow-sm">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-bold">YB</span>
                </div>
                <div>
                  <div className="font-medium text-xs">Your Business</div>
                  <div className="text-xs text-gray-500">Sponsored</div>
                </div>
              </div>

              {formData.imageUrl && (
                <img
                  src={formData.imageUrl}
                  alt="Ad preview"
                  className="w-full rounded mb-2"
                />
              )}

              <div className="space-y-1">
                <h4 className="font-semibold text-sm leading-tight">
                  {formData.headline}
                </h4>
                <p className="text-xs text-gray-700">{formData.adText}</p>
                {formData.description && (
                  <p className="text-xs text-gray-600">
                    {formData.description}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Placements */}
        <div className="space-y-4">
          <h3 className="font-semibold flex items-center">
            <Eye className="mr-2 h-4 w-4" />
            Ad Placements
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.placements?.map((placement: string) => (
              <Badge key={placement} variant="outline">
                {placement
                  .replace("_", " ")
                  .replace(/\b\w/g, (l: string) => l.toUpperCase())}
              </Badge>
            ))}
          </div>
        </div>

        <Separator />

        {/* Launch Information */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
          <h4 className="font-semibold mb-2 flex items-center">
            <CheckCircle className="mr-2 h-4 w-4 text-blue-600" />
            Ready to Launch
          </h4>
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>
              • Your campaign will be submitted for review (usually takes 15-30
              minutes)
            </p>
            <p>
              • Once approved, ads will start showing to your target audience
            </p>
            <p>• You can monitor performance and make adjustments anytime</p>
            <p>• Billing will begin once your ads start running</p>
          </div>
        </div>

        {/* Errors Display */}
        {Object.keys(errors).length > 0 && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 rounded-lg p-4">
            <h4 className="font-semibold mb-2 text-red-700">
              Please fix the following errors:
            </h4>
            <ul className="text-sm text-red-600 space-y-1">
              {Object.entries(errors).map(([field, error]: [string, any]) => (
                <li key={field}>• {error.message}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
