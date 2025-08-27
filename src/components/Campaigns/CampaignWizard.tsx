"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateCampaign } from "@/hooks/useCampaigns";
import { useMetaAccounts } from "@/hooks/useAccounts";
import { CreateCampaignData } from "@/types/campaign";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  CalendarIcon,
  Loader2,
  ArrowRight,
  ArrowLeft,
  Target,
  DollarSign,
  Settings,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CAMPAIGN_OBJECTIVES, BUDGET_TYPES } from "@/utils/constants";

export default function CampaignWizard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const router = useRouter();
  const createCampaign = useCreateCampaign();
  const { data: metaAccounts } = useMetaAccounts();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<CreateCampaignData>();

  const totalSteps = 3;
  const progress = (currentStep / totalSteps) * 100;

  const onSubmit = async (data: CreateCampaignData) => {
    try {
      const campaignData: any = {
        ...data,
        startTime: startDate?.toISOString(),
        endTime: endDate?.toISOString(),
      };

      const result = await createCampaign.mutateAsync(campaignData);
      router.push(`/campaigns/${result.campaign.id}`);
    } catch (error) {
      console.error("Failed to create campaign:", error);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Tabs value={currentStep.toString()} className="space-y-6">
          {/* Step 1: Basic Information */}
          <TabsContent value="1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Target className="mr-2 h-5 w-5" />
                  Campaign Basics
                </CardTitle>
                <CardDescription>
                  Set up the basic information for your campaign
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="metaAccountId">Meta Account</Label>
                  <Select
                    onValueChange={(value) => setValue("metaAccountId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your Meta account" />
                    </SelectTrigger>
                    <SelectContent>
                      {metaAccounts?.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.accountName} ({account.currency})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="name">Campaign Name</Label>
                  <Input
                    {...register("name", {
                      required: "Campaign name is required",
                    })}
                    placeholder="Enter campaign name"
                  />
                  {errors.name && (
                    <p className="text-sm text-destructive">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="objective">Campaign Objective</Label>
                  <Select
                    onValueChange={(value) =>
                      setValue("objective", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign objective" />
                    </SelectTrigger>
                    <SelectContent>
                      {CAMPAIGN_OBJECTIVES.map((objective) => (
                        <SelectItem
                          key={objective.value}
                          value={objective.value}
                        >
                          {objective.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 2: Budget & Schedule */}
          <TabsContent value="2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Budget & Schedule
                </CardTitle>
                <CardDescription>
                  Configure your campaign budget and schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="budgetType">Budget Type</Label>
                    <Select
                      onValueChange={(value) =>
                        setValue("budgetType", value as any)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select budget type" />
                      </SelectTrigger>
                      <SelectContent>
                        {BUDGET_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget Amount</Label>
                    <Input
                      {...register("budget", {
                        required: "Budget is required",
                        min: {
                          value: 1,
                          message: "Budget must be at least $1",
                        },
                      })}
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                    />
                    {errors.budget && (
                      <p className="text-sm text-destructive">
                        {errors.budget.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !startDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {startDate ? format(startDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={startDate}
                          onSelect={setStartDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label>End Date (Optional)</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !endDate && "text-muted-foreground"
                          )}
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {endDate ? format(endDate, "PPP") : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={endDate}
                          onSelect={setEndDate}
                          initialFocus
                          disabled={(date) =>
                            startDate ? date < startDate : false
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Step 3: Review */}
          <TabsContent value="3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Settings className="mr-2 h-5 w-5" />
                  Review & Launch
                </CardTitle>
                <CardDescription>
                  Review your campaign settings before launching
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Campaign Name
                      </Label>
                      <p className="font-medium">
                        {watch("name") || "Not set"}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Objective
                      </Label>
                      <p className="font-medium">
                        {CAMPAIGN_OBJECTIVES.find(
                          (obj) => obj.value === watch("objective")
                        )?.label || "Not set"}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Budget
                      </Label>
                      <p className="font-medium">
                        ${watch("budget") || "0"} (
                        {BUDGET_TYPES.find(
                          (type) => type.value === watch("budgetType")
                        )?.label || "Daily"}
                        )
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm text-muted-foreground">
                        Schedule
                      </Label>
                      <p className="font-medium">
                        {startDate
                          ? format(startDate, "MMM dd, yyyy")
                          : "Immediately"}{" "}
                        -{" "}
                        {endDate ? format(endDate, "MMM dd, yyyy") : "Ongoing"}
                      </p>
                    </div>
                  </div>
                </div>

                {createCampaign.error && (
                  <Alert variant="destructive">
                    <AlertDescription>
                      Failed to create campaign. Please try again.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Navigation */}
        <div className="flex justify-between">
          <Button
            type="button"
            variant="outline"
            onClick={prevStep}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>

          <div className="space-x-2">
            {currentStep < totalSteps ? (
              <Button type="button" onClick={nextStep}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={createCampaign.isPending}
                size="lg"
              >
                {createCampaign.isPending && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Launch Campaign
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
