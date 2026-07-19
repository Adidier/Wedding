import { google } from 'googleapis'
import { JWT } from 'google-auth-library'
import crypto from 'crypto'
import fetch from 'node-fetch'

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

// Get JWT client for service account
function getJWTClient() {
  const serviceAccountKey = {
    type: 'service_account',
    project_id: process.env.GCP_PROJECT_ID,
    private_key_id: process.env.GCP_PRIVATE_KEY_ID,
    private_key: process.env.GCP_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GCP_CLIENT_EMAIL,
    client_id: process.env.GCP_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
  }

  return new JWT({
    email: serviceAccountKey.client_email,
    key: serviceAccountKey.private_key,
    scopes: SCOPES,
  })
}

// Get Google Sheets API instance
async function getSheetsAPI() {
  const auth = getJWTClient()
  return google.sheets({ version: 'v4', auth })
}

// When credentials are not available but the spreadsheet is public, fetch using the public gviz endpoint
async function fetchPublicSheetAsRows(sheetName: string) {
  if (!SHEET_ID) throw new Error('SHEET_ID not configured')
  const url = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:json&sheet=${encodeURIComponent(sheetName)}`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch public sheet')
  const text = await res.text()
  // Response is like:  /*O_o*/
  // google.visualization.Query.setResponse({...});
  const jsonTextMatch = text.match(/google\.visualization\.Query\.setResponse\((.*)\);/s)
  if (!jsonTextMatch) throw new Error('Unexpected gviz response')
  const json = JSON.parse(jsonTextMatch[1])
  const table = json.table
  const cols = table.cols.map((c: any) => (c.label || '').toString())
  const rows = table.rows.map((r: any) => r.c.map((cell: any) => (cell && cell.v !== undefined) ? String(cell.v) : ''))
  // return as array with header first
  return [cols, ...rows]
}

interface GuestData {
  id: string
  name: string
  email: string
  invitationLink: string
  rsvpStatus?: string
  dietaryRestrictions?: string
  partnerName?: string
  numberOfGuests?: number
}

interface RSVPData {
  attendance: boolean
  dietaryRestrictions?: string
  comments?: string
  submittedAt: string
}

const SHEET_ID = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID || ''
const SHEET_NAME = 'Guests'

export async function getGuestFromSheets(guestId: string): Promise<GuestData | null> {
  try {
    let rows: any[] = []
    try {
      const sheets = await getSheetsAPI()
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${SHEET_NAME}!A:H` })
      rows = response.data.values || []
    } catch (err) {
      // Try public fetch if sheet is shared publicly
      try {
        const fetched = await fetchPublicSheetAsRows(SHEET_NAME)
        rows = fetched
      } catch (err2) {
        throw err // rethrow original to be handled below
      }
    }
    
    // Skip header row (row 0) and find the guest
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row[0] === guestId) {
        return {
          id: row[0],
          name: row[1] || '',
          email: row[2] || '',
          invitationLink: row[3] || '',
          rsvpStatus: row[4] || '',
          dietaryRestrictions: row[5] || '',
          partnerName: row[6] || '',
          numberOfGuests: row[7] ? parseInt(row[7]) : undefined,
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching guest from sheets:', error)
    throw error
  }
}

export async function updateGuestRSVP(guestId: string, rsvpData: RSVPData): Promise<boolean> {
  try {
    const sheets = await getSheetsAPI()

    // Read all data to find the row index
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    })

    const rows = response.data.values || []
    let rowIndex = -1

    // Find the guest row (skip header)
    for (let i = 1; i < rows.length; i++) {
      if (rows[i][0] === guestId) {
        rowIndex = i
        break
      }
    }

    if (rowIndex === -1) {
      console.error('Guest not found')
      return false
    }

    // Update the sheet with RSVP data
    // Assuming columns: A-ID, B-Name, C-Email, D-Link, E-Status, F-Dietary, G-Partner, H-Guests, I-Comments, J-Submitted
    const updateRange = `${SHEET_NAME}!E${rowIndex + 1}:J${rowIndex + 1}`
    
    const status = rsvpData.attendance ? 'Confirmado' : 'Rechazado'
    // Use friendly, user-visible status text
    const statusText = rsvpData.attendance ? 'Voy a asistir!' : 'No podré asistir'
    
    const updateValues = [[
      statusText,
      rsvpData.dietaryRestrictions || '',
      '', // Partner name (keep existing)
      '', // Number of guests (keep existing)
      rsvpData.comments || '',
      rsvpData.submittedAt,
    ]]

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: updateRange,
      valueInputOption: 'RAW',
      requestBody: {
        values: updateValues,
      },
    })

    return true
  } catch (error) {
    console.error('Error updating guest RSVP:', error)
    throw error
  }
}

export async function getAllGuests(): Promise<GuestData[]> {
  try {
    let rows: any[] = []
    try {
      const sheets = await getSheetsAPI()
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${SHEET_NAME}!A:H` })
      rows = response.data.values || []
    } catch (err) {
      const fetched = await fetchPublicSheetAsRows(SHEET_NAME)
      rows = fetched
    }
    const guests: GuestData[] = []

    // Skip header row
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      if (row[0]) {
        guests.push({
          id: row[0],
          name: row[1] || '',
          email: row[2] || '',
          invitationLink: row[3] || '',
          rsvpStatus: row[4] || '',
          dietaryRestrictions: row[5] || '',
          partnerName: row[6] || '',
          numberOfGuests: row[7] ? parseInt(row[7]) : undefined,
        })
      }
    }

    return guests
  } catch (error) {
    console.error('Error fetching guests from sheets:', error)
    throw error
  }
}

// Utility: deterministic short hash for a group name
export function hashGroupName(name: string) {
  const h = crypto.createHash('sha256').update(name || '').digest('hex')
  // return a short, URL-safe token (first 12 hex chars)
  return h.slice(0, 12)
}

// Read sheet and group rows by group/family name
export async function getGroupsFromSheets(): Promise<{
  groupName: string
  token: string
  members: GuestData[]
}[]> {
  try {
    let rows: any[] = []
    try {
      const sheets = await getSheetsAPI()
      const response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${SHEET_NAME}!A:Z` })
      rows = response.data.values || []
    } catch (err) {
      // Try public fetch as fallback
      rows = await fetchPublicSheetAsRows(SHEET_NAME)
    }
    if (rows.length === 0) return []

    const header = rows[0].map((h: string) => (h || '').toString().toLowerCase())

    const idx = (names: string[]) => {
      for (const n of names) {
        const i = header.indexOf(n)
        if (i !== -1) return i
      }
      return -1
    }

    const idCol = idx(['id', 'identificador'])
    const nameCol = idx(['nombre', 'name', 'individuo', 'individuo'])
    const emailCol = idx(['email', 'correo', 'correo electrónico', 'correo_electronico'])
    const linkCol = idx(['link', 'invitationlink', 'enlace', 'token'])
    const statusCol = idx(['rsvp', 'status', 'estado', 'confirmado'])
    const dietaryCol = idx(['dietary', 'dietario', 'restricciones', 'notas'])
    const groupCol = idx(['grupo', 'group', 'familia', 'family'])

    const groupsMap: Record<string, GuestData[]> = {}

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const groupName = groupCol !== -1 ? ((row[groupCol] || '')).toString() : ''
      const id = idCol !== -1 ? ((row[idCol] || '')).toString() : `row-${i}`
      const name = nameCol !== -1 ? ((row[nameCol] || '')).toString() : ''
      const email = emailCol !== -1 ? ((row[emailCol] || '')).toString() : ''
      // If there's a Token column, treat it as the invitation link/token
      const invitationLink = linkCol !== -1 ? ((row[linkCol] || '')).toString() : ''
      const rsvpStatus = statusCol !== -1 ? (row[statusCol] || '').toString() : ''
      const dietaryRestrictions = dietaryCol !== -1 ? (row[dietaryCol] || '').toString() : ''

      const member: GuestData = {
        id,
        name,
        email,
        invitationLink,
        rsvpStatus,
        dietaryRestrictions,
      }

      const key = groupName || 'Unknown'
      if (!groupsMap[key]) groupsMap[key] = []
      groupsMap[key].push(member)
    }

    // convert to array with tokens
    const groups = Object.keys(groupsMap).map((g) => ({
      groupName: g,
      token: hashGroupName(g),
      members: groupsMap[g],
    }))

    return groups
  } catch (error) {
    console.error('Error fetching groups from sheets:', error)
    throw error
  }
}

// Update or create a Groups summary sheet row for a given token.
export async function updateGroupSummary(token: string): Promise<boolean> {
  try {
    const groups = await getGroupsFromSheets()
    const group = groups.find((g) => g.token === token)
    if (!group) {
      console.warn('Group not found for token', token)
      return false
    }

    // Build summary strings
    const confirmedEntries: string[] = []
    const commentsEntries: string[] = []
    for (const m of group.members) {
      const status = (m.rsvpStatus || '').toLowerCase()
      const isConfirmed = status.includes('confirm') || status.includes('confirmado') || status.includes('sí') || status.includes('si')
      const entry = `${m.name} - ${isConfirmed ? 'Sí' : 'No'}`
      confirmedEntries.push(entry)
      if (m.dietaryRestrictions) {
        commentsEntries.push(`${m.name}: ${m.dietaryRestrictions}`)
      }
    }

    const confirmedText = confirmedEntries.join('; ')
    const commentsText = commentsEntries.join('; ')
    const updatedAt = new Date().toISOString()

    const sheets = await getSheetsAPI()

    // Ensure Groups sheet exists; we'll write columns: Group, Token, ConfirmedMembers, Comments, LastUpdated
    const GROUP_SHEET = 'Groups'
    // Read header (if sheet empty this will throw or return empty)
    let response
    try {
      response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${GROUP_SHEET}!A1:E1` })
    } catch (e) {
      // Create header row
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${GROUP_SHEET}!A1:E1`,
        valueInputOption: 'RAW',
        requestBody: { values: [[ 'Group', 'Token', 'ConfirmedMembers', 'Comments', 'LastUpdated' ]] },
      })
      response = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${GROUP_SHEET}!A1:E1` })
    }

    // Read existing rows to find if token already present
    const allRowsRes = await sheets.spreadsheets.values.get({ spreadsheetId: SHEET_ID, range: `${GROUP_SHEET}!A2:E` })
    const rows = allRowsRes.data.values || []
    let rowIndex = -1
    for (let i = 0; i < rows.length; i++) {
      const r = rows[i]
      if ((r[1] || '') === token) { rowIndex = i + 2; break }
    }

    const values = [[ group.groupName, token, confirmedText, commentsText, updatedAt ]]
    if (rowIndex === -1) {
      // Append new row at the end
      const appendRes = await sheets.spreadsheets.values.append({
        spreadsheetId: SHEET_ID,
        range: `${GROUP_SHEET}!A:E`,
        valueInputOption: 'RAW',
        insertDataOption: 'INSERT_ROWS',
        requestBody: { values },
      })
      return !!appendRes
    } else {
      // Update existing row
      const range = `${GROUP_SHEET}!A${rowIndex}:E${rowIndex}`
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range,
        valueInputOption: 'RAW',
        requestBody: { values },
      })
      return true
    }
  } catch (error) {
    console.error('Error updating group summary:', error)
    throw error
  }
}

// Generate deterministic tokens per row (based on group/family) and write them
// into a `Token` column in the sheet. Returns number of rows updated (excluding header).
export async function generateAndWriteTokensToSheet(): Promise<{ updatedCount: number }> {
  try {
    const sheets = await getSheetsAPI()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
    })

    const rows = response.data.values || []
    if (rows.length === 0) return { updatedCount: 0 }

    const header = rows[0].map((h: string) => (h || '').toString())

    const idx = (names: string[]) => {
      for (const n of names) {
        const i = header.map((h) => (h || '').toString().toLowerCase()).indexOf(n)
        if (i !== -1) return i
      }
      return -1
    }

    const groupCol = idx(['grupo', 'group', 'familia', 'family'])

    // Find existing token column or append a new one
    let tokenCol = idx(['token', 'token id', 'token_id', 'tokenid'])
    if (tokenCol === -1) {
      tokenCol = header.length
      header.push('Token')
      // Write updated header back
      const lastCol = colLetter(header.length - 1)
      await sheets.spreadsheets.values.update({
        spreadsheetId: SHEET_ID,
        range: `${SHEET_NAME}!A1:${lastCol}1`,
        valueInputOption: 'RAW',
        requestBody: { values: [header] },
      })
    }

    // Build token column values (including header)
    const values: string[][] = []
    values.push([header[tokenCol] || 'Token'])

    for (let i = 1; i < rows.length; i++) {
      const row = rows[i]
      const groupName = groupCol !== -1 ? (row[groupCol] || '').toString() : ''
      const key = groupName || 'Unknown'
      const token = hashGroupName(key)
      values.push([token])
    }

    const lastRow = rows.length
    const col = colLetter(tokenCol)
    const range = `${SHEET_NAME}!${col}1:${col}${lastRow}`

    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range,
      valueInputOption: 'RAW',
      requestBody: { values },
    })

    return { updatedCount: rows.length - 1 }
  } catch (error) {
    console.error('Error generating/writing tokens to sheet:', error)
    throw error
  }
}

// Helper: convert 0-based column index to A..Z..AA
function colLetter(n: number) {
  let s = ''
  let x = n
  while (x >= 0) {
    s = String.fromCharCode((x % 26) + 65) + s
    x = Math.floor(x / 26) - 1
  }
  return s
}
