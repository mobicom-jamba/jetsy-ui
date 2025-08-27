// client/src/components/Campaigns/CreateCampaign/BudgetScheduleStep.tsx
"use client";

import { useState } from "react";
import { useFormContext } from "react-hook-form";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, DollarSign, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { BUDGET_TYPES } from "@/utils/constants";

interface BudgetScheduleStepProps {
  errors: any;
}

export default function BudgetScheduleStep({
  errors,
}: BudgetScheduleStepProps) {
  const { register, setValue, watch } = useFormContext();
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();

  const budgetType = watch("budgetType");
  const budget = watch("budget");

  const handleStartDateChange = (date: Date | undefined) => {
    setStartDate(date);
    setValue("startTime", date);
  };

  const handleEndDateChange = (date: Date | undefined) => {
    setEndDate(date);
    setValue("endTime", date);
  };

  const estimatedReach = budget ? Math.floor(budget * 1000) : 0;
  const estimatedImpressions = budget ? Math.floor(budget * 1500) : 0;

  return (
    <div className="space-y-6">
      {/* Budget Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <DollarSign className="mr-2 h-5 w-5" />
            Budget Configuration
          </CardTitle>
          <CardDescription>
            Set your campaign budget and spending strategy
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Budget Type */}
          <div className="space-y-4">
            <Label>Budget Type *</Label>
            <RadioGroup
              value={budgetType}
              onValueChange={(value: any) => setValue("budgetType", value)}
            >
              {BUDGET_TYPES.map((type: any) => (
                <div key={type.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={type.value} id={type.value} />
                  <Label
                    htmlFor={type.value}
                    className="flex-1 cursor-pointer border rounded-lg p-4 hover:bg-accent transition-colors"
                  >
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-muted-foreground">
                      {type.description}
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>

          {/* Budget Amount */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="budget">
                {budgetType === "DAILY" ? "Daily Budget" : "Lifetime Budget"} *
              </Label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  {...register("budget", { valueAsNumber: true })}
                  type="number"
                  placeholder="0.00"
                  step="0.01"
                  min="1"
                  className="pl-10"
                />
              </div>
              {errors.budget && (
                <p className="text-sm text-destructive">
                  {errors.budget.message}
                </p>
              )}
              <p className="text-sm text-muted-foreground">
                Minimum: $1.00 | Recommended: $10+ per day
              </p>
            </div>

            {/* Estimated Performance */}
            {budget && (
              <div className="space-y-2">
                <Label>Estimated Performance</Label>
                <div className="border rounded-lg p-4 bg-muted/50">
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Estimated Reach:</span>
                      <span className="font-medium">
                        {estimatedReach.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Estimated Impressions:</span>
                      <span className="font-medium">
                        {estimatedImpressions.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Est. Cost per Click:</span>
                      <span className="font-medium">$0.50 - $2.00</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Schedule Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2 h-5 w-5" />
            Schedule
          </CardTitle>
          <CardDescription>
            Choose when your campaign should run
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            {/* Start Date */}
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
                    {startDate ? format(startDate, "PPP") : "Start immediately"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={handleStartDateChange}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
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
                    {endDate ? format(endDate, "PPP") : "Run continuously"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={handleEndDateChange}
                    disabled={(date) =>
                      startDate ? date <= startDate : date < new Date()
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Schedule Summary */}
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-2">Campaign Schedule Summary</h4>
            <div className="text-sm space-y-1">
              <div>
                <span className="text-muted-foreground">Start: </span>
                {startDate
                  ? format(startDate, "PPP")
                  : "Immediately when approved"}
              </div>
              <div>
                <span className="text-muted-foreground">End: </span>
                {endDate
                  ? format(endDate, "PPP")
                  : "Run until paused or budget spent"}
              </div>
              <div>
                <span className="text-muted-foreground">Duration: </span>
                {startDate && endDate
                  ? `${Math.ceil(
                      (endDate.getTime() - startDate.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )} days`
                  : "Ongoing"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
