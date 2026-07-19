import { NextRequest, NextResponse } from 'next/server'
import { getGroupsFromSheets, hashGroupName } from '@/lib/gcp/sheets'
import { SAMPLE_INVITATIONS } from '@/lib/sampleInvitations'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    let groups = []

    try {
      groups = await getGroupsFromSheets()
    } catch (err: any) {
      // Fallback to sample data when Sheets credentials are not configured
      console.warn('Falling back to SAMPLE_INVITATIONS due to error:', err?.message || err)
      // Group sample invitations by their `group` property
      const map: Record<string, any[]> = {}
      for (const s of SAMPLE_INVITATIONS as any[]) {
        const group = s.group || 'Unknown'
        if (!map[group]) map[group] = []
        map[group].push({
          id: s.id,
          name: s.nombre || s.name || '',
          email: s.email || '',
          invitationLink: s.token || s.invitationLink || '',
          rsvpStatus: s.rsvp || 'pendiente',
        })
      }

      groups = Object.keys(map).map((g) => ({
        groupName: g,
        token: hashGroupName(g),
        members: map[g],
      }))
    }

    const match = groups.find((g) => g.token === token || hashGroupName(g.groupName) === token)

    if (!match) {
      return NextResponse.json({ error: 'Group not found' }, { status: 404 })
    }

    return NextResponse.json(match)
  } catch (error) {
    console.error('Error fetching group by token:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
