"use client";

import { useState } from "react";
import { Campaign } from "@/types/campaign";
import { useUpdateCampaignStatus } from "@/hooks/useCampaigns";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Play, Pause, Trash2, Archive, Loader2, X } from "lucide-react";
import { toast } from "sonner";

interface BulkActionsProps {
  selectedCampaigns: Campaign[];
  onClearSelection: () => void;
  onActionComplete: () => void;
}

const BULK_ACTIONS = [
  {
    value: "ACTIVE",
    label: "Activate",
    icon: Play,
    variant: "default" as const,
    description: "Start running selected campaigns",
  },
  {
    value: "PAUSED",
    label: "Pause",
    icon: Pause,
    variant: "secondary" as const,
    description: "Temporarily stop selected campaigns",
  },
  {
    value: "ARCHIVED",
    label: "Archive",
    icon: Archive,
    variant: "outline" as const,
    description: "Archive selected campaigns",
  },
  {
    value: "DELETED",
    label: "Delete",
    icon: Trash2,
    variant: "destructive" as const,
    description: "Permanently delete selected campaigns",
  },
];

export default function BulkActions({
  selectedCampaigns,
  onClearSelection,
  onActionComplete,
}: BulkActionsProps) {
  const [selectedAction, setSelectedAction] = useState("");
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const updateCampaignStatus = useUpdateCampaignStatus();

  if (selectedCampaigns.length === 0) {
    return null;
  }

  const handleActionSelect = (action: string) => {
    setSelectedAction(action);
    setShowConfirmDialog(true);
  };

  const executeBulkAction = async () => {
    setIsProcessing(true);

    try {
      const promises = selectedCampaigns.map((campaign) =>
        updateCampaignStatus.mutateAsync({
          id: campaign.id,
          status: selectedAction,
        })
      );

      await Promise.all(promises);

      const actionLabel = BULK_ACTIONS.find(
        (a) => a.value === selectedAction
      )?.label.toLowerCase();

      toast.success("Bulk action completed", {
        description: `Successfully ${actionLabel}d ${selectedCampaigns.length} campaign(s)`,
      });

      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error("Bulk action failed:", error);
      toast.error("Action failed", {
        description: "Some actions failed. Please try again.",
      });
    } finally {
      setIsProcessing(false);
      setShowConfirmDialog(false);
      setSelectedAction("");
    }
  };

  const selectedActionData = BULK_ACTIONS.find(
    (action) => action.value === selectedAction
  );

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="secondary">
                {selectedCampaigns.length} selected
              </Badge>

              <div className="flex items-center space-x-2">
                {BULK_ACTIONS.map((action) => {
                  const Icon = action.icon;
                  return (
                    <Button
                      key={action.value}
                      size="sm"
                      variant={action.variant}
                      onClick={() => handleActionSelect(action.value)}
                      disabled={isProcessing}
                    >
                      <Icon className="h-4 w-4 mr-1" />
                      {action.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <Button
              size="sm"
              variant="ghost"
              onClick={onClearSelection}
              disabled={isProcessing}
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Bulk {selectedActionData?.label}</DialogTitle>
            <DialogDescription>
              {selectedActionData?.description}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted rounded-lg p-4">
              <h4 className="text-sm font-medium mb-2">
                Campaigns to be {selectedActionData?.label.toLowerCase()}d:
              </h4>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {selectedCampaigns.slice(0, 5).map((campaign) => (
                  <div
                    key={campaign.id}
                    className="text-sm text-muted-foreground"
                  >
                    • {campaign.name}
                  </div>
                ))}
                {selectedCampaigns.length > 5 && (
                  <div className="text-sm text-muted-foreground">
                    ... and {selectedCampaigns.length - 5} more
                  </div>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isProcessing}
            >
              Cancel
            </Button>
            <Button
              variant={selectedActionData?.variant}
              onClick={executeBulkAction}
              disabled={isProcessing}
            >
              {isProcessing && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              {selectedActionData?.label} Campaigns
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
