"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { MetaAccount } from "@/types/auth";
import api from "@/lib/api";
import { useAuth } from "./useAuthContext";

export const useMetaAccounts = () => {
  const { user } = useAuth();

  return useQuery({
    queryKey: ["meta-accounts", user?.id],
    queryFn: async () => {
      const { data } = await api.get("/accounts");
      // normalize shape: allow [] or { accounts: [] }
      const list = Array.isArray(data) ? data : data?.accounts;
      return (list ?? []) as MetaAccount[];
    },
    enabled: !!user, // only fetch when we have a user
    staleTime: 0, // always considered stale
    gcTime: 5 * 60 * 1000,
    refetchOnMount: "always", // 👈 force refetch after nav
    refetchOnWindowFocus: true,
    refetchOnReconnect: true,
  });
};

export const useConnectMetaAccount = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const { data } = await api.get("/auth/meta/connect");
      if (typeof window !== "undefined") {
        localStorage.setItem("metaConnectInProgress", "1");
      }
      window.location.href = data.authUrl;
      return data;
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
