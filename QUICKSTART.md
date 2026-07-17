# ⚡ Quick Start - Wedding RSVP App

## 1️⃣ Clonar/Descargar (Ya Hecho ✅)

Tu proyecto está en: `C:\gcp\wedding-app`

## 2️⃣ Instalar Dependencias (Ya Hecho ✅)

```bash
npm install
```

## 3️⃣ Configurar GCP (⏳ HACER AHORA)

### A. Crear Cuenta de Servicio en GCP

```bash
# Instalar gcloud CLI si no lo tienes
# https://cloud.google.com/sdk/docs/install

# Crear proyecto
gcloud projects create wedding-app

# Habilitar Sheets API
gcloud services enable sheets.googleapis.com

# Crear cuenta de servicio
gcloud iam service-accounts create wedding-app \
  --display-name="Wedding RSVP"

# Crear clave (se descarga automáticamente)
gcloud iam service-accounts keys create key.json \
  --iam-account=wedding-app@PROJECT_ID.iam.gserviceaccount.com
```

### B. Copiar Credenciales

Abre `key.json` y copia los valores de:
- `project_id` → `GCP_PROJECT_ID`
- `private_key_id` → `GCP_PRIVATE_KEY_ID`
- `private_key` → `GCP_PRIVATE_KEY`
- `client_email` → `GCP_CLIENT_EMAIL`
- `client_id` → `GCP_CLIENT_ID`

## 4️⃣ Crear Google Sheet (⏳ HACER AHORA)

1. Ve a [Google Sheets](https://sheets.google.com)
2. Nueva hoja: "Wedding Guests"
3. Primera fila (encabezados):
   ```
   Guest ID | Name | Email | Link | Status | Dietary | Partner | Guests | Comments | Date
   ```
4. Agregar invitados (ej):
   ```
   guest-001 | Juan García | juan@mail.com | https://boda.com/rsvp?guest=guest-001
   guest-002 | María López | maria@mail.com | https://boda.com/rsvp?guest=guest-002
   ```
5. **Compartir con:** `wedding-app@PROJECT_ID.iam.gserviceaccount.com`
6. Copiar ID de la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ID]`

## 5️⃣ Configurar `.env.local` (⏳ HACER AHORA)

```bash
cp .env.example .env.local
```

Edita `.env.local`:

```env
GCP_PROJECT_ID=your-project-id
GCP_PRIVATE_KEY_ID=key-id
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTu-clave-aqui\n-----END PRIVATE KEY-----\n"
GCP_CLIENT_EMAIL=wedding-app@your-project-id.iam.gserviceaccount.com
GCP_CLIENT_ID=your-client-id
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your-sheet-id
NEXT_PUBLIC_GCP_PROJECT_ID=your-project-id
```

## 6️⃣ Ejecutar Localmente

```bash
npm run dev
```

Abre: `http://localhost:3000/rsvp?guest=guest-001`

## 7️⃣ Deploy

### Opción 1: Vercel (Fácil)

```bash
npm install -g vercel
vercel
```

Agrega variables de entorno en Vercel Dashboard.

### Opción 2: GCP Cloud Run

```bash
gcloud run deploy wedding-app --source .
```

---

## 🎨 Personalizar

Edita estos archivos:
- **Colores**: `src/tailwind.config.ts`
- **Textos**: `src/components/*.tsx`
- **Estilos**: `src/app/globals.css`

---

## ❓ Ayuda

Ver detalles completos: [SETUP.md](./SETUP.md)
Ver documentación: [README.md](./README.md)

---

**Estado:** ✅ Proyecto creado y listo
**Próximo paso:** Configurar GCP y Google Sheets
