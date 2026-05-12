import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Please use subscription plans instead.' },
    { status: 410 }
  )
}

export async function GET() {
  return NextResponse.json(
    { error: 'This endpoint has been deprecated. Please use subscription plans instead.' },
    { status: 410 }
  )
}
