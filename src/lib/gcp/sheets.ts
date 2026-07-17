import { google } from 'googleapis'
import { JWT } from 'google-auth-library'

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
    const sheets = await getSheetsAPI()

    // Read all data from the sheet
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:H`, // Columns: ID, Name, Email, Link, Status, Dietary, Partner, Guests
    })

    const rows = response.data.values || []
    
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
    
    const updateValues = [[
      status,
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
    const sheets = await getSheetsAPI()

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A:H`,
    })

    const rows = response.data.values || []
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
