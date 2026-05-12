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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  BarChart3,
  Search,
  User,
  MoreHorizontal,
  TrendingUp,
  Database,
  Activity,
  DollarSign,
  Shield,
  Settings,
  RefreshCw,
  Plus,
  Minus,
  Edit,
  Eye,
  AlertCircle,
  CheckCircle,
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
  
  // Credit adjustment state
  const [creditAction, setCreditAction] = useState<"add" | "set" | "subtract">("add")
  const [creditAmount, setCreditAmount] = useState("")
  const [creditReason, setCreditReason] = useState("")

  // Check if user is admin
  useEffect(() => {
    if (isLoaded && userData) {
      console.log('Admin page - User data:', {
        email: userData.email,
        role: userData.role,
        isAdmin: userData.role === 'admin'
      })
      
      if (userData.role !== 'admin') {
        console.log('User is not admin, redirecting to dashboard')
        router.push('/dashboard')
      } else {
        console.log('User is admin, loading admin dashboard')
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

  // Loading state
  if (!isLoaded || userDataLoading || loading) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#efa72d] mx-auto mb-4" />
          <p className="text-[#edf3f1] font-bold">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  // Not admin
  if (userData?.role !== 'admin') {
    return null
  }

  return (
    <div className="min-h-screen bg-[#17457c]">
      {/* Header */}
      <header className="px-4 lg:px-6 h-20 flex items-center border-b-4 border-[#efa72d] bg-[#17457c]">
        <Link href="/" className="flex items-center justify-center">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search Logo"
                width={40}
                height={40}
                className="w-10 h-10 brightness-0 invert"
              />
            </div>
            <span className="font-black text-xl tracking-tight text-[#edf3f1]">VENYM_SEARCH ADMIN</span>
          </div>
        </Link>
        <div className="ml-auto flex items-center gap-4">
          <Badge className="bg-[#efa72d] text-[#17457c] font-black">
            <Shield className="h-4 w-4 mr-2" />
            ADMIN
          </Badge>
          <Link href="/dashboard">
            <Button variant="outline" className="border-[#efa72d] text-[#efa72d] hover:bg-[#efa72d] hover:text-[#17457c] bg-transparent">
              User Dashboard
            </Button>
          </Link>
        </div>
      </header>

      <main className="p-8 bg-[#edf3f1] max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#17457c] mb-2">Admin Dashboard</h1>
          <p className="text-lg font-bold text-[#6b839a]">Platform management and analytics</p>
        </div>

        {/* Stats Overview */}
        {stats && (
          <div className="grid gap-6 mb-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6b839a] mb-1">Total Users</p>
                    <p className="text-3xl font-black text-[#17457c]">{stats.overview.totalUsers.toLocaleString()}</p>
                    <p className={`text-sm font-bold ${stats.overview.userGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.overview.userGrowth > 0 ? '+' : ''}{stats.overview.userGrowth}% today
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#efa72d]">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6b839a] mb-1">Active Users</p>
                    <p className="text-3xl font-black text-[#17457c]">{stats.overview.activeUsers.toLocaleString()}</p>
                    <p className="text-sm font-bold text-[#6b839a]">Last 30 days</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#17457c]">
                    <Activity className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6b839a] mb-1">Total Requests</p>
                    <p className="text-3xl font-black text-[#17457c]">{stats.overview.totalRequests.toLocaleString()}</p>
                    <p className={`text-sm font-bold ${stats.overview.requestGrowth > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {stats.overview.requestGrowth > 0 ? '+' : ''}{stats.overview.requestGrowth}% today
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-green-600">
                    <Database className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-4 border-black shadow-[6px_6px_0px_0px_#000000]">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-bold text-[#6b839a] mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-[#17457c]">${(stats.overview.totalRevenue / 100).toLocaleString()}</p>
                    <p className="text-sm font-bold text-[#6b839a]">All time</p>
                  </div>
                  <div className="p-3 rounded-lg bg-[#6b839a]">
                    <DollarSign className="h-6 w-6 text-white" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Tabs */}
        <Tabs defaultValue="users" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#6b839a] border-4 border-[#efa72d]">
            <TabsTrigger value="users" className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1]">
              Users Management
            </TabsTrigger>
            <TabsTrigger value="analytics" className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1]">
              Analytics
            </TabsTrigger>
            <TabsTrigger value="activity" className="font-black data-[state=active]:bg-[#efa72d] data-[state=active]:text-[#17457c] text-[#edf3f1]">
              Recent Activity
            </TabsTrigger>
          </TabsList>

          <TabsContent value="users" className="mt-6">
            <Card className="border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d]">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-black text-[#17457c]">User Management</CardTitle>
                  <div className="flex gap-4">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#6b839a]" />
                      <Input
                        placeholder="Search users..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && fetchUsers()}
                        className="pl-10 border-2 border-[#6b839a] font-bold"
                      />
                    </div>
                    <Select value={planFilter} onValueChange={(value) => { setPlanFilter(value); fetchUsers() }}>
                      <SelectTrigger className="w-32 border-2 border-[#6b839a] font-bold">
                        <SelectValue placeholder="All Plans" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Plans</SelectItem>
                        <SelectItem value="free">Free</SelectItem>
                        <SelectItem value="starter">Starter</SelectItem>
                        <SelectItem value="builder">Builder</SelectItem>
                        <SelectItem value="unicorn">Unicorn</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button onClick={() => fetchUsers()} className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black">
                      <RefreshCw className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="bg-[#efa72d] hover:bg-[#efa72d]">
                      <TableHead className="font-black text-[#17457c]">User</TableHead>
                      <TableHead className="font-black text-[#17457c]">Role</TableHead>
                      <TableHead className="font-black text-[#17457c]">Plan</TableHead>
                      <TableHead className="font-black text-[#17457c]">Credits</TableHead>
                      <TableHead className="font-black text-[#17457c]">API Requests</TableHead>
                      <TableHead className="font-black text-[#17457c]">Joined</TableHead>
                      <TableHead className="font-black text-[#17457c]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id} className="hover:bg-gray-50">
                        <TableCell>
                          <div>
                            <p className="font-bold text-[#17457c]">{user.email}</p>
                            {user.full_name && <p className="text-sm text-[#6b839a]">{user.full_name}</p>}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge className={user.role === 'admin' ? 'bg-[#efa72d] text-[#17457c]' : 'bg-[#6b839a] text-white'}>
                            {user.role.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge className="bg-[#17457c] text-white">
                            {user.plan.toUpperCase()}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-bold text-[#17457c]">
                          {user.credits_remaining.toLocaleString()}
                        </TableCell>
                        <TableCell className="font-bold text-[#6b839a]">
                          {user._count.api_requests}
                        </TableCell>
                        <TableCell className="text-sm text-[#6b839a]">
                          {new Date(user.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => fetchUserDetails(user.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => { setSelectedUser(user); setCreditAdjustmentOpen(true) }}>
                                <CreditCard className="h-4 w-4 mr-2" />
                                Adjust Credits
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUserUpdate(user.id, { role: user.role === 'admin' ? 'user' : 'admin' })}>
                                <Shield className="h-4 w-4 mr-2" />
                                Toggle Admin
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                
                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-[#6b839a] font-bold">
                    Page {currentPage} of {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => fetchUsers(currentPage - 1)}
                      disabled={currentPage === 1}
                      variant="outline"
                      className="border-[#17457c] text-[#17457c]"
                    >
                      Previous
                    </Button>
                    <Button
                      onClick={() => fetchUsers(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      variant="outline"
                      className="border-[#17457c] text-[#17457c]"
                    >
                      Next
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            {stats && (
              <div className="grid gap-6">
                <Card className="border-4 border-[#6b839a] shadow-[8px_8px_0px_0px_#6b839a]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-[#17457c]">Plan Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {stats.planDistribution.map((plan) => (
                        <div key={plan.plan} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-[#6b839a]">
                          <div className="flex items-center gap-4">
                            <Badge className="bg-[#17457c] text-white font-black">
                              {plan.plan.toUpperCase()}
                            </Badge>
                            <span className="font-bold text-[#17457c]">{plan.count} users</span>
                          </div>
                          <div className="w-48 bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-[#efa72d] h-4 rounded-full"
                              style={{ width: `${(plan.count / stats.overview.totalUsers) * 100}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-4 border-[#6b839a] shadow-[8px_8px_0px_0px_#6b839a]">
                  <CardHeader>
                    <CardTitle className="text-2xl font-black text-[#17457c]">Top Users by API Usage</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {stats.topUsers.map((user, index) => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-[#6b839a]">
                          <div className="flex items-center gap-4">
                            <span className="font-black text-2xl text-[#efa72d]">#{index + 1}</span>
                            <div>
                              <p className="font-bold text-[#17457c]">{user.email}</p>
                              {user.full_name && <p className="text-sm text-[#6b839a]">{user.full_name}</p>}
                            </div>
                          </div>
                          <div className="flex items-center gap-4">
                            <Badge className="bg-[#17457c] text-white">{user.plan.toUpperCase()}</Badge>
                            <span className="font-black text-[#17457c]">{user._count.api_requests} requests</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          <TabsContent value="activity" className="mt-6">
            {stats && (
              <Card className="border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-[#17457c]">Recent API Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {stats.recentActivity.map((activity) => (
                      <div key={activity.id} className="flex items-center justify-between p-4 bg-white rounded-lg border-2 border-[#6b839a]">
                        <div className="flex items-center gap-4">
                          <Badge className={`${activity.status_code < 400 ? 'bg-green-600' : 'bg-red-600'} text-white`}>
                            {activity.status_code}
                          </Badge>
                          <div>
                            <p className="font-bold text-[#17457c]">{activity.endpoint}</p>
                            <p className="text-sm text-[#6b839a]">
                              {activity.user.full_name || activity.user.email} • {new Date(activity.created_at).toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-black text-[#17457c]">{activity.credits_used} credits</p>
                          <p className="text-sm font-bold text-[#6b839a]">{activity.method}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        {/* Credit Adjustment Dialog */}
        <Dialog open={creditAdjustmentOpen} onOpenChange={setCreditAdjustmentOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Adjust User Credits</DialogTitle>
              <DialogDescription>
                Modify credits for {selectedUser?.email}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="action" className="text-right">
                  Action
                </Label>
                <Select value={creditAction} onValueChange={(value: any) => setCreditAction(value)}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="add">Add Credits</SelectItem>
                    <SelectItem value="set">Set Credits</SelectItem>
                    <SelectItem value="subtract">Subtract Credits</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="amount" className="text-right">
                  Amount
                </Label>
                <Input
                  id="amount"
                  type="number"
                  value={creditAmount}
                  onChange={(e) => setCreditAmount(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reason" className="text-right">
                  Reason
                </Label>
                <Input
                  id="reason"
                  value={creditReason}
                  onChange={(e) => setCreditReason(e.target.value)}
                  className="col-span-3"
                  placeholder="Optional"
                />
              </div>
              {selectedUser && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label className="text-right">Current</Label>
                  <span className="col-span-3 font-bold">
                    {selectedUser.credits_remaining.toLocaleString()} credits
                  </span>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleCreditAdjustment} className="bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black">
                Apply Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  )
}