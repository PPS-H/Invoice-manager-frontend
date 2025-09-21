import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation, useNavigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './contexts/AuthContext';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
import Dashboard from './components/Dashboard';
import EmailAccounts from './components/EmailAccounts';
import Invoices from './components/Invoices';
import GoogleCallback from './components/GoogleCallback';
import EmailAccountCallback from './components/EmailAccountCallback';
import EmailAccountCallbackPublic from './components/EmailAccountCallbackPublic';
import InviteAccept from './components/InviteAccept';
import Home from './components/Home';
import VendorSelection from './components/VendorSelection';
import { GeminiTest, GeminiExample } from './gemini';
import InvoiceReview from './components/InvoiceReview';
import TextInvoiceProcessor from './components/TextInvoiceProcessor';
import EmailAccountInvite from './pages/EmailAccountInvite';
import InviteSuccess from './pages/InviteSuccess';
import CheckoutSuccess from './pages/CheckoutSuccess';
import CheckoutCancel from './pages/CheckoutCancel';
import SubscriptionManager from './components/SubscriptionManager';

import { 
  Mail, 
  FileText, 
  Settings as SettingsIcon, 
  LogOut,
  User,
  Shield,
  CheckCircle,
  Activity,
  BarChart3,
  Bell,
  Download,
  RefreshCw,
  Filter,
  CreditCard,
  Calendar,
  Users,
  AlertCircle,
  XCircle
} from 'lucide-react';

// Create a client
const queryClient = new QueryClient();

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

// Login Component
const Login: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-sky-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-white shadow-lg">
            <FileText className="h-8 w-8 text-primary-600" />
          </div>
          <h2 className="mt-6 text-4xl font-bold text-gray-900">Invoice Manager</h2>
          <p className="mt-2 text-gray-600">
            Streamline your invoice management with AI-powered automation
          </p>
        </div>
        
        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-900">Welcome back</h3>
              <p className="mt-2 text-sm text-gray-600">
                Connect your email accounts to start managing invoices automatically
              </p>
            </div>
            
            <button
              onClick={login}
              className="w-full bg-white hover:bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex items-center justify-center gap-3 transition-colors duration-200 shadow-sm hover:shadow-md"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              <span className="text-gray-700 font-medium">Continue with Google</span>
            </button>
            
            <div className="text-center">
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center">
                  <Shield className="h-4 w-4 mr-1" />
                  Secure
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Trusted
                </div>
                <div className="flex items-center">
                  <Activity className="h-4 w-4 mr-1" />
                  Fast
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-xs text-gray-500">
            By continuing, you agree to our <a href="#" className="text-primary-600 hover:text-primary-500">Terms of Service</a> and <a href="#" className="text-primary-600 hover:text-primary-500">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

// Settings Component
const Settings: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklySummary: true,
    securityAlerts: true,
    invoiceReminders: false,
    marketingEmails: false
  });
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('profile');
  const [emailAccountsCount, setEmailAccountsCount] = useState(0);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [usageData, setUsageData] = useState(null);

  // Fetch email accounts count
  useEffect(() => {
    const fetchEmailAccountsCount = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        const response = await fetch(`${API_BASE_URL}/api/email-accounts`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const data = await response.json();
          setEmailAccountsCount(data.email_accounts?.length || 0);
        }
      } catch (error) {
        console.error('Failed to fetch email accounts count:', error);
      }
    };

    fetchEmailAccountsCount();
  }, []);

  // Fetch subscription data
  useEffect(() => {
    const fetchSubscriptionData = async () => {
      try {
        const token = localStorage.getItem('access_token');
        if (!token) return;

        // Fetch subscription
        const subscriptionResponse = await fetch(`${API_BASE_URL}/api/subscriptions/my-subscription`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (subscriptionResponse.ok) {
          const subscription = await subscriptionResponse.json();
          setSubscriptionData(subscription);
        }

        // Fetch usage data
        const usageResponse = await fetch(`${API_BASE_URL}/api/subscriptions/usage`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (usageResponse.ok) {
          const usage = await usageResponse.json();
          setUsageData(usage);
        }
      } catch (error) {
        console.error('Failed to fetch subscription data:', error);
      }
    };

    fetchSubscriptionData();
  }, []);

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Settings saved successfully!');
    } catch (error) {
      alert('Failed to save settings. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleManageEmailAccounts = () => {
    navigate('/email-accounts');
  };

  const handleExportData = () => {
    // Create a simple CSV export
    const data = [
      'Name,Email,Account ID,Plan,Connected Accounts',
      `${user?.name},${user?.email},${user?.id},Professional,${emailAccountsCount}`
    ].join('\n');
    
    const blob = new Blob([data], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = 'account-data.csv';
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
    alert('Data exported successfully!');
  };

  const handleSignOutAllDevices = () => {
    if (window.confirm('Are you sure you want to sign out from all devices? You will need to sign in again.')) {
      logout();
    }
  };

  const handleDeactivateAccount = () => {
    if (window.confirm('Are you sure you want to deactivate your account? This action cannot be undone.')) {
      alert('Account deactivation requested. Please contact support to complete the process.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="p-3 bg-blue-600 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Manage your account preferences and security settings</p>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'profile', name: 'Profile', icon: User },
            { id: 'subscription', name: 'Subscription', icon: CreditCard },
            { id: 'notifications', name: 'Notifications', icon: Bell },
            { id: 'security', name: 'Security', icon: Shield },
            { id: 'preferences', name: 'Preferences', icon: SettingsIcon }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group inline-flex items-center py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon className={`mr-2 h-4 w-4 ${
                  activeTab === tab.id ? 'text-blue-500' : 'text-gray-400'
                }`} />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="card">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                    {user?.picture ? (
                      <img src={user.picture} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                    ) : (
                      <User className="h-8 w-8 text-white" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{user?.name}</h3>
                    <p className="text-gray-600">{user?.email}</p>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                    <input 
                      type="text" 
                      defaultValue={user?.name} 
                      className="input-field"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                    <input 
                      type="email" 
                      defaultValue={user?.email} 
                      className="input-field bg-gray-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Account ID</label>
                    <input 
                      type="text" 
                      value={user?.id} 
                      className="input-field bg-gray-50 text-gray-600 font-mono text-sm"
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Connected Accounts</label>
                    <div className="flex space-x-2">
                      <input 
                        type="text" 
                        value={`${emailAccountsCount} ${emailAccountsCount === 1 ? 'account' : 'accounts'}`}
                        className="input-field bg-gray-50 text-gray-600 flex-1"
                        readOnly
                      />
                      <button 
                        onClick={handleManageEmailAccounts}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        Manage
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Subscription Tab */}
          {activeTab === 'subscription' && (
            <SubscriptionManager />
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNotifications', title: 'Email Notifications', description: 'Receive notifications about new invoices and updates' },
                    { key: 'weeklySummary', title: 'Weekly Summary', description: 'Get a weekly summary of your invoice activity' },
                    { key: 'securityAlerts', title: 'Security Alerts', description: 'Important security and account notifications' },
                    { key: 'invoiceReminders', title: 'Invoice Reminders', description: 'Reminders for pending and overdue invoices' },
                    { key: 'marketingEmails', title: 'Marketing Emails', description: 'Product updates and promotional content' }
                  ].map((setting) => (
                    <div key={setting.key} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-b-0">
                      <div>
                        <label className="text-sm font-medium text-gray-900">{setting.title}</label>
                        <p className="text-sm text-gray-600">{setting.description}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[setting.key as keyof typeof notifications]}
                          onChange={(e) => handleNotificationChange(setting.key, e.target.checked)}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                      <p className="text-sm text-gray-600">Extra security for your account</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-green-600 font-medium">Enabled</span>
                      <button className="px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700">
                        Manage
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-200">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Login Sessions</h4>
                      <p className="text-sm text-gray-600">Manage active sessions across devices</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-600">1 active session</span>
                      <button className="px-3 py-1 bg-gray-600 text-white text-sm rounded hover:bg-gray-700">
                        View All
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">Password</h4>
                      <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                    </div>
                    <button className="px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700">
                      Change
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="card">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Application Preferences</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="input-field">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Date Format</label>
                    <select className="input-field">
                      <option>MM/DD/YYYY</option>
                      <option>DD/MM/YYYY</option>
                      <option>YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                    <select className="input-field">
                      <option>UTC-8 (Pacific)</option>
                      <option>UTC-5 (Eastern)</option>
                      <option>UTC+0 (GMT)</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button 
                onClick={handleManageEmailAccounts}
                className="w-full flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Mail className="h-4 w-4 mr-2" />
                Manage Email Accounts
              </button>
              <button 
                onClick={handleExportData}
                className="w-full flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Data
              </button>
            </div>
          </div>

          {/* Account Summary */}
          <div className="card">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Account Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Plan</span>
                <span className="text-sm font-medium">
                  {subscriptionData ? (
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      subscriptionData.status === 'active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {subscriptionData.status === 'active' ? 'Active' : subscriptionData.status}
                    </span>
                  ) : (
                    'No Subscription'
                  )}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Email Connections</span>
                <span className="text-sm font-medium">
                  {usageData?.usage?.email_connections ? (
                    `${usageData.usage.email_connections.used} / ${usageData.usage.email_connections.limit}`
                  ) : (
                    `${emailAccountsCount} / -`
                  )}
                </span>
              </div>
              {subscriptionData && (
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Next Billing</span>
                  <span className="text-sm font-medium">
                    {new Date(subscriptionData.current_period_end).toLocaleDateString()}
                  </span>
                </div>
              )}
              <button 
                onClick={() => setActiveTab('subscription')}
                className="w-full mt-3 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                {subscriptionData ? 'Manage Subscription' : 'View Plans'}
              </button>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="card border-red-200">
            <h3 className="text-lg font-medium text-red-900 mb-4">Danger Zone</h3>
            <div className="space-y-3">
              <button 
                onClick={handleSignOutAllDevices}
                className="w-full px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                Sign Out All Devices
              </button>
              <button 
                onClick={handleDeactivateAccount}
                className="w-full px-3 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Deactivate Account
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 border-t border-gray-200">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <>
              <CheckCircle className="h-4 w-4" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

// Layout Component
const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Vendor Preferences', href: '/vendor-preferences', icon: Filter },
    { name: 'Email Accounts', href: '/email-accounts', icon: Mail },
    { name: 'Invoices', href: '/invoices', icon: FileText },
    // { name: 'Review Invoices', href: '/invoices/review', icon: CheckCircle },
    // { name: 'Text Invoice Processor', href: '/text-invoice-processor', icon: FileText },
    // { name: 'Gemini Test', href: '/gemini-test', icon: Zap },
    // { name: 'Gemini Example', href: '/gemini-example', icon: FileText },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ];

  const isActive = (href: string) => {
    if (href === '/home') {
      return location.pathname === '/home';
    }
    if (href === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile menu overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-primary-600" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">Invoice Manager</h1>
            </div>
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsSidebarOpen(false)}
                  className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    active
                      ? 'bg-primary-100 text-primary-700 border-r-2 border-primary-600'
                      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <Icon className={`mr-3 h-5 w-5 ${active ? 'text-primary-600' : 'text-gray-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="border-t border-gray-200 p-4 bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
                {user?.picture ? (
                  <img src={user.picture} alt={user.name} className="w-10 h-10 rounded-full" />
                ) : (
                  <User className="h-5 w-5 text-primary-600" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.name || user?.email}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={logout}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors duration-200"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 bg-primary-100 rounded flex items-center justify-center">
                <FileText className="h-4 w-4 text-primary-600" />
              </div>
              <h1 className="text-lg font-bold text-gray-900">Invoice Manager</h1>
            </div>
            <div className="w-10"></div> {/* Spacer for alignment */}
          </div>
        </div>

        <main className="py-4 px-4 lg:py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/auth/callback" element={<GoogleCallback />} />
                  <Route path="/email-accounts/callback" element={<EmailAccountCallback />} />
        <Route path="/email-accounts/callback-public" element={<EmailAccountCallbackPublic />} />
        <Route path="/invite/:token" element={<InviteAccept />} />
        <Route path="/invite/add-email/:token" element={<EmailAccountInvite />} />
        <Route path="/invite-success" element={<InviteSuccess />} />
        <Route path="/success" element={<CheckoutSuccess />} />
        <Route path="/cancel" element={<CheckoutCancel />} />
        <Route path="/subscription" element={<SubscriptionManager />} />
          <Route
            path="/"
            element={<Home />}
          />
          <Route
            path="/home"
            element={<Home />}
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/email-accounts"
            element={
              <ProtectedRoute>
                <Layout>
                  <EmailAccounts />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices"
            element={
              <ProtectedRoute>
                <Layout>
                  <Invoices />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/review"
            element={
              <ProtectedRoute>
                <Layout>
                  <InvoiceReview />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/vendor-preferences"
            element={
              <ProtectedRoute>
                <Layout>
                  <VendorSelection />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Layout>
                  <Settings />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gemini-test"
            element={
              <ProtectedRoute>
                <Layout>
                  <GeminiTest />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/gemini-example"
            element={
              <ProtectedRoute>
                <Layout>
                  <GeminiExample />
                </Layout>
              </ProtectedRoute>
            }
          />
          <Route
            path="/text-invoice-processor"
            element={
              <ProtectedRoute>
                <Layout>
                  <TextInvoiceProcessor />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
