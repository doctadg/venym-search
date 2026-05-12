'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSignIn, useUser } from '@clerk/nextjs'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LoginPage() {
  const { isLoaded, signIn, setActive } = useSignIn()
  const { user } = useUser()
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!isLoaded || !signIn) return

    setError('')
    setLoading(true)

    try {
      // Start the sign-in process using the email and password provided
      const signInAttempt = await signIn.create({
        identifier: email,
        password,
      })

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === 'complete') {
        await setActive({ session: signInAttempt.createdSessionId })
        
        // Sync user with our database
        await fetch('/api/auth/sync-user', {
          method: 'POST'
        })
        
        router.push('/dashboard')
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setError('Sign-in incomplete. Please check your credentials.')
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more on error handling
      setError(err?.errors?.[0]?.message || 'An error occurred during sign-in')
    } finally {
      setLoading(false)
    }
  }

  // Show loading while Clerk loads
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#17457c] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#efa72d]" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#17457c] flex flex-col">
      {/* Header */}
      <header className="px-4 lg:px-6 h-16 flex items-center border-b-4 border-[#efa72d]">
        <Link href="/" className="flex items-center gap-2 text-[#edf3f1] hover:text-[#efa72d] transition-colors">
          <ArrowLeft className="h-5 w-5" />
          <span className="font-bold">Back to Home</span>
        </Link>
        <Link href="/" className="flex items-center justify-center mx-auto">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 relative">
              <Image
                src="/VENYM_SEARCH-logo.png"
                alt="Venym Search Logo"
                width={32}
                height={32}
                className="w-8 h-8 brightness-0 invert"
              />
            </div>
            <span className="font-black text-lg tracking-tight text-[#edf3f1]">VENYM_SEARCH</span>
          </div>
        </Link>
        <div className="w-24"></div> {/* Spacer for centering */}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md border-4 border-[#efa72d] shadow-[8px_8px_0px_0px_#efa72d] bg-[#edf3f1]">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-black text-[#17457c]">Welcome Back</CardTitle>
            <p className="text-[#6b839a] font-bold">Sign in to your Venym Search account</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="font-black text-[#17457c]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="border-2 border-[#6b839a] font-bold min-h-[44px]"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="font-black text-[#17457c]">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border-2 border-[#6b839a] font-bold min-h-[44px]"
                  required
                />
              </div>

              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border-2 border-red-500 rounded">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-700 font-bold text-sm">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-[#efa72d] hover:bg-[#d4941f] text-[#17457c] font-black border-2 border-black shadow-[2px_2px_0px_0px_#000000] disabled:opacity-50 min-h-[44px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>

              <div className="text-center pt-4 border-t-2 border-[#6b839a]">
                <p className="text-[#6b839a] font-bold">
                  Don't have an account?{' '}
                  <Link href="/signup" className="text-[#17457c] font-black hover:text-[#efa72d] transition-colors">
                    Sign up here
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}