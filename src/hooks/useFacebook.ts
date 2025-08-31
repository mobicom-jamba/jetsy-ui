// client/src/hooks/useFacebook.ts
"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";

export const useFacebookPages = () => {
  return useQuery({
    queryKey: ["facebook-pages"],
    queryFn: async () => {
      const response = await api.get("/facebook/pages");
      return response.data.pages;
    },
  });
};

export const usePageInsights = (
  pageId: string,
  metrics?: string[],
  period?: string
) => {
  return useQuery({
    queryKey: ["page-insights", pageId, metrics, period],
    queryFn: async () => {
      const response = await api.get(`/facebook/pages/${pageId}/insights`, {
        params: {
          metrics: metrics?.join(","),
          period,
        },
      });
      return response.data.insights;
    },
    enabled: !!pageId,
  });
};

export const useCreatePagePost = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      pageId,
      message,
      imageUrl,
    }: {
      pageId: string;
      message: string;
      imageUrl?: string;
    }) => {
      const response = await api.post(`/facebook/pages/${pageId}/posts`, {
        message,
        imageUrl,
      });
      return response.data.post;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["facebook-pages"] });
    },
  });
};
