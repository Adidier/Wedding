# 📋 Configuración Step-by-Step de Google Cloud Platform

## Paso 1: Instalar gcloud CLI

### En Windows

1. Descarga el instalador: https://cloud.google.com/sdk/docs/install-cloud-sdk
2. Ejecuta el instalador `.exe`
3. Abre PowerShell o Command Prompt
4. Verifica: `gcloud --version`

### En macOS
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

### En Linux
```bash
curl https://sdk.cloud.google.com | bash
exec -l $SHELL
gcloud init
```

---

## Paso 2: Autenticarse en Google Cloud

```powershell
gcloud auth login
```

Se abrirá una ventana del navegador. Inicia sesión con tu cuenta de Google.

---

## Paso 3: Crear Proyecto en GCP

```powershell
# Crear proyecto
gcloud projects create wedding-app --name="Wedding RSVP App"

# Ver proyecto creado
gcloud projects list

# Establecer como proyecto activo
gcloud config set project wedding-app
```

**Anota el Project ID** (ej: `wedding-app-12345`)

---

## Paso 4: Habilitar Google Sheets API

```powershell
gcloud services enable sheets.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

---

## Paso 5: Crear Cuenta de Servicio

```powershell
# Crear cuenta de servicio
gcloud iam service-accounts create wedding-app ^
  --display-name="Wedding RSVP App Service Account" ^
  --description="Service account for wedding RSVP app"

# Otorgar permiso de Editor
gcloud projects add-iam-policy-binding wedding-app ^
  --member="serviceAccount:wedding-app@wedding-app.iam.gserviceaccount.com" ^
  --role="roles/editor"
```

---

## Paso 6: Crear Clave JSON

```powershell
# Crear y descargar clave
gcloud iam service-accounts keys create key.json ^
  --iam-account=wedding-app@wedding-app.iam.gserviceaccount.com
```

Se descargará un archivo `key.json` en la carpeta actual.

---

## Paso 7: Extraer Credenciales del key.json

Abre el archivo `key.json` con un editor de texto y copia:

```json
{
  "type": "service_account",
  "project_id": "wedding-app-xxxx",           ← GCP_PROJECT_ID
  "private_key_id": "xxx...xxx",              ← GCP_PRIVATE_KEY_ID
  "private_key": "-----BEGIN PRIVATE KEY...", ← GCP_PRIVATE_KEY
  "client_email": "wedding-app@...",          ← GCP_CLIENT_EMAIL
  "client_id": "123456789",                   ← GCP_CLIENT_ID
  ...
}
```

---

## Paso 8: Configurar `.env.local`

En tu proyecto (`C:\gcp\wedding-app`), crea `.env.local`:

```bash
cp .env.example .env.local
```

Luego edita con tus valores:

```env
# Copiar de key.json
GCP_PROJECT_ID=wedding-app-xxxxx
GCP_PRIVATE_KEY_ID=abc123def456
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQC...\n-----END PRIVATE KEY-----\n"
GCP_CLIENT_EMAIL=wedding-app@wedding-app.iam.gserviceaccount.com
GCP_CLIENT_ID=123456789
NEXT_PUBLIC_GCP_PROJECT_ID=wedding-app-xxxxx

# Tu hoja de Google Sheets (verás después)
NEXT_PUBLIC_GOOGLE_SHEETS_ID=

# Otros
NEXT_PUBLIC_API_URL=http://localhost:3000
```

**⚠️ IMPORTANTE:** 
- La `private_key` debe tener `\n` para saltos de línea
- No compartas el `.env.local` en Git
- El `.gitignore` ya lo excluye

---

## Paso 9: Crear Google Sheet

1. Ve a [Google Sheets](https://sheets.google.com)
2. Haz click en "Crear" → "Hoja de cálculo en blanco"
3. Nómbrala: "Wedding Guest List"
4. En la primera fila, agrega estos encabezados:

```
A: Guest ID
B: Name
C: Email
D: Invitation Link
E: RSVP Status
F: Dietary Restrictions
G: Partner Name
H: Number of Guests
I: Comments
J: Submitted Date
```

5. Agrega algunos invitados de prueba:

```
Row 2: guest-001 | Juan García | juan@example.com | | | | | | |
Row 3: guest-002 | María López | maria@example.com | | | | | | |
```

6. En la URL de la hoja, copia el ID:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/
   ```

7. Comparte la hoja con el email de la cuenta de servicio:
   - Email: `wedding-app@wedding-app.iam.gserviceaccount.com`
   - Permiso: "Editor"

---

## Paso 10: Actualizar `.env.local` con Sheet ID

Ahora agrega el ID de tu hoja:

```env
NEXT_PUBLIC_GOOGLE_SHEETS_ID=1abc2def3ghi4jkl5mno6pqr7stu8vwx9yza0bcd
```

---

## Paso 11: Probar Localmente

En PowerShell en `C:\gcp\wedding-app`:

```powershell
npm run dev
```

Abre en el navegador:
```
http://localhost:3000
http://localhost:3000/rsvp?guest=guest-001
```

---

## Troubleshooting

### Error: "gcloud: The term 'gcloud' is not recognized"
- Reinicia PowerShell después de instalar gcloud
- O agrega manualmente al PATH

### Error: "Failed to authenticate with Google"
- Verifica que `GCP_PRIVATE_KEY` tenga saltos de línea (`\n`)
- Confirma que compartiste la hoja con `wedding-app@...`

### Error: "spreadsheet not found"
- Verifica que el ID en `NEXT_PUBLIC_GOOGLE_SHEETS_ID` es correcto
- Prueba copiar nuevamente de la URL

### Error: "Permission denied"
- Asegúrate que la cuenta de servicio tiene acceso a la hoja
- Comparte con el correo: `wedding-app@wedding-app.iam.gserviceaccount.com`

---

## Seguridad

⚠️ **IMPORTANTE:**
- Nunca compartas `key.json` o `.env.local`
- Usa variables de entorno seguras en producción (Vercel, GCP)
- Rota las claves periódicamente
- Considera agregar autenticación al admin dashboard

---

## Próximas Steps

1. ✅ Instalar gcloud CLI
2. ✅ Crear proyecto en GCP
3. ✅ Crear cuenta de servicio
4. ✅ Crear Google Sheet
5. ✅ Configurar `.env.local`
6. ⏳ Ejecutar localmente con `npm run dev`
7. ⏳ Generar enlaces para invitados
8. ⏳ Deploy a Vercel o GCP Cloud Run

---

## Comandos Útiles

```powershell
# Ver proyectos
gcloud projects list

# Ver cuentas de servicio
gcloud iam service-accounts list

# Ver claves de cuenta de servicio
gcloud iam service-accounts keys list --iam-account=wedding-app@PROJECT_ID.iam.gserviceaccount.com

# Eliminar clave antigua
gcloud iam service-accounts keys delete KEY_ID --iam-account=wedding-app@PROJECT_ID.iam.gserviceaccount.com
```

---

**¿Necesitas ayuda?**
- [Google Cloud Docs](https://cloud.google.com/docs)
- [gcloud CLI Reference](https://cloud.google.com/cli/docs/reference)
- [Service Account Setup](https://cloud.google.com/iam/docs/creating-managing-service-accounts)
