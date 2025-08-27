"use client";

import { useFormContext } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Users,
  MapPin,
  Heart,
  ChevronDown,
  Target,
  Globe,
  Briefcase,
  BookOpen,
} from "lucide-react";
import { useState } from "react";

interface TargetingStepProps {
  errors: any;
}

const AGE_OPTIONS = Array.from({ length: 48 }, (_, i) => i + 18);

const GENDER_OPTIONS = [
  { value: "all", label: "All genders" },
  { value: "male", label: "Men" },
  { value: "female", label: "Women" },
];

const COUNTRIES = [
  { code: "US", name: "United States", flag: "🇺🇸" },
  { code: "CA", name: "Canada", flag: "🇨🇦" },
  { code: "GB", name: "United Kingdom", flag: "🇬🇧" },
  { code: "AU", name: "Australia", flag: "🇦🇺" },
  { code: "DE", name: "Germany", flag: "🇩🇪" },
  { code: "FR", name: "France", flag: "🇫🇷" },
  { code: "IT", name: "Italy", flag: "🇮🇹" },
  { code: "ES", name: "Spain", flag: "🇪🇸" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱" },
  { code: "BR", name: "Brazil", flag: "🇧🇷" },
  { code: "MX", name: "Mexico", flag: "🇲🇽" },
  { code: "IN", name: "India", flag: "🇮🇳" },
  { code: "SG", name: "Singapore", flag: "🇸🇬" },
  { code: "JP", name: "Japan", flag: "🇯🇵" },
];

const INTERESTS = [
  { id: "6003397425735", name: "Business and Industry" },
  { id: "6003020834693", name: "Technology" },
  { id: "6003139266461", name: "Food and Drink" },
  { id: "6003348108016", name: "Fitness and Wellness" },
  { id: "6003195833498", name: "Travel" },
  { id: "6003445422113", name: "Fashion" },
  { id: "6003659143595", name: "Sports" },
  { id: "6003286120153", name: "Entertainment" },
  { id: "6003520743025", name: "Education" },
  { id: "6003394918152", name: "Family and Relationships" },
];

const BEHAVIORS = [
  { id: "6004037958583", name: "Digital activities" },
  { id: "6002714895372", name: "Mobile device user" },
  { id: "6015559470583", name: "Frequent travelers" },
  { id: "6017253486583", name: "Online shoppers" },
  { id: "6003808923983", name: "Small business owners" },
];

export default function TargetingStep() {
  const { setValue, watch } = useFormContext();
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);

  const targeting = watch("targeting") || {};
  const {
    ageMin = 18,
    ageMax = 65,
    genders = ["all"],
    locations = ["US"],
    interests = [],
    behaviors = [],
  } = targeting;

  const handleLocationToggle = (countryCode: string, checked: boolean) => {
    const newLocations = checked
      ? [...locations, countryCode]
      : locations.filter((loc: string) => loc !== countryCode);

    setValue("targeting.locations", newLocations);
  };

  const handleGenderChange = (value: string) => {
    setValue("targeting.genders", [value]);
  };

  const handleInterestToggle = (interestId: string, checked: boolean) => {
    const newInterests = checked
      ? [...interests, interestId]
      : interests.filter((id: string) => id !== interestId);

    setValue("targeting.interests", newInterests);
  };

  const handleBehaviorToggle = (behaviorId: string, checked: boolean) => {
    const newBehaviors = checked
      ? [...behaviors, behaviorId]
      : behaviors.filter((id: string) => id !== behaviorId);

    setValue("targeting.behaviors", newBehaviors);
  };

  // Calculate estimated audience size
  const estimatedAudience = Math.floor(
    locations.length *
      1000000 *
      ((ageMax - ageMin) / 52) *
      (genders.includes("all") ? 1 : 0.5) *
      (interests.length > 0 ? 0.3 : 1) *
      (behaviors.length > 0 ? 0.2 : 1)
  );

  const formatAudienceSize = (size: number) => {
    if (size >= 1000000) {
      return `${(size / 1000000).toFixed(1)}M`;
    } else if (size >= 1000) {
      return `${(size / 1000).toFixed(0)}K`;
    }
    return size.toString();
  };

  return (
    <div className="space-y-6">
      {/* Audience Size Estimate */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">
                  Estimated Audience Size
                </p>
                <p className="text-2xl font-bold text-primary">
                  {formatAudienceSize(estimatedAudience)}
                </p>
              </div>
            </div>
            <Badge variant="secondary">{locations.length} location(s)</Badge>
          </div>
        </CardContent>
      </Card>

      {/* Demographics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5" />
            Demographics
          </CardTitle>
          <CardDescription>
            Define your target audience demographics
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Age Range */}
          <div className="space-y-4">
            <Label>Age Range</Label>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="ageMin"
                  className="text-sm text-muted-foreground"
                >
                  Minimum Age
                </Label>
                <Select
                  value={ageMin.toString()}
                  onValueChange={(value) =>
                    setValue("targeting.ageMin", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_OPTIONS.map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="ageMax"
                  className="text-sm text-muted-foreground"
                >
                  Maximum Age
                </Label>
                <Select
                  value={ageMax.toString()}
                  onValueChange={(value) =>
                    setValue("targeting.ageMax", parseInt(value))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AGE_OPTIONS.filter((age) => age >= ageMin).map((age) => (
                      <SelectItem key={age} value={age.toString()}>
                        {age}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Gender */}
          <div className="space-y-4">
            <Label>Gender</Label>
            <Select value={genders[0]} onValueChange={handleGenderChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {GENDER_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Locations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <MapPin className="mr-2 h-5 w-5" />
            Locations
          </CardTitle>
          <CardDescription>Select countries to target your ads</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {COUNTRIES.map((country) => (
              <div
                key={country.code}
                className="flex items-center space-x-3 p-2 rounded-lg border"
              >
                <Checkbox
                  id={`country-${country.code}`}
                  checked={locations.includes(country.code)}
                  onCheckedChange={(checked) =>
                    handleLocationToggle(country.code, !!checked)
                  }
                />
                <Label
                  htmlFor={`country-${country.code}`}
                  className="flex items-center space-x-2 cursor-pointer flex-1"
                >
                  <span className="text-lg">{country.flag}</span>
                  <span className="text-sm">{country.name}</span>
                </Label>
              </div>
            ))}
          </div>

          {locations.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {locations.map((code: any) => {
                const country = COUNTRIES.find((c) => c.code === code);
                return country ? (
                  <Badge key={code} variant="secondary">
                    {country.flag} {country.name}
                  </Badge>
                ) : null;
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Advanced Targeting */}
      <Collapsible open={isAdvancedOpen} onOpenChange={setIsAdvancedOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="outline" className="w-full">
            <Target className="mr-2 h-4 w-4" />
            Advanced Targeting Options
            <ChevronDown className="ml-2 h-4 w-4" />
          </Button>
        </CollapsibleTrigger>

        <CollapsibleContent className="space-y-6 mt-6">
          {/* Interests */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Heart className="mr-2 h-5 w-5" />
                Interests
              </CardTitle>
              <CardDescription>
                Target people based on their interests and activities
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {INTERESTS.map((interest) => (
                  <div
                    key={interest.id}
                    className="flex items-center space-x-3 p-2 rounded-lg border"
                  >
                    <Checkbox
                      id={`interest-${interest.id}`}
                      checked={interests.includes(interest.id)}
                      onCheckedChange={(checked) =>
                        handleInterestToggle(interest.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`interest-${interest.id}`}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {interest.name}
                    </Label>
                  </div>
                ))}
              </div>

              {interests.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {interests.map((id: any) => {
                    const interest = INTERESTS.find((i) => i.id === id);
                    return interest ? (
                      <Badge key={id} variant="outline">
                        {interest.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Behaviors */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Briefcase className="mr-2 h-5 w-5" />
                Behaviors
              </CardTitle>
              <CardDescription>
                Target people based on their purchase behavior and device usage
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-4">
                {BEHAVIORS.map((behavior) => (
                  <div
                    key={behavior.id}
                    className="flex items-center space-x-3 p-2 rounded-lg border"
                  >
                    <Checkbox
                      id={`behavior-${behavior.id}`}
                      checked={behaviors.includes(behavior.id)}
                      onCheckedChange={(checked) =>
                        handleBehaviorToggle(behavior.id, !!checked)
                      }
                    />
                    <Label
                      htmlFor={`behavior-${behavior.id}`}
                      className="cursor-pointer flex-1 text-sm"
                    >
                      {behavior.name}
                    </Label>
                  </div>
                ))}
              </div>

              {behaviors.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {behaviors.map((id: any) => {
                    const behavior = BEHAVIORS.find((b) => b.id === id);
                    return behavior ? (
                      <Badge key={id} variant="outline">
                        {behavior.name}
                      </Badge>
                    ) : null;
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Custom Audiences */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Custom Audiences
              </CardTitle>
              <CardDescription>
                Target custom audiences from your existing customer data
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-muted-foreground">
                <Globe className="mx-auto h-12 w-12 mb-4 opacity-50" />
                <p>
                  Custom audiences will be available after connecting your Meta
                  account
                </p>
                <p className="text-sm">
                  Upload customer lists, website visitors, and lookalike
                  audiences
                </p>
              </div>
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {/* Targeting Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Targeting Summary</CardTitle>
          <CardDescription>
            Review your audience targeting settings
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm text-muted-foreground">Age Range</Label>
              <p className="font-medium">
                {ageMin} - {ageMax} years old
              </p>
            </div>
            <div>
              <Label className="text-sm text-muted-foreground">Gender</Label>
              <p className="font-medium">
                {GENDER_OPTIONS.find((g) => g.value === genders[0])?.label}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <Label className="text-sm text-muted-foreground">
              Locations ({locations.length})
            </Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {locations.slice(0, 3).map((code: any) => {
                const country = COUNTRIES.find((c) => c.code === code);
                return country ? (
                  <Badge key={code} variant="secondary" className="text-xs">
                    {country.flag} {country.name}
                  </Badge>
                ) : null;
              })}
              {locations.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{locations.length - 3} more
                </Badge>
              )}
            </div>
          </div>

          {(interests.length > 0 || behaviors.length > 0) && (
            <>
              <Separator />
              <div className="space-y-2">
                {interests.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Interests ({interests.length})
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {interests.slice(0, 2).map((id: any) => {
                        const interest = INTERESTS.find((i) => i.id === id);
                        return interest ? (
                          <Badge key={id} variant="outline" className="text-xs">
                            {interest.name}
                          </Badge>
                        ) : null;
                      })}
                      {interests.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{interests.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {behaviors.length > 0 && (
                  <div>
                    <Label className="text-sm text-muted-foreground">
                      Behaviors ({behaviors.length})
                    </Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {behaviors.slice(0, 2).map((id: any) => {
                        const behavior = BEHAVIORS.find((b) => b.id === id);
                        return behavior ? (
                          <Badge key={id} variant="outline" className="text-xs">
                            {behavior.name}
                          </Badge>
                        ) : null;
                      })}
                      {behaviors.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{behaviors.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
