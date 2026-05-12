"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
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
  ArrowUpRight,
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

  const [dashboardLoading, setDashboardLoading] = useState(true)
  const [apiKeysLoading, setApiKeysLoading] = useState(false)
  const [requestsLoading, setRequestsLoading] = useState(false)

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [recentActivity, setRecentActivity] = useState<RequestData[]>([])
  const [apiKeys, setApiKeys] = useState<ApiKeyData[]>([])
  const [requestHistory, setRequestHistory] = useState<RequestData[]>([])
  const [paymentHistory, setPaymentHistory] = useState<PaymentData[]>([])

  const [error, setError] = useState<string | null>(null)

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

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    }
  }, [isLoaded, user, router])

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
      setPaymentHistory([])
    } catch (error) {
      console.error('Payment history error:', error)
    }
  }

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

  if (!isLoaded || userDataLoading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (!isLoaded || !user || !userData) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  const inputClass =
    "w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"

  const labelClass =
    "block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5"

  const statusBadge = (status: number) =>
    status >= 200 && status < 400
      ? "border border-white/20 text-white/80"
      : "border border-white/10 text-white/50"

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              Venym Search
            </span>
            <span className="hidden sm:inline-flex text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 border border-white/10 px-2 py-0.5 rounded-sm">
              Dashboard
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            {userData.role === 'admin' && (
              <Link href="/admin" className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3 py-1.5 rounded-sm">
                <Shield className="h-3 w-3" />
                Admin
              </Link>
            )}
            <button className="inline-flex items-center justify-center w-9 h-9 text-white/40 hover:text-white/80 transition-colors border border-white/[0.06] rounded-sm">
              <Bell className="h-3.5 w-3.5" />
            </button>
            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono uppercase tracking-[0.15em] text-white/50 ml-2">
              <User className="h-3.5 w-3.5" />
              <span className="truncate max-w-[180px]">{userData.email}</span>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative">
        {/* Mobile Tab Navigation */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-[#050505]/95 backdrop-blur-xl border-t border-white/[0.06] z-50">
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
                className={`flex flex-col items-center gap-1 px-2 py-2 text-[9px] font-mono uppercase tracking-[0.15em] transition-colors ${
                  activeTab === item.id ? "text-white" : "text-white/40"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/[0.06] sticky top-14 h-[calc(100vh-3.5rem)] py-6 px-3">
          <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 px-3 mb-3">
            Navigation
          </div>
          <nav className="space-y-px">
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
                className={`group relative w-full flex items-center gap-2.5 pl-3 pr-3 py-2 text-[13px] transition-colors duration-150 ${
                  activeTab === item.id
                    ? "text-white"
                    : "text-white/45 hover:text-white/80"
                }`}
              >
                {activeTab === item.id && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-[2px] bg-white" />
                )}
                <item.icon className="h-3.5 w-3.5 text-white/30" />
                <span className="flex-1 text-left">{item.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0 p-4 sm:p-8 pb-24 lg:pb-12 max-w-7xl mx-auto w-full">
          {activeTab === "overview" && (
            <div className="space-y-8">
              <div>
                <div className="venym-meta mb-3">CLASS :: DASHBOARD</div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  Overview
                </h1>
                <p className="text-[13px] text-white/50">
                  Welcome back{userData.full_name ? `, ${userData.full_name.split(' ')[0]}` : ''}. API usage and recent activity.
                </p>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.10] rounded-sm">
                  <AlertCircle className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <span className="text-white/70 text-[12px] font-mono">{error}</span>
                </div>
              )}

              <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
                {dashboardLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
                      <div className="space-y-3 animate-pulse">
                        <div className="h-3 bg-white/[0.06] rounded w-20"></div>
                        <div className="h-7 bg-white/[0.06] rounded w-24"></div>
                        <div className="h-3 bg-white/[0.06] rounded w-16"></div>
                      </div>
                    </div>
                  ))
                ) : dashboardStats ? (
                  [
                    { title: "Total Requests", value: dashboardStats.total_requests.value.toLocaleString(), change: dashboardStats.total_requests.change, icon: Zap },
                    { title: "Credits Used", value: dashboardStats.credits_used.value.toLocaleString(), change: dashboardStats.credits_used.change, icon: Database },
                    { title: "Success Rate", value: `${dashboardStats.success_rate.value}%`, change: dashboardStats.success_rate.change, icon: CheckCircle },
                    { title: "Avg Latency", value: `${dashboardStats.avg_latency.value}ms`, change: dashboardStats.avg_latency.change, icon: Clock },
                  ].map((stat, index) => (
                    <div
                      key={index}
                      className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5 transition-colors hover:border-white/[0.12]"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">
                          {stat.title}
                        </span>
                        <stat.icon className="h-3.5 w-3.5 text-white/40" />
                      </div>
                      <div className="text-2xl font-bold text-white tracking-tight">
                        {stat.value}
                      </div>
                      <div className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 mt-1">
                        {stat.change}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8">
                    <p className="text-white/40 text-[13px]">No data available</p>
                  </div>
                )}
              </div>

              {/* Account Status */}
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Account Status
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-white/[0.06]">
                  <div className="p-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">Current Plan</div>
                    <div className="text-xl font-bold text-white capitalize">{userData.plan}</div>
                  </div>
                  <div className="p-6">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-2">Credits Remaining</div>
                    <div className="text-xl font-bold text-white">{userData.credits_remaining.toLocaleString()}</div>
                  </div>
                  <div className="p-6 hidden sm:block" />
                </div>
              </div>

              {/* Recent Activity */}
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Recent Activity
                  </span>
                </div>
                <div className="p-6">
                  {dashboardLoading ? (
                    <div className="space-y-3">
                      {Array.from({ length: 3 }).map((_, index) => (
                        <div key={index} className="h-12 bg-white/[0.03] rounded-sm animate-pulse" />
                      ))}
                    </div>
                  ) : recentActivity.length > 0 ? (
                    <div className="divide-y divide-white/[0.06]">
                      {recentActivity.slice(0, 5).map((request) => (
                        <div
                          key={request.id}
                          className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 gap-2"
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${statusBadge(request.status)}`}>
                              {request.status}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-[13px] text-white font-mono truncate">{request.endpoint}</p>
                              <p className="text-[11px] text-white/40 truncate">{request.query}</p>
                            </div>
                          </div>
                          <div className="text-left sm:text-right flex justify-between sm:block gap-3">
                            <p className="text-[12px] font-mono text-white/70">{request.credits} credits</p>
                            <p className="text-[11px] font-mono text-white/40">{request.latency}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-white/50 text-[13px]">No recent activity</p>
                      <p className="text-[11px] text-white/30 mt-1 font-mono uppercase tracking-[0.15em]">
                        Make a request to see activity here
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "requests" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="venym-meta mb-3">CLASS :: TELEMETRY</div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                    Request History
                  </h1>
                  <p className="text-[13px] text-white/50">
                    All API requests and performance metrics.
                  </p>
                </div>
                <div className="flex gap-2">
                  <button className="venym-btn-secondary">
                    <Download className="h-3 w-3 mr-1.5" />
                    Export
                  </button>
                  <button className="venym-btn-secondary">
                    <RefreshCw className="h-3 w-3 mr-1.5" />
                    Refresh
                  </button>
                </div>
              </div>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:items-end">
                  <div>
                    <label className={labelClass}>Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input
                        placeholder="Search by query, endpoint, or ID"
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <Select>
                      <SelectTrigger className="w-full sm:w-32 h-10 bg-white/[0.03] border-white/[0.08] text-[13px] text-white rounded-sm">
                        <SelectValue placeholder="All" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                        <SelectItem value="all">All Status</SelectItem>
                        <SelectItem value="200">Success</SelectItem>
                        <SelectItem value="400">Client Error</SelectItem>
                        <SelectItem value="500">Server Error</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>Range</label>
                    <Select>
                      <SelectTrigger className="w-full sm:w-36 h-10 bg-white/[0.03] border-white/[0.08] text-[13px] text-white rounded-sm">
                        <SelectValue placeholder="Last 7 days" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                        <SelectItem value="7d">Last 7 days</SelectItem>
                        <SelectItem value="30d">Last 30 days</SelectItem>
                        <SelectItem value="90d">Last 90 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">ID</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Endpoint</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Status</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Timestamp</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Credits</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Latency</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Query</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {requestHistory.map((request) => (
                      <TableRow key={request.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                        <TableCell className="text-[12px] font-mono text-white/70">{request.id}</TableCell>
                        <TableCell className="text-[12px] font-mono text-white/70">{request.endpoint}</TableCell>
                        <TableCell>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${statusBadge(request.status)}`}>
                            {request.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-[12px] font-mono text-white/50">{request.timestamp}</TableCell>
                        <TableCell className="text-[12px] font-mono text-white/70">{request.credits}</TableCell>
                        <TableCell className="text-[12px] font-mono text-white/50">{request.latency}</TableCell>
                        <TableCell className="text-[12px] font-mono text-white/50 max-w-xs truncate">{request.query}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-white/40 hover:text-white/80 p-1">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                              <DropdownMenuItem>View Details</DropdownMenuItem>
                              <DropdownMenuItem>Copy Request ID</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:hidden space-y-3">
                {requestHistory.map((request) => (
                  <div key={request.id} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${statusBadge(request.status)}`}>
                          {request.status}
                        </span>
                        <span className="font-mono text-[13px] text-white truncate">{request.endpoint}</span>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-white/40 hover:text-white/80 p-1">
                            <MoreHorizontal className="h-3 w-3" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                          <DropdownMenuItem>View Details</DropdownMenuItem>
                          <DropdownMenuItem>Copy Request ID</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <p className="text-[11px] font-mono text-white/40 truncate mb-2">{request.query}</p>
                    <div className="flex justify-between items-center text-[11px] font-mono">
                      <div className="flex gap-3">
                        <span className="text-white/70">{request.credits} credits</span>
                        <span className="text-white/40">{request.latency}</span>
                      </div>
                      <span className="text-white/30">{request.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "keys" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
                <div>
                  <div className="venym-meta mb-3">CLASS :: ACCESS</div>
                  <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                    API Keys
                  </h1>
                  <p className="text-[13px] text-white/50">Manage your API keys and access tokens.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    placeholder="New key name"
                    value={newKeyName}
                    onChange={(e) => setNewKeyName(e.target.value)}
                    className={`${inputClass} sm:w-48`}
                  />
                  <button
                    onClick={createApiKey}
                    disabled={!newKeyName.trim()}
                    className="venym-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Plus className="h-3 w-3 mr-1.5" />
                    Create
                  </button>
                </div>
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-white/[0.03] border border-white/[0.10] rounded-sm">
                  <AlertCircle className="h-3.5 w-3.5 text-white/60 shrink-0" />
                  <span className="text-white/70 text-[12px] font-mono">{error}</span>
                </div>
              )}

              <div className="grid gap-3">
                {apiKeysLoading ? (
                  Array.from({ length: 2 }).map((_, index) => (
                    <div key={index} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6">
                      <div className="space-y-4 animate-pulse">
                        <div className="h-5 bg-white/[0.06] rounded w-48"></div>
                        <div className="h-10 bg-white/[0.06] rounded"></div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="h-6 bg-white/[0.06] rounded"></div>
                          <div className="h-6 bg-white/[0.06] rounded"></div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : apiKeys.length > 0 ? (
                  apiKeys.map((key) => (
                    <div key={key.id} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 transition-colors hover:border-white/[0.12]">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-base font-semibold text-white mb-0.5">{key.key_name}</h3>
                          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40">
                            Created {new Date(key.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${key.is_active ? "border-white/20 text-white/80" : "border-white/10 text-white/40"}`}>
                          {key.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className={labelClass}>API Key</label>
                          <div className="flex items-center gap-2">
                            <input
                              type={showApiKey[key.id] ? "text" : "password"}
                              value={key.api_key}
                              readOnly
                              className={`${inputClass} font-mono`}
                            />
                            <button
                              onClick={() => toggleApiKeyVisibility(key.id)}
                              className="inline-flex items-center justify-center w-10 h-10 text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-sm transition-colors"
                            >
                              {showApiKey[key.id] ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                            </button>
                            <button
                              onClick={() => copyToClipboard(key.api_key)}
                              className="inline-flex items-center justify-center w-10 h-10 text-white/50 hover:text-white border border-white/[0.08] hover:border-white/20 rounded-sm transition-colors"
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-3 border-t border-white/[0.06]">
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">Last Used</p>
                            <p className="text-[13px] text-white">
                              {key.last_used_at ? new Date(key.last_used_at).toLocaleDateString() : 'Never'}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">Status</p>
                            <p className="text-[13px] text-white">{key.is_active ? 'Active' : 'Inactive'}</p>
                          </div>
                        </div>

                        <div className="flex gap-2 pt-3 border-t border-white/[0.06]">
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <button className="venym-btn-secondary">
                                <Trash2 className="h-3 w-3 mr-1.5" />
                                Delete
                              </button>
                            </AlertDialogTrigger>
                            <AlertDialogContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                              <AlertDialogHeader>
                                <AlertDialogTitle className="text-white">Delete API Key</AlertDialogTitle>
                                <AlertDialogDescription className="text-white/60">
                                  This action cannot be undone. This will permanently delete the API key "{key.key_name}".
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel className="bg-transparent border-white/[0.08] text-white/70 hover:bg-white/[0.03]">Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => deleteApiKey(key.id)}
                                  className="bg-white text-black hover:bg-white/90"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-10 text-center">
                    <Key className="h-8 w-8 text-white/30 mx-auto mb-3" />
                    <h3 className="text-base font-semibold text-white mb-1">No API Keys</h3>
                    <p className="text-[13px] text-white/50 mb-5">Create your first API key to start using our services.</p>
                    <div className="flex justify-center gap-2 max-w-sm mx-auto">
                      <input
                        placeholder="Enter key name"
                        value={newKeyName}
                        onChange={(e) => setNewKeyName(e.target.value)}
                        className={inputClass}
                      />
                      <button
                        onClick={createApiKey}
                        disabled={!newKeyName.trim()}
                        className="venym-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-3 w-3 mr-1.5" />
                        Create
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "account" && (
            <div className="space-y-6">
              <div>
                <div className="venym-meta mb-3">CLASS :: ACCOUNT</div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  Settings
                </h1>
                <p className="text-[13px] text-white/50">Manage your account information and preferences.</p>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="bg-transparent border-b border-white/[0.06] rounded-none p-0 h-auto w-full justify-start gap-0">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
                  >
                    Profile
                  </TabsTrigger>
                  <TabsTrigger
                    value="security"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
                  >
                    Security
                  </TabsTrigger>
                  <TabsTrigger
                    value="notifications"
                    className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
                  >
                    Notifications
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile" className="mt-6">
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-6 space-y-5">
                    <div>
                      <label className={labelClass}>Full Name</label>
                      <input
                        value={profileData.full_name}
                        onChange={(e) => setProfileData(prev => ({ ...prev, full_name: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Email Address</label>
                      <input
                        value={profileData.email}
                        onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Company</label>
                      <input
                        value={profileData.company}
                        onChange={(e) => setProfileData(prev => ({ ...prev, company: e.target.value }))}
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label className={labelClass}>Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData(prev => ({ ...prev, bio: e.target.value }))}
                        rows={4}
                        className="w-full px-3 py-2 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"
                      />
                    </div>
                    <button onClick={updateProfile} className="venym-btn-primary">
                      Save Changes
                    </button>
                  </div>
                </TabsContent>

                <TabsContent value="security" className="mt-6">
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                      <Shield className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        Security Settings
                      </span>
                    </div>
                    <div className="p-6 space-y-5">
                      <div>
                        <label className={labelClass}>Current Password</label>
                        <input
                          type="password"
                          value={passwordData.current_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, current_password: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>New Password</label>
                        <input
                          type="password"
                          value={passwordData.new_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, new_password: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <label className={labelClass}>Confirm New Password</label>
                        <input
                          type="password"
                          value={passwordData.confirm_password}
                          onChange={(e) => setPasswordData(prev => ({ ...prev, confirm_password: e.target.value }))}
                          className={inputClass}
                        />
                      </div>
                      <div className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-sm">
                        <div className="min-w-0">
                          <p className="text-[13px] text-white">Two-Factor Authentication</p>
                          <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 mt-1">
                            Coming Soon
                          </p>
                        </div>
                        <Switch disabled />
                      </div>
                      <button
                        onClick={changePassword}
                        disabled={!passwordData.current_password || !passwordData.new_password || !passwordData.confirm_password}
                        className="venym-btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="mt-6">
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                    <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                      <Bell className="h-3.5 w-3.5 text-white/40" />
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                        Notification Preferences
                      </span>
                    </div>
                    <div className="p-6 space-y-3">
                      {[
                        { title: "API Usage Alerts", desc: "Get notified when you reach 80% of your credit limit" },
                        { title: "Security Alerts", desc: "Receive notifications about account security events" },
                        { title: "Product Updates", desc: "Stay informed about new features and improvements" },
                        { title: "Billing Notifications", desc: "Get notified about payments and billing issues" },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/[0.06] rounded-sm"
                        >
                          <div className="min-w-0">
                            <p className="text-[13px] text-white">{item.title}</p>
                            <p className="text-[11px] text-white/40 mt-0.5">{item.desc}</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                      ))}
                      <div className="pt-3">
                        <button className="venym-btn-primary">Save Preferences</button>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          {activeTab === "billing" && (
            <div className="space-y-6">
              <div>
                <div className="venym-meta mb-3">CLASS :: BILLING</div>
                <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
                  Billing & Usage
                </h1>
                <p className="text-[13px] text-white/50">Manage your subscription and view payment history.</p>
              </div>

              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <CreditCard className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Subscription
                  </span>
                </div>
                <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="border border-white/[0.06] bg-white/[0.03] rounded-sm p-5">
                    <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-2">
                      Current Plan
                    </div>
                    <h3 className="text-xl font-bold text-white capitalize mb-1">{userData.plan}</h3>
                    <p className="text-2xl font-bold text-white mb-1">
                      {userData.plan === 'free' ? '$0' : userData.plan === 'starter' ? '$9' : userData.plan === 'builder' ? '$49' : '$199'}
                      <span className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40 ml-1">/mo</span>
                    </p>
                    <p className="text-[12px] text-white/50">
                      {userData.plan === 'free' ? '500 credits' : userData.plan === 'starter' ? '5K credits/mo' : userData.plan === 'builder' ? '100K credits/mo' : '500K credits/mo'}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
                    <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">Credits Remaining</p>
                      <p className="text-xl font-bold text-white">{userData.credits_remaining.toLocaleString()}</p>
                    </div>
                    <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                      <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1">Account Type</p>
                      <p className="text-xl font-bold text-white capitalize">{userData.plan}</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className={labelClass}>Change Plan</p>
                    <Select onValueChange={(value) => upgradeSubscription(value)}>
                      <SelectTrigger className="w-full h-10 bg-white/[0.03] border-white/[0.08] text-[13px] text-white rounded-sm">
                        <SelectValue placeholder="Select a plan" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                        {userData.plan !== 'starter' && (
                          <SelectItem value="starter">Starter — $9/mo</SelectItem>
                        )}
                        {userData.plan !== 'builder' && (
                          <SelectItem value="builder">Builder — $49/mo</SelectItem>
                        )}
                        {userData.plan !== 'unicorn' && (
                          <SelectItem value="unicorn">Unicorn — $199/mo</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <Link href="/pricing" className="block">
                      <button className="venym-btn-secondary w-full">
                        Compare Plans
                        <ArrowUpRight className="w-3 h-3 ml-1.5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>

              <div className="hidden md:block border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Payment History
                  </span>
                </div>
                <div>
                  {paymentHistory.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow className="border-white/[0.06] hover:bg-transparent">
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Invoice</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Date</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Amount</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Credits</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Plan</TableHead>
                          <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Status</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {paymentHistory.map((payment) => (
                          <TableRow key={payment.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                            <TableCell className="text-[12px] font-mono text-white/70">{payment.id}</TableCell>
                            <TableCell className="text-[12px] font-mono text-white/50">{payment.date}</TableCell>
                            <TableCell className="text-[12px] font-mono text-white/70">{payment.amount}</TableCell>
                            <TableCell className="text-[12px] font-mono text-white/50">{payment.credits}</TableCell>
                            <TableCell className="text-[12px] font-mono text-white/50">{payment.plan}</TableCell>
                            <TableCell>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-white/20 text-white/80 uppercase tracking-[0.15em]">
                                {payment.status}
                              </span>
                            </TableCell>
                            <TableCell>
                              <button className="venym-btn-secondary">
                                <Download className="h-3 w-3 mr-1.5" />
                                Invoice
                              </button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-12">
                      <Calendar className="h-8 w-8 text-white/30 mx-auto mb-3" />
                      <p className="text-[14px] text-white font-medium">No Payment History</p>
                      <p className="text-[11px] text-white/40 mt-1 font-mono uppercase tracking-[0.15em]">
                        Subscribe to a paid plan to see payments
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="md:hidden space-y-3">
                <div className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 flex items-center gap-2">
                  <Calendar className="h-3 w-3" />
                  Payment History
                </div>
                {paymentHistory.length > 0 ? (
                  paymentHistory.map((payment) => (
                    <div key={payment.id} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded-sm border border-white/20 text-white/80 uppercase tracking-[0.15em]">
                            {payment.status}
                          </span>
                          <span className="text-[13px] font-mono text-white">{payment.id}</span>
                        </div>
                        <button className="text-white/40 hover:text-white p-1">
                          <Download className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-[12px] font-mono">
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Amount</p>
                          <p className="text-white">{payment.amount}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Credits</p>
                          <p className="text-white">{payment.credits}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Plan</p>
                          <p className="text-white capitalize">{payment.plan}</p>
                        </div>
                        <div>
                          <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Date</p>
                          <p className="text-white">{payment.date}</p>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-8 text-center">
                    <Calendar className="h-8 w-8 text-white/30 mx-auto mb-3" />
                    <p className="text-[13px] text-white">No Payment History</p>
                    <p className="text-[11px] text-white/40 mt-1">Subscribe to a paid plan to see payments.</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
