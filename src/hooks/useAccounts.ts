"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetaAccount } from "@/types/auth";
import api from "@/lib/api";

export const useMetaAccounts = () => {
  return useQuery({
    queryKey: ["meta-accounts"],
    queryFn: async () => {
      const response = await api.get("/accounts");
      return response.data.accounts as MetaAccount[];
    },
  });
};

export const useConnectMetaAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const response = await api.get("/auth/meta/connect");
      window.location.href = response.data.authUrl;
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-accounts"] });
    },
  });
};

export const useDisconnectAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await api.delete(`/accounts/${accountId}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-accounts"] });
      queryClient.invalidateQueries({ queryKey: ["campaigns"] });
    },
    onError: (error: any) => {
      console.error("Failed to disconnect account:", error);
      throw new Error(
        error.response?.data?.error || "Failed to disconnect account"
      );
    },
  });
};

export const useSyncAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (accountId: string) => {
      const response = await api.post(`/accounts/${accountId}/sync`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meta-accounts"] });
    },
  });
};
