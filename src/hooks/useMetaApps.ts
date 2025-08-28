// client/src/hooks/useMetaApps.ts (NEW HOOK)
'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { MetaApp, CreateMetaAppData } from '@/types/auth'
import api from '@/lib/api'

export const useMetaApps = () => {
  return useQuery({
    queryKey: ['meta-apps'],
    queryFn: async () => {
      const response = await api.get('/meta-apps')
      return response.data.metaApps as MetaApp[]
    }
  })
}

export const useMetaApp = (id: string) => {
  return useQuery({
    queryKey: ['meta-app', id],
    queryFn: async () => {
      const response = await api.get(`/meta-apps/${id}`)
      return response.data.metaApp as MetaApp
    },
    enabled: !!id
  })
}

export const useCreateMetaApp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (data: CreateMetaAppData) => {
      const response = await api.post('/meta-apps', data)
      return response.data.metaApp
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-apps'] })
      queryClient.invalidateQueries({ queryKey: ['auth-user'] })
    }
  })
}

export const useUpdateMetaApp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CreateMetaAppData> }) => {
      const response = await api.put(`/meta-apps/${id}`, data)
      return response.data.metaApp
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-apps'] })
    }
  })
}

export const useDeleteMetaApp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      await api.delete(`/meta-apps/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-apps'] })
      queryClient.invalidateQueries({ queryKey: ['meta-accounts'] })
    }
  })
}

export const useVerifyMetaApp = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.post(`/meta-apps/${id}/verify`)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meta-apps'] })
    }
  })
}
