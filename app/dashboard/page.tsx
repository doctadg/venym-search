"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Search,
  Key,
  User,
  CreditCard,
  BarChart3,
  Copy,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Download,
  Settings,
  Bell,
  Shield,
  Zap,
  Calendar,
  Clock,
  CheckCircle,
  MoreHorizontal,
  RefreshCw,
  TrendingUp,
  Database,
  Loader2,
  AlertCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useUserData } from "@/lib/useUserData"
import { useRouter } from "next/navigation"

interface DashboardStats {
  total_requests: { value: number; change: string }
  credits_used: { value: number; change: string }
  success_rate: { value: string; change: string }
  avg_latency: { value: number; change: string }
}

interface ApiKeyData {
  id: string
  key_name: string
  api_key: string
  created_at: string
  last_used_at?: string
  is_active: boolean
}

interface RequestData {
  id: string
  endpoint: string
  method: string
  status: number
  timestamp: string
  credits: number
  latency: string
  query: string
}

interface PaymentData {
  id: string
  date: string
  amount: string
  credits: string
  status: string
  plan: string
}

export default function Dashboard() {
  const { user, isLoaded } = useUser()
  const { userData, loading: userDataLoading, error: userDataError, refreshUserData } = useUserData()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("overview")
  const [showApiKey, setShowApiKey] = useState<{ [key: string]: boolean }>({})
  
  // Loading states
  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [apiKeysLoading, setApiKeysLoading] = useState(false)
  const [requestsLoading, setRequestsLoading] = useState(false)
  
  // Data states
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RequestData[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([])
  const [requestHistory, setRequestHistory] = useState<RequestData[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentData[]>([])
  
  // Error states
  const [error, setError] = useState<string | null>(null)
  
  // Form states
  const [newKeyName, setNewKeyName] = useState("")
  const [profileData, setProfileData] = useState({
    full_name: "",
    email: "",
    company: "",
    bio: ""
  })
  const [passwordData, setPasswordData] = useState({
    current_password: "",
    new_password: "",
    confirm_password: ""
  })


  const toggleApiKeyVisibility = (keyId: string) => {
    setShowApiKey((prev) => ({ ...prev, [keyId]: !prev[keyId] }))
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  // Redirect if not authenticated
  useEffect(() => {
    if (isLoaded && !user) {
      console.log('Redirecting to login - not authenticated')
      router.push('/login')
    }
  }, [isLoaded, user, router])

  // Debug logging
  useEffect(() => {
    console.log('Dashboard state:', { 
      isLoaded, 
      user: !!user, 
      userData: userData ? {
        email: userData.email,
        role: userData.role,
        isAdmin: userData.role === 'admin'
      } : null
    })
  }, [isLoaded, user, userData])

  // Auth state is now managed automatically by Supabase
  // No need for localStorage checks

  // Initialize profile data when user is loaded
  useEffect(() => {
    if (userData) {
      setProfileData({
        full_name: userData.full_name || "",
        email: userData.email || "",
        company: userData.company || "",
        bio: ""
      })
    }
  }, [userData])

  // Fetch dashboard data
  useEffect(() => {
    if (userData) {
      fetchDashboardData()
    }
  }, [userData])

  const fetchDashboardData = async () => {
    try {
      setDashboardLoading(true)
      setError(null)
      
      const response = await fetch('/api/analytics/dashboard')

      if (response.ok) {
        const data = await response.json()
        setDashboardStats(data.stats)
        setRecentActivity(data.recent_activity)
      } else {
        setError('Failed to load dashboard data')
      }
    } catch (error) {
      console.error('Dashboard data error:', error)
      setError('Failed to load dashboard data')
    } finally {
      setDashboardLoading(false)
    }
  }

  const fetchApiKeys = async () => {
    try {
      setApiKeysLoading(true)
      const response = await fetch('/api/api-keys')

      if (response.ok) {
        const data = await response.json()
        setApiKeys(data.api_keys)
      } else {
        setError('Failed to load API keys')
      }
    } catch (error) {
      console.error('API keys error:', error)
      setError('Failed to load API keys')
    } finally {
      setApiKeysLoading(false)
    }
  }

  const fetchRequestHistory = async () => {
    try {
      setRequestsLoading(true)
      const response = await fetch('/api/analytics/requests?limit=50')

      if (response.ok) {
        const data = await response.json()
        setRequestHistory(data.requests)
      } else {
        setError('Failed to load request history')
      }
    } catch (error) {
      console.error('Request history error:', error)
      setError('Failed to load request history')
    } finally {
      setRequestsLoading(false)
    }
  }

  const fetchPaymentHistory = async () => {
    try {
      // For now, we'll use the existing payment data from the user
      // In a real app, you'd have a separate endpoint for this
      setPaymentHistory([])
    } catch (error) {
      console.error('Payment history error:', error)
    }
  }

  // Load data when switching tabs
  useEffect(() => {
    if (!userData) return
    
    switch (activeTab) {
      case 'keys':
        if (apiKeys.length === 0) fetchApiKeys()
        break
      case 'requests':
        if (requestHistory.length === 0) fetchRequestHistory()
        break
      case 'billing':
        if (paymentHistory.length === 0) fetchPaymentHistory()
        break
    }
  }, [activeTab, userData])

  const createApiKey = async () => {
    if (!newKeyName.trim()) return
    
    try {
      const response = await fetch('/api/api-keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key_name: newKeyName })
      })

      if (response.ok) {
        const data = await response.json()
        setApiKeys(prev => [data.api_key, ...prev])
        setNewKeyName("")
        alert('API key created successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create API key')
      }
    } catch (error) {
      console.error('Create API key error:', error)
      alert('Failed to create API key')
    }
  }

  const deleteApiKey = async (keyId: string) => {
    try {
      const response = await fetch('/api/api-keys', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key_id: keyId })
      })

      if (response.ok) {
        setApiKeys(prev => prev.filter(key => key.id !== keyId))
        alert('API key deleted successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to delete API key')
      }
    } catch (error) {
      console.error('Delete API key error:', error)
      alert('Failed to delete API key')
    }
  }

  const updateProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
      })

      if (response.ok) {
        alert('Profile updated successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to update profile')
      }
    } catch (error) {
      console.error('Update profile error:', error)
      alert('Failed to update profile')
    }
  }

  const changePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      alert('Passwords do not match')
      return
    }

    try {
      const response = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(passwordData)
      })

      if (response.ok) {
        setPasswordData({ current_password: "", new_password: "", confirm_password: "" })
        alert('Password changed successfully!')
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to change password')
      }
    } catch (error) {
      console.error('Change password error:', error)
      alert('Failed to change password')
    }
  }

  const upgradeSubscription = async (planType: string) => {
    try {
      const response = await fetch('/api/payments/create-subscription-checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ plan_type: planType })
      })

      if (response.ok) {
        const data = await response.json()
        window.location.href = data.checkout_url
      } else {
        const errorData = await response.json()
        alert(errorData.error || 'Failed to create subscription checkout')
      }
    } catch (error) {
      console.error('Subscription upgrade error:', error)
      alert('Failed to start subscription')
    }
  }

  // Show loading state while checking authentication
  if (!isLoaded || userDataLoading) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#efa72d] mx-auto mb-4" />
          <p className="text-[#edf3f1] font-bold">Loading...</p>
        </div>
      </div>
    )
  }

  // If not authenticated, the redirect effect will handle navigation
  if (!isLoaded || !user || !userData) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#efa72d] mx-auto mb-4" />
          <p className="text-[#edf3f1] font-bold">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#17457c]">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 md:h-20 flex items-center border-b-4 border-[#efa72d] bg-[#17457c]">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="w-8 h-8 md:w-10 md:h-10 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search Logo"
                width={40}
                height={40}
                className="w-8 h-8 md:w-10 md:h-10 brightness-0 invert"
              />
            </div>
            <span className="font-black text-lg md:text-xl tracking-tight text-[#edf3f1]">VENYM_SEARCH</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-2 md:gap-4">
          {userData.role === 'admin' && (
            <Link href="/admin">
              <Button
                variant="outline"
                size="sm"
                className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] bg-transparent"
              >
                <Shield className="h-4 w-4 mr-2" />
                Admin Panel
              </Button>
            </Link>
          )}
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] bg-transparent"
          >
            <Bell className="h-4 w-4 mr-2" />
            Notifications
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] bg-transparent p-2"
          >
            <Bell className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2 text-[#edf3f1]">
            <User className="h-4 w-4 md:h-5 md:w-5" />
            <span className="font-bold text-sm md:text-base hidden sm:inline">{userData.email}</span>
            <span className="font-bold text-sm sm:hidden">{userData.full_name?.split(' ')[0] || 'User'}</span>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#6b839a] border-t-4 border-[#efa72d] z-50">
          <nav className="flex justify-around py-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "requests", label: "Requests", icon: Search },
              { id: "keys", label: "Keys", icon: Key },
              { id: "account", label: "Account", icon: User },
              { id: "billing", label: "Billing", icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center gap-1 px-2 py-2 font-black text-xs transition-all ${
                  activeTab === item.id
                    ? "text-[#efa72d]"
                    : "text-[#edf3f1]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-[#6b839a] border-r-4 border-[#efa72d] p-6">
          <nav className="space-y-2">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "requests", label: "Request History", icon: Search },
              { id: "keys", label: "API Keys", icon: Key },
              { id: "account", label: "Account", icon: User },
              { id: "billing", label: "Billing", icon: CreditCard },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-black text-left transition-all ${
                  activeTab === item.id
                    ? "bg-[#efa72d] text-[#17457c] shadow-[4px_4px_0px_0px_#17457c]"
                    : "text-[#edf3f1] hover:bg-[#17457c] hover:shadow-[2px_2px_0px_0px_#efa72d]"
                }`}
              >
                <item.icon className="h-5 w-5" />
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 bg-[#edf3f1] pb-20 lg:pb-8 max-w-7xl mx-auto">
          {activeTab === "overview" && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17457c] mb-2">Dashboard Overview</h1>
                <p className="text-base sm:text-lg font-bold text-[#6b839a]">
                  Welcome back{userData.full_name ? `, ${userData.full_name.split(' ')[0]}` : ''}! Here's what's happening with your API usage.
                </p>
              </div>

              {/* Error State */}
              {error && (
                <Card className="border-2 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-bold">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Stats Cards */}
              <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Card key={index} className="border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[6px_6px_0px_0px_#000000]">
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
                            <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                          </div>
                          <div className="w-12 h-12 bg-gray-200 rounded-lg animate-pulse"></div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : dashboardStats ? (
                  [
                    { title: "Total Requests", value: dashboardStats.total_requests.value.toLocaleString(), change: dashboardStats.total_requests.change, icon: Zap, color: "bg-[#efa72d]" },
                    { title: "Credits Used", value: dashboardStats.credits_used.value.toLocaleString(), change: dashboardStats.credits_used.change, icon: Database, color: "bg-[#17457c]" },
                    { title: "Success Rate", value: `${dashboardStats.success_rate.value}%`, change: dashboardStats.success_rate.change, icon: CheckCircle, color: "bg-green-600" },
                    { title: "Avg Latency", value: `${dashboardStats.avg_latency.value}ms`, change: dashboardStats.avg_latency.change, icon: Clock, color: "bg-[#6b839a]", subtitle: "backend processing" },
                  ].map((stat, index) => (
                    <Card
                      key={index}
                      className="border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[6px_6px_0px_0px_#000000] transform hover:translate-x-1 hover:translate-y-1 transition-all"
                    >
                      <CardContent className="p-4 sm:p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-xs sm:text-sm font-bold text-[#6b839a] mb-1">{stat.title}</p>
                            <p className="text-xl sm:text-2xl lg:text-3xl font-black text-[#17457c]">{stat.value}</p>
                            <p className={`text-xs sm:text-sm font-bold ${stat.change.startsWith('+') ? 'text-green-600' : stat.change.startsWith('-') ? 'text-red-600' : 'text-gray-600'}`}>{stat.change}</p>
                            {stat.subtitle && <p className="text-xs font-bold text-[#6b839a] mt-1">{stat.subtitle}</p>}
                          </div>
                          <div className={`p-2 sm:p-3 rounded-lg ${stat.color}`}>
                            <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-[#6b839a] font-bold">No data available</p>
                  </div>
                )}
              </div>

              {/* User Credits Display */}
              <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    Account Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm font-bold text-[#6b839a]">Current Plan</p>
                      <p className="text-xl font-black text-[#17457c] capitalize">{userData.plan}</p>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#6b839a]">Credits Remaining</p>
                      <p className="text-xl font-black text-[#17457c]">{userData.credits_remaining.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-xl lg:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                    <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dashboardLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="flex items-center gap-4 p-4 bg-gray-100 rounded-lg animate-pulse">
                          <div className="w-16 h-6 bg-gray-200 rounded"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded"></div>
                            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                          </div>
                          <div className="w-20 h-4 bg-gray-200 rounded"></div>
                        </div>
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="space-y-3 sm:space-y-4">
                      {recentActivity.slice(0, 5).map((request) => (
                        <div
                          key={request.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-white rounded-lg border-2 border-[#6b839a] gap-3 sm:gap-4"
                        >
                          <div className="flex items-center gap-3 sm:gap-4 min-w-0 flex-1">
                            <Badge
                              className={`${request.status >= 200 && request.status < 400 ? "bg-green-600" : "bg-red-600"} text-white font-black text-xs sm:text-sm`}
                            >
                              {request.status}
                            </Badge>
                            <div className="min-w-0 flex-1">
                              <p className="font-black text-[#17457c] text-sm sm:text-base truncate">{request.endpoint}</p>
                              <p className="text-xs sm:text-sm font-bold text-[#6b839a] truncate">{request.query}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex justify-between sm:block">
                            <p className="font-black text-[#17457c] text-sm sm:text-base">{request.credits} credits</p>
                            <p className="text-xs sm:text-sm font-bold text-[#6b839a]">{request.latency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-[#6b839a] font-bold">No recent activity</p>
                      <p className="text-sm text-[#6b839a] mt-2">Start making API requests to see your activity here.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-4 sm:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17457c] mb-2">Request History</h1>
                  <p className="text-base sm:text-lg font-bold text-[#6b839a]">
                    Track all your API requests and performance metrics.
                  </p>
                </div>
                <div className="flex gap-2 sm:gap-3">
                  <Button className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] text-sm sm:text-base">
                    <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                  <Button
                    variant="outline"
                    className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white font-black bg-transparent border-2 sm:border-4 shadow-[2px_2px_0px_0px_#17457c] sm:shadow-[4px_4px_0px_0px_#17457c] text-sm sm:text-base"
                  >
                    <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span className="hidden sm:inline">Refresh</span>
                    <span className="sm:hidden">↻</span>
                  </Button>
                </div>
              </div>

              {/* Filters */}
              <Card className="border-2 sm:border-4 border-[#6b839a] shadow-[3px_3px_0px_0px_#6b839a] sm:shadow-[6px_6px_0px_0px_#6b839a]">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 sm:items-end">
                    <div className="flex-1">
                      <Label className="font-black text-[#17457c] text-sm sm:text-base">Search Requests</Label>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-[#6b839a]" />
                        <Input
                          placeholder="Search by query, endpoint, or ID..."
                          className="pl-8 sm:pl-10 border-2 border-[#6b839a] font-bold text-sm sm:text-base"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3 sm:gap-4">
                      <div className="flex-1 sm:flex-none">
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Status</Label>
                        <Select>
                          <SelectTrigger className="w-full sm:w-32 border-2 border-[#6b839a] font-bold text-sm sm:text-base">
                            <SelectValue placeholder="All" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="200">Success</SelectItem>
                            <SelectItem value="400">Client Error</SelectItem>
                            <SelectItem value="500">Server Error</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex-1 sm:flex-none">
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Date Range</Label>
                        <Select>
                          <SelectTrigger className="w-full sm:w-32 border-2 border-[#6b839a] font-bold text-sm sm:text-base">
                            <SelectValue placeholder="Last 7 days" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="7d">Last 7 days</SelectItem>
                            <SelectItem value="30d">Last 30 days</SelectItem>
                            <SelectItem value="90d">Last 90 days</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Request Table - Desktop */}
              <Card className="hidden lg:block border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-[#efa72d] hover:bg-[#efa72d]">
                        <TableHead className="font-black text-[#17457c]">Request ID</TableHead>
                        <TableHead className="font-black text-[#17457c]">Endpoint</TableHead>
                        <TableHead className="font-black text-[#17457c]">Status</TableHead>
                        <TableHead className="font-black text-[#17457c]">Timestamp</TableHead>
                        <TableHead className="font-black text-[#17457c]">Credits</TableHead>
                        <TableHead className="font-black text-[#17457c]">Latency</TableHead>
                        <TableHead className="font-black text-[#17457c]">Query</TableHead>
                        <TableHead className="font-black text-[#17457c]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requestHistory.map((request) => (
                        <TableRow key={request.id} className="hover:bg-gray-50">
                          <TableCell className="font-bold text-[#17457c]">{request.id}</TableCell>
                          <TableCell className="font-bold text-[#6b839a]">{request.endpoint}</TableCell>
                          <TableCell>
                            <Badge
                              className={`${request.status === 200 ? "bg-green-600" : request.status === 429 ? "bg-yellow-600" : "bg-red-600"} text-white font-black`}
                            >
                              {request.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="font-bold text-[#6b839a]">{request.timestamp}</TableCell>
                          <TableCell className="font-bold text-[#17457c]">{request.credits}</TableCell>
                          <TableCell className="font-bold text-[#6b839a]">{request.latency}</TableCell>
                          <TableCell className="font-bold text-[#6b839a] max-w-xs truncate">{request.query}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent>
                                <DropdownMenuItem>View Details</DropdownMenuItem>
                                <DropdownMenuItem>Copy Request ID</DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Request Cards - Mobile */}
              <div className="lg:hidden space-y-3">
                {requestHistory.map((request) => (
                  <Card key={request.id} className="border-2 border-[#efa72d] shadow-[3px_3px_0px_0px_#efa72d]">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Badge
                            className={`${request.status === 200 ? "bg-green-600" : request.status === 429 ? "bg-yellow-600" : "bg-red-600"} text-white font-black text-xs`}
                          >
                            {request.status}
                          </Badge>
                          <span className="font-black text-[#17457c] text-sm">{request.endpoint}</span>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                              <MoreHorizontal className="h-3 w-3" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Copy Request ID</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-[#6b839a] truncate">{request.query}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 text-xs">
                            <span className="font-bold text-[#17457c]">{request.credits} credits</span>
                            <span className="font-bold text-[#6b839a]">{request.latency}</span>
                          </div>
                          <span className="text-xs font-bold text-[#6b839a]">{request.timestamp}</span>
                        </div>
                        <p className="text-xs font-bold text-[#6b839a]">ID: {request.id}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {activeTab === "keys" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#17457c] mb-2">API Keys</h1>
                  <p className="text-base sm:text-lg font-bold text-[#6b839a]">Manage your API keys and access tokens.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Input
                    placeholder="New key name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className="w-full sm:w-40 border-2 border-[#6b839a] font-bold min-h-[44px]"
                  />
                  <Button 
                    onClick={createApiKey}
                    disabled={!newKeyName.trim()}
                    className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 sm:border-4 border-black shadow-[2px_2px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000]"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Create Key
                  </Button>
                </div>
              </div>

              {/* Error State */}
              {error && (
                <Card className="border-2 border-red-500 bg-red-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-2 text-red-700">
                      <AlertCircle className="h-5 w-5" />
                      <p className="font-bold">{error}</p>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid gap-6">
                {apiKeysLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <Card key={index} className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                      <CardContent className="p-6">
                        <div className="space-y-4 animate-pulse">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <div className="h-6 bg-gray-200 rounded w-48"></div>
                              <div className="h-4 bg-gray-200 rounded w-32"></div>
                            </div>
                            <div className="h-6 bg-gray-200 rounded w-16"></div>
                          </div>
                          <div className="h-10 bg-gray-200 rounded"></div>
                          <div className="grid grid-cols-2 gap-4">
                            <div className="h-8 bg-gray-200 rounded"></div>
                            <div className="h-8 bg-gray-200 rounded"></div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <Card key={key.id} className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <h3 className="text-xl font-black text-[#17457c] mb-1">{key.key_name}</h3>
                            <p className="text-sm font-bold text-[#6b839a]">Created on {new Date(key.created_at).toLocaleDateString()}</p>
                          </div>
                          <Badge className="bg-green-600 text-white font-black">{key.is_active ? 'ACTIVE' : 'INACTIVE'}</Badge>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="font-black text-[#17457c] mb-2 block">API Key</Label>
                            <div className="flex items-center gap-2">
                              <Input
                                type={showApiKey[key.id] ? "text" : "password"}
                                value={key.api_key}
                                readOnly
                                className="font-mono border-2 border-[#6b839a] font-bold"
                              />
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toggleApiKeyVisibility(key.id)}
                                className="border-[#6b839a] text-[#6b839a] hover:bg-[#6b839a] hover:text-white"
                              >
                                {showApiKey[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => copyToClipboard(key.api_key)}
                                className="border-[#6b839a] text-[#6b839a] hover:bg-[#6b839a] hover:text-white"
                              >
                                <Copy className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-bold text-[#6b839a]">Last Used</p>
                              <p className="font-black text-[#17457c]">
                                {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                              </p>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-[#6b839a]">Status</p>
                              <p className="font-black text-[#17457c]">{key.is_active ? 'Active' : 'Inactive'}</p>
                            </div>
                          </div>

                          <div className="flex gap-2 pt-4 border-t-2 border-gray-200">
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white font-black bg-transparent"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete API Key</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the API key "{key.key_name}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => deleteApiKey(key.id)}
                                    className="bg-red-600 hover:bg-red-700"
                                  >
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-2 sm:border-4 border-[#6b839a] shadow-[4px_4px_0px_0px_#6b839a] sm:shadow-[8px_8px_0px_0px_#6b839a]">
                    <CardContent className="p-8 text-center">
                      <Key className="h-12 w-12 text-[#6b839a] mx-auto mb-4" />
                      <h3 className="text-xl font-black text-[#17457c] mb-2">No API Keys</h3>
                      <p className="text-[#6b839a] font-bold mb-4">Create your first API key to start using our services.</p>
                      <div className="flex justify-center gap-2">
                        <Input
                          placeholder="Enter key name"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                          className="w-40 border-2 border-[#6b839a] font-bold"
                        />
                        <Button 
                          onClick={createApiKey}
                          disabled={!newKeyName.trim()}
                          className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000]"
                        >
                          <Plus className="h-4 w-4 mr-2" />
                          Create
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#17457c] mb-1 sm:mb-2">Account Settings</h1>
                <p className="text-sm sm:text-lg font-bold text-[#6b839a]">Manage your account information and preferences.</p>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-[#6b839a] border-2 sm:border-4 border-[#efa72d] h-auto">
                  <TabsTrigger
                    value="profile"
                    className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm py-2"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm py-2"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1] text-xs sm:text-sm py-2"
                  >
                    <span className="hidden sm:inline">Notifications</span>
                    <span className="sm:hidden">Alerts</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-4 sm:mt-6">
                  <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="text-lg sm:text-2xl font-black text-[#17457c]">Profile Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Full Name</Label>
                        <Input 
                          value={profileData.full_name}
                          onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Email Address</Label>
                        <Input 
                          value={profileData.email}
                          onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Company</Label>
                        <Input 
                          value={profileData.company}
                          onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Bio</Label>
                        <Textarea
                          value={profileData.bio}
                          onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold"
                        />
                      </div>
                      <Button 
                        onClick={updateProfile}
                        className="w-full sm:w-auto bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] min-h-[44px]"
                      >
                        Save Changes
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="mt-4 sm:mt-6">
                  <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="text-lg sm:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                        <Shield className="h-5 w-5 sm:h-6 sm:w-6" />
                        Security Settings
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Current Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">New Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div>
                        <Label className="font-black text-[#17457c] text-sm sm:text-base">Confirm New Password</Label>
                        <Input 
                          type="password" 
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                          className="border-2 border-[#6b839a] font-bold min-h-[44px]" 
                        />
                      </div>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-[#6b839a] gap-2 sm:gap-4">
                        <div className="min-w-0">
                          <p className="font-black text-[#17457c] text-sm sm:text-base">Two-Factor Authentication</p>
                          <p className="text-xs sm:text-sm font-bold text-[#6b839a]">
                            Add an extra layer of security to your account (Coming Soon)
                          </p>
                        </div>
                        <Switch disabled />
                      </div>
                      <Button 
                        onClick={changePassword}
                        disabled={!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                        className="w-full sm:w-auto bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] disabled:opacity-50 min-h-[44px]"
                      >
                        Update Password
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="mt-4 sm:mt-6">
                  <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                    <CardHeader className="pb-2 sm:pb-4">
                      <CardTitle className="text-lg sm:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                        <Bell className="h-5 w-5 sm:h-6 sm:w-6" />
                        Notification Preferences
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 sm:space-y-6">
                      {[
                        { title: "API Usage Alerts", desc: "Get notified when you reach 80% of your credit limit" },
                        { title: "Security Alerts", desc: "Receive notifications about account security events" },
                        { title: "Product Updates", desc: "Stay informed about new features and improvements" },
                        { title: "Billing Notifications", desc: "Get notified about payments and billing issues" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 bg-gray-50 rounded-lg border-2 border-[#6b839a] gap-2 sm:gap-4"
                        >
                          <div className="min-w-0">
                            <p className="font-black text-[#17457c] text-sm sm:text-base">{item.title}</p>
                            <p className="text-xs sm:text-sm font-bold text-[#6b839a]">{item.desc}</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      ))}
                      <Button className="w-full sm:w-auto bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000] min-h-[44px]">
                        Save Preferences
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-4 sm:space-y-6">
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-4xl font-black text-[#17457c] mb-1 sm:mb-2">Billing & Usage</h1>
                <p className="text-sm sm:text-lg font-bold text-[#6b839a]">Manage your subscription and view payment history.</p>
              </div>

              {/* Subscription Plan */}
              <Card className="border-2 sm:border-4 border-[#efa72d] shadow-[4px_4px_0px_0px_#efa72d] sm:shadow-[8px_8px_0px_0px_#efa72d]">
                <CardHeader className="pb-2 sm:pb-4">
                  <CardTitle className="text-lg sm:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                    <CreditCard className="h-5 w-5 sm:h-6 sm:w-6" />
                    Subscription Plan
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-6">
                  {/* Current Plan Badge */}
                  <div className="bg-[#efa72d] p-4 sm:p-6 rounded-lg border-2 sm:border-4 border-black shadow-[3px_3px_0px_0px_#000000] sm:shadow-[4px_4px_0px_0px_#000000]">
                    <h3 className="text-lg sm:text-xl font-black text-[#17457c] mb-1 sm:mb-2 capitalize">{userData.plan} Plan</h3>
                    <p className="text-2xl sm:text-3xl font-black text-[#17457c] mb-1">
                      {userData.plan === 'free' ? '$0' : userData.plan === 'starter' ? '$9/mo' : userData.plan === 'builder' ? '$49/mo' : '$199/mo'}
                    </p>
                    <p className="font-bold text-[#17457c] text-sm sm:text-base">
                      {userData.plan === 'free' ? '500 Credits' : userData.plan === 'starter' ? '5K Credits/mo' : userData.plan === 'builder' ? '100K Credits/mo' : '500K Credits/mo'}
                    </p>
                  </div>

                  {/* Credits & Account Info */}
                  <div className="grid grid-cols-2 sm:grid-cols-1 gap-3 sm:gap-4">
                    <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#6b839a]">
                      <p className="text-xs sm:text-sm font-bold text-[#6b839a]">Credits Remaining</p>
                      <p className="text-lg sm:text-2xl font-black text-[#17457c]">{userData.credits_remaining.toLocaleString()}</p>
                    </div>
                    <div className="bg-white p-3 sm:p-4 rounded-lg border-2 border-[#6b839a]">
                      <p className="text-xs sm:text-sm font-bold text-[#6b839a]">Account Type</p>
                      <p className="text-lg sm:text-2xl font-black text-[#17457c] capitalize">{userData.plan}</p>
                    </div>
                  </div>

                  {/* Plan Upgrade */}
                  <div className="space-y-2">
                    <p className="text-xs sm:text-sm font-black text-[#17457c]">CHANGE PLAN</p>
                    <Select onValueChange={(value) => upgradeSubscription(value)}>
                      <SelectTrigger className="w-full border-2 border-[#17457c] font-bold min-h-[44px]">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent>
                        {userData.plan !== 'starter' && (
                          <SelectItem value="starter">Starter - $9/mo</SelectItem>
                        )}
                        {userData.plan !== 'builder' && (
                          <SelectItem value="builder">Builder - $49/mo</SelectItem>
                        )}
                        {userData.plan !== 'unicorn' && (
                          <SelectItem value="unicorn">Unicorn - $199/mo</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Link href="/pricing" className="block">
                      <Button
                        variant="outline"
                        className="w-full border-2 border-[#efa72d] text-[#17457c] hover:bg-[#efa72d] font-black bg-transparent min-h-[44px]"
                      >
                        Compare Plans
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>

              {/* Payment History - Desktop Table */}
              <Card className="hidden md:block border-2 sm:border-4 border-[#6b839a] shadow-[4px_4px_0px_0px_#6b839a] sm:shadow-[8px_8px_0px_0px_#6b839a]">
                <CardHeader>
                  <CardTitle className="text-lg sm:text-2xl font-black text-[#17457c] flex items-center gap-2 sm:gap-3">
                    <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                    Payment History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-[#6b839a] hover:bg-[#6b839a]">
                          <TableHead className="font-black text-white whitespace-nowrap">Invoice ID</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Date</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Amount</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Credits</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Plan</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Status</TableHead>
                          <TableHead className="font-black text-white whitespace-nowrap">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id} className="hover:bg-gray-50">
                            <TableCell className="font-bold text-[#17457c]">{payment.id}</TableCell>
                            <TableCell className="font-bold text-[#6b839a]">{payment.date}</TableCell>
                            <TableCell className="font-bold text-[#17457c]">{payment.amount}</TableCell>
                            <TableCell className="font-bold text-[#6b839a]">{payment.credits}</TableCell>
                            <TableCell className="font-bold text-[#6b839a]">{payment.plan}</TableCell>
                            <TableCell>
                              <Badge className="bg-green-600 text-white font-black">{payment.status.toUpperCase()}</Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="outline"
                                size="sm"
                                className="border-[#17457c] text-[#17457c] hover:bg-[#17457c] hover:text-white font-black bg-transparent"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                Invoice
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8">
                      <Calendar className="h-10 w-10 text-[#6b839a] mx-auto mb-3" />
                      <p className="font-black text-[#17457c] text-lg">No Payment History</p>
                      <p className="text-sm text-[#6b839a] font-bold mt-1">Your payment history will appear here once you subscribe to a paid plan.</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Payment History - Mobile Cards */}
              <div className="md:hidden space-y-3">
                <h2 className="text-lg font-black text-[#17457c] flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Payment History
                </h2>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <Card key={payment.id} className="border-2 border-[#6b839a] shadow-[3px_3px_0px_0px_#6b839a]">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge className="bg-green-600 text-white font-black text-xs">{payment.status.toUpperCase()}</Badge>
                            <span className="font-black text-[#17457c] text-sm">{payment.id}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#6b839a]"
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div>
                            <p className="font-bold text-[#6b839a] text-xs">Amount</p>
                            <p className="font-black text-[#17457c]">{payment.amount}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#6b839a] text-xs">Credits</p>
                            <p className="font-black text-[#17457c]">{payment.credits}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#6b839a] text-xs">Plan</p>
                            <p className="font-black text-[#17457c] capitalize">{payment.plan}</p>
                          </div>
                          <div>
                            <p className="font-bold text-[#6b839a] text-xs">Date</p>
                            <p className="font-black text-[#17457c]">{payment.date}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <Card className="border-2 border-[#6b839a] shadow-[3px_3px_0px_0px_#6b839a]">
                    <CardContent className="p-6 text-center">
                      <Calendar className="h-10 w-10 text-[#6b839a] mx-auto mb-3" />
                      <p className="font-black text-[#17457c]">No Payment History</p>
                      <p className="text-xs text-[#6b839a] font-bold mt-1">Subscribe to a paid plan to see payments here.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
