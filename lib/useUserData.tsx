'use client'

import { useState, useEffect } from 'react'
import { useUser } from '@clerk/nextjs'

interface UserData {
  id: string
  email: string
  full_name?: string
  role?: string
  plan: string
  credits_remaining: number
  company?: string
}

interface UseUserDataReturn {
  userData: UserData | null
  loading: boolean
  error: string | null
  refreshUserData: () => Promise<void>
}

export function useUserData(): UseUserDataReturn {
  const { user, isLoaded } = useUser()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    if (!user || !isLoaded) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/auth/me')
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data')
      }

      const data = await response.json()
      setUserData(data.user)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
      setUserData(null)
    } finally {
      setLoading(false)
    }
  }

  const refreshUserData = async () => {
    await fetchUserData()
  }

  useEffect(() => {
    fetchUserData()
  }, [user, isLoaded])

  return {
    userData,
    loading,
    error,
    refreshUserData
  }
}