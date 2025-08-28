// client/src/components/Settings/ConnectedAccounts.tsx (NEW COMPONENT)
'use client'

import { useState } from 'react'
import { MetaAccount, MetaApp } from '@/types/auth'
import Button from '@/components/Common/Button'
import Select from '@/components/Common/Select'
import Modal from '@/components/Common/Modal'
import { 
  LinkIcon, 
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { formatDate } from '@/lib/utils'
import api from '@/lib/api'

interface ConnectedAccountsProps {
  accounts: MetaAccount[]
  loading: boolean
  metaApps: MetaApp[]
}

export default function ConnectedAccounts({ 
  accounts, 
  loading, 
  metaApps 
}: ConnectedAccountsProps) {
  const [selectedMetaApp, setSelectedMetaApp] = useState('')
  const [isConnecting, setIsConnecting] = useState(false)

  const handleConnectAccount = async () => {
    if (!selectedMetaApp) return

    setIsConnecting(true)
    try {
      const response = await api.get('/auth/meta/connect', {
        params: { metaAppId: selectedMetaApp }
      })
      window.location.href = response.data.authUrl
    } catch (error) {
      console.error('Failed to initiate connection:', error)
      alert('Failed to connect account. Please try again.')
    } finally {
      setIsConnecting(false)
    }
  }

  const handleDisconnect = async (accountId: string) => {
    if (confirm('Are you sure you want to disconnect this account?')) {
      try {
        await api.delete(`/accounts/${accountId}`)
        window.location.reload()
      } catch (error) {
        console.error('Failed to disconnect account:', error)
        alert('Failed to disconnect account. Please try again.')
      }
    }
  }

  const hasVerifiedApps = metaApps.some(app => app.isVerified)

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900">Connected Ad Accounts</h3>
          <p className="text-sm text-gray-500 mt-1">
            Connect your Meta ad accounts to start creating campaigns
          </p>
        </div>
      </div>

      {!hasVerifiedApps ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <ExclamationTriangleIcon className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-yellow-900 mb-2">
            No Verified Meta Apps
          </h3>
          <p className="text-yellow-700 mb-4">
            You need to add and verify a Meta app before connecting ad accounts.
          </p>
          <p className="text-sm text-yellow-600">
            Go to the "Meta Apps" tab to add your app credentials.
          </p>
        </div>
      ) : (
        <>
          <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-4">
              <div className="flex-1">
                <Select
                  label="Select Meta App"
                  value={selectedMetaApp}
                  onChange={(e) => setSelectedMetaApp(e.target.value)}
                  options={metaApps
                    .filter(app => app.isVerified)
                    .map(app => ({
                      value: app.id,
                      label: `${app.appName} (${app.appId})`
                    }))}
                  placeholder="Choose a Meta app to connect accounts..."
                />
              </div>
              <div className="pt-6">
                <Button
                  onClick={handleConnectAccount}
                  disabled={!selectedMetaApp}
                  loading={isConnecting}
                  className="flex items-center"
                >
                  <LinkIcon className="h-4 w-4 mr-2" />
                  Connect Account
                </Button>
              </div>
            </div>
          </div>
        </>
      )}

      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-lg p-4 h-20"></div>
          ))}
        </div>
      ) : accounts.length === 0 ? (
        hasVerifiedApps && (
          <div className="text-center py-8">
            <div className="text-gray-500">No connected accounts yet</div>
          </div>
        )
      ) : (
        <div className="space-y-4">
          {accounts.map((account) => {
            const metaApp = metaApps.find(app => app.id === account.metaAppId)
            return (
              <div
                key={account.id}
                className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-semibold text-lg">M</span>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900">{account.accountName}</h4>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>ID: {account.accountId}</span>
                      <span>Currency: {account.currency}</span>
                      <span>App: {metaApp?.appName || 'Unknown'}</span>
                      <div className="flex items-center space-x-1">
                        {account.accountStatus === 'ACTIVE' ? (
                          <>
                            <CheckCircleIcon className="h-4 w-4 text-green-500" />
                            <span className="text-green-600">Active</span>
                          </>
                        ) : (
                          <>
                            <XCircleIcon className="h-4 w-4 text-red-500" />
                            <span className="text-red-600">Inactive</span>
                          </>
                        )}
                      </div>
                    </div>
                    <p className="text-xs text-gray-400 mt-1">
                      Connected on {formatDate(account.createdAt)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm">
                    Sync
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDisconnect(account.id)}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <TrashIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h4 className="text-sm font-medium text-blue-900 mb-2">
          How to get your Meta App credentials:
        </h4>
        <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
          <li>Go to <a href="https://developers.facebook.com/apps/" target="_blank" className="underline">Meta for Developers</a></li>
          <li>Create a new app or select an existing one</li>
          <li>Add the "Marketing API" product to your app</li>
          <li>Copy your App ID and App Secret from the app dashboard</li>
          <li>Add your domain to the allowed domains in app settings</li>
        </ol>
      </div>
    </div>
  )
}

