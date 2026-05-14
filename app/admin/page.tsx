"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Users,
  CreditCard,
  Search,
  MoreHorizontal,
  Database,
  Activity,
  DollarSign,
  Shield,
  RefreshCw,
  Eye,
  Loader2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useUserData } from "@/lib/useUserData"


interface AdminStats {
  overview: {
    totalUsers: number
    activeUsers: number
    totalRequests: number
    totalRevenue: number
    userGrowth: number
    requestGrowth: number
  }
  today: {
    newUsers: number
    requests: number
    creditsUsed: number
  }
  yesterday: {
    newUsers: number
    requests: number
    creditsUsed: number
  }
  planDistribution: Array<{ plan: string; count: number }>
  topUsers: Array<{
    id: string
    email: string
    full_name: string | null
    plan: string
    _count: { api_requests: number }
  }>
  recentActivity: Array<{
    id: string
    endpoint: string
    method: string
    status_code: number
    credits_used: number
    created_at: string
    user: {
      email: string
      full_name: string | null
    }
  }>
}

interface UserData {
  id: string
  email: string
  full_name: string | null
  company: string | null
  role: string
  plan: string
  credits_remaining: number
  created_at: string
  _count: {
    api_requests: number
    api_keys: number
  }
}

export default function AdminDashboard() {
  const { user, isLoaded } = useUser()
  const { userData, loading: userDataLoading } = useUserData()
  const router = useRouter()

  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [users, setUsers] = useState<UserData[]>([])
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [userDetailsOpen, setUserDetailsOpen] = useState(false)
  const [creditAdjustmentOpen, setCreditAdjustmentOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [planFilter, setPlanFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  const [creditAction, setCreditAction] = useState<"add" | "set" | "subtract">("add")
  const [creditAmount, setCreditAmount] = useState("")
  const [creditReason, setCreditReason] = useState("")

  useEffect(() => {
    if (isLoaded && userData) {
      if (userData.role !== 'admin') {
        router.push('/dashboard')
      } else {
        fetchAdminStats()
        fetchUsers()
      }
    }
  }, [isLoaded, userData, router])

  const fetchAdminStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async (page = 1) => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        search: searchQuery,
        plan: planFilter
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setTotalPages(data.pagination.totalPages)
        setCurrentPage(page)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
    }
  }

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedUser(data.user)
        setUserDetailsOpen(true)
      }
    } catch (error) {
      console.error('Failed to fetch user details:', error)
    }
  }

  const handleCreditAdjustment = async () => {
    if (!selectedUser || !creditAmount) return

    try {
      const response = await fetch(`/api/admin/users/${selectedUser.id}/credits`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: creditAction,
          amount: parseInt(creditAmount),
          reason: creditReason
        })
      })

      if (response.ok) {
        const data = await response.json()
        setSelectedUser(data.user)
        setCreditAdjustmentOpen(false)
        setCreditAmount("")
        setCreditReason("")
        fetchUsers(currentPage)
      }
    } catch (error) {
      console.error('Failed to adjust credits:', error)
    }
  }

  const handleUserUpdate = async (userId: string, updates: any) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (response.ok) {
        fetchUsers(currentPage)
        fetchUserDetails(userId)
      }
    } catch (error) {
      console.error('Failed to update user:', error)
    }
  }

  const inputClass =
    "w-full h-10 px-3 bg-white/[0.03] border border-white/[0.08] text-[13px] text-white placeholder:text-white/30 focus:outline-none focus:border-white/20 focus:ring-1 focus:ring-white/20 rounded-sm transition-colors"

  const labelClass =
    "block text-[10px] font-mono uppercase tracking-[0.2em] text-white/30 mb-1.5"

  const statusBadge = (code: number) =>
    code >= 200 && code < 400
      ? "border border-white/20 text-white/80"
      : "border border-white/10 text-white/50"

  if (!isLoaded || userDataLoading || loading) {
    return (
      <div className="min-h-screen bg-[#050505] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-white/40" />
      </div>
    )
  }

  if (userData?.role !== 'admin') {
    return null
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#050505] text-white">
      <header className="sticky top-0 z-50 w-full border-b border-white/[0.06] bg-[#050505]/80 backdrop-blur-xl">
        <div className="flex h-14 items-center px-4 md:px-6 gap-4">
          <Link href="/" className="flex items-center gap-3 shrink-0">
            <div className="w-7 h-7 relative">
              <Image
                src="/venym.png"
                alt="Venym Search"
                width={28}
                height={28}
                className="w-7 h-7"
              />
            </div>
            <span className="font-semibold text-[15px] tracking-tight text-white">
              Venym Search
            </span>
            <span className="hidden sm:inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.2em] text-white/60 border border-white/15 px-2 py-0.5 rounded-sm">
              <Shield className="h-3 w-3" />
              Admin
            </span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-[0.15em] text-white/40 hover:text-white/80 transition-colors border border-white/10 px-3 py-1.5 rounded-sm"
            >
              User Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1 min-w-0 p-4 sm:p-8 pb-12 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="venym-meta mb-3">CLASS :: ADMIN</div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-2">
            Admin Dashboard
          </h1>
          <p className="text-[13px] text-white/50">
            Platform management and analytics.
          </p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-3 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                title: "Total Users",
                value: stats.overview.totalUsers.toLocaleString(),
                change: `${stats.overview.userGrowth > 0 ? '+' : ''}${stats.overview.userGrowth}% today`,
                icon: Users,
              },
              {
                title: "Active Users",
                value: stats.overview.activeUsers.toLocaleString(),
                change: "Last 30 days",
                icon: Activity,
              },
              {
                title: "Total Requests",
                value: stats.overview.totalRequests.toLocaleString(),
                change: `${stats.overview.requestGrowth > 0 ? '+' : ''}${stats.overview.requestGrowth}% today`,
                icon: Database,
              },
              {
                title: "Total Revenue",
                value: `$${(stats.overview.totalRevenue / 100).toLocaleString()}`,
                change: "All time",
                icon: DollarSign,
              },
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
            ))}
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="bg-transparent border-b border-white/[0.06] rounded-none p-0 h-auto w-full justify-start gap-0">
            <TabsTrigger
              value="users"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
            >
              Users
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
            >
              Analytics
            </TabsTrigger>
            <TabsTrigger
              value="activity"
              className="data-[state=active]:bg-transparent data-[state=active]:text-white text-white/40 text-[11px] font-mono uppercase tracking-[0.15em] px-4 py-3 rounded-none border-b-2 border-transparent data-[state=active]:border-white shadow-none"
            >
              Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <div className="space-y-6">
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-5">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto_auto] gap-3 sm:items-end">
                  <div>
                    <label className={labelClass}>Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-white/30" />
                      <input
                        placeholder="Search by email or name"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
                        className={`${inputClass} pl-9`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Plan</label>
                    <Select value={planFilter} onValueChange={(value) => { setPlanFilter(value); fetchUsers() }}>
                      <SelectTrigger className="w-full sm:w-36 h-10 bg-white/[0.03] border-white/[0.08] text-[13px] text-white rounded-sm">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="builder">Builder</SelectItem>
                        <SelectItem value="unicorn">Unicorn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className={labelClass}>&nbsp;</label>
                    <button onClick={() => fetchUsers()} className="venym-btn-secondary h-10">
                      <RefreshCw className="h-3 w-3 mr-1.5" />
                      Refresh
                    </button>
                  </div>
                </div>
              </div>

              <div className="hidden lg:block border border-white/[0.06] bg-white/[0.02] rounded-sm overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/[0.06] hover:bg-transparent">
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">User</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Role</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Plan</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Credits</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Requests</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40">Joined</TableHead>
                      <TableHead className="text-[10px] font-mono uppercase tracking-[0.15em] text-white/40"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((u) => (
                      <TableRow key={u.id} className="border-white/[0.06] hover:bg-white/[0.02]">
                        <TableCell>
                          <p className="text-[13px] text-white">{u.email}</p>
                          {u.full_name && <p className="text-[11px] font-mono text-white/40">{u.full_name}</p>}
                        </TableCell>
                        <TableCell>
                          <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${u.role === 'admin' ? 'border-white/30 text-white' : 'border-white/10 text-white/50'}`}>
                            {u.role}
                          </span>
                        </TableCell>
                        <TableCell>
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/70">
                            {u.plan}
                          </span>
                        </TableCell>
                        <TableCell className="text-[12px] font-mono text-white/70">
                          {u.credits_remaining.toLocaleString()}
                        </TableCell>
                        <TableCell className="text-[12px] font-mono text-white/50">
                          {u._count.api_requests}
                        </TableCell>
                        <TableCell className="text-[12px] font-mono text-white/50">
                          {new Date(u.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="text-white/40 hover:text-white/80 p-1">
                                <MoreHorizontal className="h-4 w-4" />
                              </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                              <DropdownMenuItem onClick={() => fetchUserDetails(u.id)}>
                                <Eye className="h-3.5 w-3.5 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedUser(u); setCreditAdjustmentOpen(true) }}>
                                <CreditCard className="h-3.5 w-3.5 mr-2" />
                                Adjust Credits
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserUpdate(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })}>
                                <Shield className="h-3.5 w-3.5 mr-2" />
                                Toggle Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              <div className="lg:hidden space-y-3">
                {users.map((u) => (
                  <div key={u.id} className="border border-white/[0.06] bg-white/[0.02] rounded-sm p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="min-w-0">
                        <p className="text-[13px] text-white truncate">{u.email}</p>
                        {u.full_name && <p className="text-[11px] font-mono text-white/40 truncate">{u.full_name}</p>}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <button className="text-white/40 hover:text-white/80 p-1">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                          <DropdownMenuItem onClick={() => fetchUserDetails(u.id)}>
                            <Eye className="h-3.5 w-3.5 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => { setSelectedUser(u); setCreditAdjustmentOpen(true) }}>
                            <CreditCard className="h-3.5 w-3.5 mr-2" />
                            Adjust Credits
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUserUpdate(u.id, { role: u.role === 'admin' ? 'user' : 'admin' })}>
                            <Shield className="h-3.5 w-3.5 mr-2" />
                            Toggle Admin
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border ${u.role === 'admin' ? 'border-white/30 text-white' : 'border-white/10 text-white/50'}`}>
                        {u.role}
                      </span>
                      <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/70">
                        {u.plan}
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-[11px] font-mono">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Credits</p>
                        <p className="text-white/70">{u.credits_remaining.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Requests</p>
                        <p className="text-white/70">{u._count.api_requests}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.15em] text-white/30">Joined</p>
                        <p className="text-white/70">{new Date(u.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <p className="text-[11px] font-mono uppercase tracking-[0.15em] text-white/40">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => fetchUsers(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="venym-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => fetchUsers(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="venym-btn-secondary disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {stats && (
              <div className="space-y-6">
                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                  <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <Users className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                      Plan Distribution
                    </span>
                  </div>
                  <div className="p-6 space-y-3">
                    {stats.planDistribution.map((plan) => (
                      <div key={plan.plan} className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3 min-w-0">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/70">
                            {plan.plan}
                          </span>
                          <span className="text-[12px] font-mono text-white/70">{plan.count} users</span>
                        </div>
                        <div className="w-32 sm:w-48 bg-white/[0.04] h-1.5 rounded-sm overflow-hidden">
                          <div
                            className="bg-white/60 h-full"
                            style={{ width: `${(plan.count / Math.max(stats.overview.totalUsers, 1)) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                  <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                    <Activity className="h-3.5 w-3.5 text-white/40" />
                    <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                      Top Users by API Usage
                    </span>
                  </div>
                  <div className="divide-y divide-white/[0.06]">
                    {stats.topUsers.map((u, index) => (
                      <div key={u.id} className="flex items-center justify-between gap-4 px-6 py-3">
                        <div className="flex items-center gap-4 min-w-0">
                          <span className="text-[11px] font-mono text-white/30 w-6">
                            #{index + 1}
                          </span>
                          <div className="min-w-0">
                            <p className="text-[13px] text-white truncate">{u.email}</p>
                            {u.full_name && <p className="text-[11px] font-mono text-white/40 truncate">{u.full_name}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] font-mono uppercase tracking-[0.2em] px-2 py-0.5 rounded-sm border border-white/10 text-white/70 hidden sm:inline-flex">
                            {u.plan}
                          </span>
                          <span className="text-[12px] font-mono text-white/70">{u._count.api_requests} req</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            {stats && (
              <div className="border border-white/[0.06] bg-white/[0.02] rounded-sm">
                <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2">
                  <Activity className="h-3.5 w-3.5 text-white/40" />
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40">
                    Recent API Activity
                  </span>
                </div>
                <div className="divide-y divide-white/[0.06]">
                  {stats.recentActivity.map((activity) => (
                    <div key={activity.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-6 py-3">
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-sm ${statusBadge(activity.status_code)}`}>
                          {activity.status_code}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-mono text-white truncate">{activity.endpoint}</p>
                          <p className="text-[11px] font-mono text-white/40 truncate">
                            {activity.user.full_name || activity.user.email} • {new Date(activity.created_at).toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex sm:flex-col justify-between sm:items-end gap-2 sm:gap-0">
                        <p className="text-[12px] font-mono text-white/70">{activity.credits_used} credits</p>
                        <p className="text-[11px] font-mono text-white/40">{activity.method}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Credit Adjustment Dialog */}
        <Dialog open={creditAdjustmentOpen} onOpenChange={setCreditAdjustmentOpen}>
          <DialogContent className="bg-[#0a0a0a] border-white/[0.08] text-white sm:max-w-[460px]">
            <DialogHeader>
              <DialogTitle className="text-white">Adjust User Credits</DialogTitle>
              <DialogDescription className="text-white/50 text-[12px] font-mono">
                {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div>
                <label className={labelClass}>Action</label>
                <Select value={creditAction} onValueChange={(value: any) => setCreditAction(value)}>
                  <SelectTrigger className="w-full h-10 bg-white/[0.03] border-white/[0.08] text-[13px] text-white rounded-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0a0a0a] border-white/[0.08] text-white">
                    <SelectItem value="add">Add Credits</SelectItem>
                    <SelectItem value="set">Set Credits</SelectItem>
                    <SelectItem value="subtract">Subtract Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className={labelClass}>Amount</label>
                <input
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Reason</label>
                <input
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  placeholder="Optional"
                  className={inputClass}
                />
              </div>
              {selectedUser && (
                <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                  <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/30">Current</span>
                  <span className="text-[13px] font-mono text-white">
                    {selectedUser.credits_remaining.toLocaleString()} credits
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <button onClick={handleCreditAdjustment} className="venym-btn-primary">
                Apply Changes
              </button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}
