import { NextRequest, NextResponse } from 'next/server'
import { generateAndWriteTokensToSheet } from '@/lib/gcp/sheets'

export async function POST(request: NextRequest) {
  try {
    const result = await generateAndWriteTokensToSheet()
    return NextResponse.json({ success: true, updated: result.updatedCount })
  } catch (error: any) {
    console.error('Error in generate-tokens API:', error)
    return NextResponse.json({ success: false, error: error?.message || 'Error generating tokens' }, { status: 500 })
  }
}

export async function GET() {
  return NextResponse.json({ status: 'ok', message: 'Use POST to generate tokens' })
}
