"use client";

import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
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
import { Palette, Image, Eye, Upload } from "lucide-react";
import { AD_PLACEMENTS } from "@/utils/constants";

const CALL_TO_ACTIONS = [
  { value: "LEARN_MORE", label: "Learn More" },
  { value: "SHOP_NOW", label: "Shop Now" },
  { value: "SIGN_UP", label: "Sign Up" },
  { value: "DOWNLOAD", label: "Download" },
  { value: "GET_QUOTE", label: "Get Quote" },
  { value: "CONTACT_US", label: "Contact Us" },
  { value: "BOOK_TRAVEL", label: "Book Now" },
  { value: "WATCH_MORE", label: "Watch Video" },
];

interface CreativeStepProps {
  errors: any;
}

export default function CreativeStep({ errors }: CreativeStepProps) {
  const { register, setValue, watch } = useFormContext();
  const [imagePreview, setImagePreview] = useState<string>("");

  const placements = watch("placements") || [];
  const adText = watch("adText") || "";
  const headline = watch("headline") || "";
  const description = watch("description") || "";

  const handlePlacementToggle = (placement: string, checked: boolean) => {
    const newPlacements = checked
      ? [...placements, placement]
      : placements.filter((p: string) => p !== placement);

    setValue("placements", newPlacements);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        setValue("imageUrl", result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      {/* Placements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="mr-2 h-5 w-5" />
            Ad Placements
          </CardTitle>
          <CardDescription>Choose where your ads will appear</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 sm:grid-cols-2">
            {AD_PLACEMENTS.map((placement) => (
              <div
                key={placement.value}
                className="flex items-center space-x-2"
              >
                <Checkbox
                  id={placement.value}
                  checked={placements.includes(placement.value)}
                  onCheckedChange={(checked) =>
                    handlePlacementToggle(placement.value, !!checked)
                  }
                />
                <Label
                  htmlFor={placement.value}
                  className="text-sm cursor-pointer flex-1"
                >
                  {placement.label}
                </Label>
              </div>
            ))}
          </div>

          {placements.length > 0 && (
            <div className="space-y-2">
              <Label>Selected Placements ({placements.length})</Label>
              <div className="flex flex-wrap gap-2">
                {placements.map((placement: string) => {
                  const placementData = AD_PLACEMENTS.find(
                    (p) => p.value === placement
                  );
                  return (
                    <Badge key={placement} variant="secondary">
                      {placementData?.label}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {errors.placements && (
            <p className="text-sm text-destructive">
              {errors.placements.message}
            </p>
          )}
        </CardContent>
      </Card>

      {/* Creative Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Palette className="mr-2 h-5 w-5" />
            Ad Creative
          </CardTitle>
          <CardDescription>
            Create compelling ad content that drives results
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Ad Image */}
          <div className="space-y-4">
            <Label>Ad Image</Label>
            <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
              {imagePreview ? (
                <div className="space-y-4">
                  <img
                    src={imagePreview}
                    alt="Ad preview"
                    className="mx-auto max-h-64 rounded-lg shadow-md"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setImagePreview("")}
                  >
                    Remove Image
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Image className="mx-auto h-12 w-12 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">Upload an image</h3>
                    <p className="text-sm text-muted-foreground">
                      Recommended: 1200 x 628 pixels, JPG or PNG, max 5MB
                    </p>
                  </div>
                  <div>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                      id="image-upload"
                    />
                    <Label htmlFor="image-upload">
                      <Button type="button" variant="outline" asChild>
                        <span>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose Image
                        </span>
                      </Button>
                    </Label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Ad Details */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-4">
              {/* Ad Name */}
              <div className="space-y-2">
                <Label htmlFor="adName">Ad Name *</Label>
                <Input
                  {...register("adName")}
                  placeholder="Internal name for this ad"
                />
                {errors.adName && (
                  <p className="text-sm text-destructive">
                    {errors.adName.message}
                  </p>
                )}
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <Label htmlFor="headline">Headline *</Label>
                <Input
                  {...register("headline")}
                  placeholder="Eye-catching headline"
                  maxLength={40}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>This appears prominently in your ad</span>
                  <span>{headline.length}/40</span>
                </div>
                {errors.headline && (
                  <p className="text-sm text-destructive">
                    {errors.headline.message}
                  </p>
                )}
              </div>

              {/* Call to Action */}
              <div className="space-y-2">
                <Label htmlFor="callToAction">Call to Action *</Label>
                <Select
                  onValueChange={(value) => setValue("callToAction", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose action" />
                  </SelectTrigger>
                  <SelectContent>
                    {CALL_TO_ACTIONS.map((cta) => (
                      <SelectItem key={cta.value} value={cta.value}>
                        {cta.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.callToAction && (
                  <p className="text-sm text-destructive">
                    {errors.callToAction.message}
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              {/* Ad Text */}
              <div className="space-y-2">
                <Label htmlFor="adText">Ad Text *</Label>
                <Textarea
                  {...register("adText")}
                  placeholder="Compelling description of your offer..."
                  className="min-h-24"
                  maxLength={125}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Main body text of your ad</span>
                  <span>{adText.length}/125</span>
                </div>
                {errors.adText && (
                  <p className="text-sm text-destructive">
                    {errors.adText.message}
                  </p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  {...register("description")}
                  placeholder="Additional details..."
                  className="min-h-16"
                  maxLength={30}
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Appears below the headline</span>
                  <span>{description.length}/30</span>
                </div>
              </div>

              {/* Destination URL */}
              <div className="space-y-2">
                <Label htmlFor="destinationUrl">Destination URL *</Label>
                <Input
                  {...register("destinationUrl")}
                  type="url"
                  placeholder="https://example.com"
                />
                {errors.destinationUrl && (
                  <p className="text-sm text-destructive">
                    {errors.destinationUrl.message}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Where people will go when they click your ad
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ad Preview */}
      <Card>
        <CardHeader>
          <CardTitle>Ad Preview</CardTitle>
          <CardDescription>
            See how your ad will look on Facebook and Instagram
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-lg p-4 bg-white shadow-sm max-w-md">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white text-xs font-bold">YB</span>
              </div>
              <div>
                <div className="font-medium text-sm">Your Business</div>
                <div className="text-xs text-gray-500">Sponsored</div>
              </div>
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="Ad preview"
                className="w-full rounded mb-3"
              />
            )}

            <div className="space-y-2">
              {headline && (
                <h3 className="font-semibold text-lg leading-tight">
                  {headline}
                </h3>
              )}
              {adText && <p className="text-sm text-gray-700">{adText}</p>}
              {description && (
                <p className="text-sm text-gray-600">{description}</p>
              )}

              <div className="pt-2">
                <Button size="sm" className="w-full">
                  {CALL_TO_ACTIONS.find(
                    (cta) => cta.value === watch("callToAction")
                  )?.label || "Learn More"}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
