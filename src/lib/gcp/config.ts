// GCP helper functions for authentication and config
export const getGCPConfig = () => {
  return {
    projectId: process.env.NEXT_PUBLIC_GCP_PROJECT_ID,
    sheetsId: process.env.NEXT_PUBLIC_GOOGLE_SHEETS_ID,
  }
}

export const validateGCPCredentials = () => {
  const requiredEnvVars = [
    'GCP_PROJECT_ID',
    'GCP_PRIVATE_KEY_ID',
    'GCP_PRIVATE_KEY',
    'GCP_CLIENT_EMAIL',
    'GCP_CLIENT_ID',
    'NEXT_PUBLIC_GOOGLE_SHEETS_ID',
  ]

  const missing = requiredEnvVars.filter((env) => !process.env[env])

  if (missing.length > 0) {
    throw new Error(`Missing required GCP environment variables: ${missing.join(', ')}`)
  }
}
