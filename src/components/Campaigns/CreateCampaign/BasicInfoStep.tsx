("use client");

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Target } from "lucide-react";
import { CAMPAIGN_OBJECTIVES } from "@/utils/constants";
import { MetaAccount } from "@/types/auth";

interface BasicInfoStepProps {
  metaAccounts: MetaAccount[];
  errors: any;
}

export default function BasicInfoStep({
  metaAccounts,
  errors,
}: BasicInfoStepProps) {
  const { register, setValue, watch } = useFormContext();
  const selectedObjective = watch("objective");

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Campaign Basics
        </CardTitle>
        <CardDescription>
          Set up the fundamental information for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Meta Account Selection */}
        <div className="space-y-2">
          <Label htmlFor="metaAccountId">Meta Account *</Label>
          <Select onValueChange={(value) => setValue("metaAccountId", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your Meta advertising account" />
            </SelectTrigger>
            <SelectContent>
              {metaAccounts.map((account) => (
                <SelectItem key={account.id} value={account.id}>
                  <div className="flex items-center justify-between w-full">
                    <span>{account.accountName}</span>
                    <span className="text-muted-foreground ml-2">
                      ({account.currency})
                    </span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.metaAccountId && (
            <p className="text-sm text-destructive">
              {errors.metaAccountId.message}
            </p>
          )}
        </div>

        {/* Campaign Name */}
        <div className="space-y-2">
          <Label htmlFor="name">Campaign Name *</Label>
          <Input
            {...register("name")}
            placeholder="e.g., Summer Sale 2024, Brand Awareness Q1"
            className="max-w-lg"
          />
          {errors.name && (
            <p className="text-sm text-destructive">{errors.name.message}</p>
          )}
          <p className="text-sm text-muted-foreground">
            Choose a descriptive name that helps you identify this campaign
            later
          </p>
        </div>

        {/* Campaign Objective */}
        <div className="space-y-4">
          <Label>Campaign Objective *</Label>
          <RadioGroup
            value={selectedObjective}
            onValueChange={(value: any) => setValue("objective", value)}
            className="grid gap-4 sm:grid-cols-2"
          >
            {CAMPAIGN_OBJECTIVES.map((objective: any) => (
              <div
                key={objective.value}
                className="flex items-center space-x-2"
              >
                <RadioGroupItem value={objective.value} id={objective.value} />
                <Label
                  htmlFor={objective.value}
                  className="flex-1 cursor-pointer border rounded-lg p-4 hover:bg-accent transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{objective.icon}</span>
                    <div>
                      <div className="font-medium">{objective.label}</div>
                      <div className="text-sm text-muted-foreground">
                        {objective.description}
                      </div>
                    </div>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
          {errors.objective && (
            <p className="text-sm text-destructive">
              {errors.objective.message}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
