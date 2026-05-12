'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AuthSuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!sessionId) {
      setStatus('error')
      setMessage('Missing session information')
      return
    }

    // Verify payment and create account
    const verifyPayment = async () => {
      try {
        const response = await fetch('/api/auth/verify-payment', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ session_id: sessionId }),
        })

        const data = await response.json()

        if (response.ok) {
          // Store auth data and redirect
          localStorage.setItem('auth_token', data.token)
          localStorage.setItem('user_data', JSON.stringify(data.user))
          
          setStatus('success')
          setMessage('Account created successfully! Redirecting to dashboard...')
          
          setTimeout(() => {
            router.push('/dashboard')
            window.location.reload()
          }, 3000)
        } else {
          setStatus('error')
          setMessage(data.error || 'Failed to verify payment')
        }
      } catch (error) {
        setStatus('error')
        setMessage('An unexpected error occurred')
      }
    }

    verifyPayment()
  }, [sessionId, router])

  return (
    <div className="min-h-screen bg-[#17457c] flex items-center justify-center p-4">
      <Card className="w-full max-w-md border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] bg-[#edf3f1]">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-black text-[#17457c]">
            Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-[#17457c] mx-auto" />
              <p className="font-bold text-[#6b839a]">
                Verifying your payment and creating your account...
              </p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <CheckCircle className="h-12 w-12 text-green-600 mx-auto" />
              <p className="font-bold text-green-700">{message}</p>
            </>
          )}
          
          {status === 'error' && (
            <>
              <AlertCircle className="h-12 w-12 text-red-600 mx-auto" />
              <p className="font-bold text-red-700 mb-4">{message}</p>
              <Link
                href="/signup"
                className="inline-block bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black px-4 py-2 rounded border-2 border-black shadow-[2px_2px_0px_0px_#000000] transition-colors"
              >
                Try Again
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}