import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutAPI } from '../services/api';
import { 
  CreditCard, 
  Calendar, 
  Users, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

interface Subscription {
  id: string;
  user_id: string;
  stripe_customer_id: string;
  stripe_subscription_id: string;
  price_id: string;
  status: string;
  current_period_start: string;
  current_period_end: string;
  latest_invoice_id?: string;
  created_at: string;
  updated_at: string;
}

interface Usage {
  has_subscription: boolean;
  subscription?: Subscription;
  usage?: {
    email_connections: {
      used: number;
      limit: number | string;
      remaining: number | string;
    };
  };
}

const SubscriptionManager: React.FC = () => {
  const [isCancelling, setIsCancelling] = useState(false);
  const queryClient = useQueryClient();

  // Fetch subscription data
  const { data: subscription, isLoading: subscriptionLoading, error: subscriptionError } = useQuery({
    queryKey: ['subscription'],
    queryFn: () => fetch('/api/subscriptions/my-subscription').then(res => res.json()),
    retry: 2
  });

  // Fetch usage data
  const { data: usage, isLoading: usageLoading } = useQuery({
    queryKey: ['subscription-usage'],
    queryFn: () => fetch('/api/subscriptions/usage').then(res => res.json()),
    retry: 2
  });

  // Sync mutation
  const syncMutation = useMutation({
    mutationFn: () => fetch('/api/subscriptions/sync', { method: 'POST' }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
    }
  });

  // Cancel subscription mutation
  const cancelMutation = useMutation({
    mutationFn: (subscriptionId: string) => 
      fetch('/api/subscriptions/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: subscriptionId })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
      setIsCancelling(false);
    }
  });

  // Reactivate subscription mutation
  const reactivateMutation = useMutation({
    mutationFn: (subscriptionId: string) => 
      fetch('/api/subscriptions/reactivate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription_id: subscriptionId })
      }).then(res => res.json()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] });
      queryClient.invalidateQueries({ queryKey: ['subscription-usage'] });
    }
  });

  const handleCancel = () => {
    if (subscription?.stripe_subscription_id) {
      setIsCancelling(true);
      cancelMutation.mutate(subscription.stripe_subscription_id);
    }
  };

  const handleReactivate = () => {
    if (subscription?.stripe_subscription_id) {
      reactivateMutation.mutate(subscription.stripe_subscription_id);
    }
  };

  const handleSync = () => {
    syncMutation.mutate();
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'canceled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'past_due':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 bg-green-100';
      case 'canceled':
        return 'text-red-600 bg-red-100';
      case 'past_due':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  if (subscriptionLoading || usageLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        <span className="ml-3 text-gray-600">Loading subscription...</span>
      </div>
    );
  }

  if (subscriptionError) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center">
          <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
          <h3 className="text-lg font-medium text-red-800">Error Loading Subscription</h3>
        </div>
        <p className="mt-2 text-red-600">
          Failed to load subscription information. Please try again.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Subscription Management</h2>
          <p className="text-gray-600">Manage your subscription and usage</p>
        </div>
        <button
          onClick={handleSync}
          disabled={syncMutation.isPending}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
          Sync from Stripe
        </button>
      </div>

      {/* Subscription Status */}
      {subscription ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center">
              <CreditCard className="w-6 h-6 text-indigo-600 mr-3" />
              <h3 className="text-lg font-semibold text-gray-900">Current Subscription</h3>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(subscription.status)}`}>
              {getStatusIcon(subscription.status)}
              <span className="ml-2 capitalize">{subscription.status}</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="text-sm font-medium text-gray-500">Subscription ID</label>
              <p className="text-gray-900 font-mono text-sm">{subscription.stripe_subscription_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Price ID</label>
              <p className="text-gray-900 font-mono text-sm">{subscription.price_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Period Start</label>
              <p className="text-gray-900">{new Date(subscription.current_period_start).toLocaleDateString()}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Current Period End</label>
              <p className="text-gray-900">{new Date(subscription.current_period_end).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex space-x-4">
            {subscription.status === 'active' && (
              <button
                onClick={handleCancel}
                disabled={isCancelling || cancelMutation.isPending}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {cancelMutation.isPending ? 'Cancelling...' : 'Cancel Subscription'}
              </button>
            )}
            {subscription.status === 'canceled' && (
              <button
                onClick={handleReactivate}
                disabled={reactivateMutation.isPending}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {reactivateMutation.isPending ? 'Reactivating...' : 'Reactivate Subscription'}
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Subscription</h3>
          <p className="text-gray-600 mb-4">You don't have an active subscription. Choose a plan to get started.</p>
          <a
            href="/"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            View Plans
          </a>
        </div>
      )}

      {/* Usage Information */}
      {usage?.has_subscription && usage.usage && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Users className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Usage Information</h3>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Email Connections</span>
                <span className="text-sm text-gray-600">
                  {usage.usage.email_connections.used} / {usage.usage.email_connections.limit}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-indigo-600 h-2 rounded-full"
                  style={{
                    width: usage.usage.email_connections.limit === 'unlimited' 
                      ? '100%' 
                      : `${(usage.usage.email_connections.used / Number(usage.usage.email_connections.limit)) * 100}%`
                  }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {usage.usage.email_connections.remaining === 'unlimited' 
                  ? 'Unlimited connections available'
                  : `${usage.usage.email_connections.remaining} connections remaining`
                }
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Billing Information */}
      {subscription && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center mb-4">
            <Calendar className="w-6 h-6 text-indigo-600 mr-3" />
            <h3 className="text-lg font-semibold text-gray-900">Billing Information</h3>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Next billing date</span>
              <span className="font-medium">{new Date(subscription.current_period_end).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className={`font-medium ${getStatusColor(subscription.status)}`}>
                {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}
              </span>
            </div>
            {subscription.latest_invoice_id && (
              <div className="flex justify-between">
                <span className="text-gray-600">Latest invoice</span>
                <span className="font-mono text-sm">{subscription.latest_invoice_id}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionManager;