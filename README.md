# Wedding RSVP Application
./scripts/deploy_gcp.sh --region=us-central1 --service=wedding-app-524643745004
Una aplicación web moderna para gestionar confirmaciones de asistencia a tu boda usando Google Sheets como base de datos.

## Características

✅ **Interfaz Personalizada**: Cada invitado ve una página personalizada con su nombre
✅ **Google Sheets Integration**: Los datos se leen y guardan en Google Sheets
✅ **Restricciones Dietéticas**: Los invitados pueden especificar sus preferencias dietéticas
✅ **Comentarios**: Espacio para mensajes personalizados
✅ **Responsive Design**: Funciona perfectamente en móvil, tablet y desktop
✅ **Seguro**: Usa autenticación de Google Cloud

## Tecnologías

- **Frontend**: Next.js 16 + React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Backend**: API Routes de Next.js
- **Database**: Google Sheets
- **Authentication**: Google Cloud Service Account
- **Deployment**: Vercel / GCP Cloud Run

## Requisitos Previos

1. **Cuenta de Google Cloud Platform (GCP)**
2. **Google Sheets**: Una hoja de cálculo con tus invitados
3. **Node.js 20+** y npm/pnpm

## Configuración

### 1. Crear un Proyecto en GCP

```bash
# Crear proyecto
gcloud projects create wedding-app

# Habilitar las APIs necesarias
gcloud services enable sheets.googleapis.com
gcloud services enable cloudresourcemanager.googleapis.com
```

### 2. Crear una Cuenta de Servicio

```bash
# Crear cuenta de servicio
gcloud iam service-accounts create wedding-app \
  --display-name="Wedding App Service Account"

# Crear clave JSON
gcloud iam service-accounts keys create key.json \
  --iam-account=wedding-app@[PROJECT-ID].iam.gserviceaccount.com
```

### 3. Configurar Google Sheets

1. Crea una nueva hoja de cálculo en Google Sheets
2. Comparte la hoja con el email de la cuenta de servicio (`wedding-app@[PROJECT-ID].iam.gserviceaccount.com`)
3. **Estructura de columnas recomendada**:
   - A: ID (identificador único del invitado, ej: guest-001)
   - B: Nombre
   - C: Email
   - D: Enlace de Invitación (ej: `https://tudominio.com/rsvp?guest=guest-001`)
   - E: Estado RSVP (Confirmado/Rechazado)
   - F: Restricciones Dietéticas
   - G: Nombre del Acompañante (opcional)
   - H: Número de Invitados (opcional)
   - I: Comentarios
   - J: Fecha de Envío

### 4. Configurar Variables de Entorno

Copia `.env.example` a `.env.local`:

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus valores:

```env
# GCP Service Account (del archivo key.json)
GCP_PROJECT_ID=your-project-id
GCP_PRIVATE_KEY_ID=your-key-id
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GCP_CLIENT_EMAIL=wedding-app@your-project-id.iam.gserviceaccount.com
GCP_CLIENT_ID=your-client-id

# Google Sheets
NEXT_PUBLIC_GOOGLE_SHEETS_ID=your-spreadsheet-id

# Otros
NEXT_PUBLIC_GCP_PROJECT_ID=your-project-id
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### 5. Instalar Dependencias

```bash
npm install
```

### 6. Ejecutar en Desarrollo

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## URLs de Acceso

Para cada invitado, genera una URL con su ID:

```
https://tudominio.com/rsvp?guest=guest-001
```

Puedes automatizar esto en Google Sheets con una fórmula:

```
=CONCATENATE("https://tudominio.com/rsvp?guest=", A2)
```

## Estructura del Proyecto

```
wedding-app/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes
│   │   ├── rsvp/             # Página de RSVP
│   │   ├── layout.tsx        # Layout principal
│   │   ├── page.tsx          # Home page
│   │   └── globals.css       # Estilos globales
│   ├── components/           # Componentes React
│   │   ├── GuestInfo.tsx
│   │   ├── RSVPForm.tsx
│   │   └── Loading.tsx
│   └── lib/
│       └── gcp/              # Integraciones con GCP
│           ├── sheets.ts     # Google Sheets API
│           └── config.ts     # Configuración GCP
├── public/                   # Archivos estáticos
├── .env.example              # Variables de entorno (ejemplo)
├── next.config.ts            # Configuración de Next.js
├── tailwind.config.ts        # Configuración de Tailwind
└── package.json              # Dependencias
```

## Deployment

### En Vercel (Recomendado)

```bash
vercel env add GCP_PROJECT_ID
vercel env add GCP_PRIVATE_KEY_ID
vercel env add GCP_PRIVATE_KEY
vercel env add GCP_CLIENT_EMAIL
vercel env add GCP_CLIENT_ID
vercel env add NEXT_PUBLIC_GOOGLE_SHEETS_ID

vercel deploy
```

### En GCP Cloud Run

```bash
# Crear Dockerfile (incluir Node.js 20)
# Luego:
gcloud run deploy wedding-app \
  --source . \
  --platform managed \
  --region us-central1 \
  --set-env-vars GCP_PROJECT_ID=... \
  --set-env-vars GCP_PRIVATE_KEY=...
```

## Personalización

### Cambiar Colores

Edita `tailwind.config.ts`:

```typescript
wedding: {
  gold: '#D4AF37',      // Color primario
  ivory: '#FFFFF0',     // Fondo
  burgundy: '#5C0A0A',  // Acentos
}
```

### Traducción

Reemplaza los textos en españoles por tus idiomas preferidos en los componentes.

### Campos Adicionales

Para agregar más campos (ej: número de mesa, restricciones de salud):

1. Agrega las columnas a tu hoja de Google Sheets
2. Actualiza la interfaz de `GuestData` en `sheets.ts`
3. Modifica el formulario en `RSVPForm.tsx`

## Troubleshooting

### Error: "Guest not found"
- Verifica que el ID del invitado coincida exactamente con la columna A en Sheets
- Comprueba la URL: `?guest=guest-001`

### Error: "ENOTFOUND" al conectar a Google Sheets
- Verifica que las credenciales de GCP sean correctas
- Asegúrate de que la cuenta de servicio tiene acceso a la hoja

### Error: "429 Too Many Requests"
- Implementar rate limiting si tienes muchos invitados
- Añadir caché en el servidor

## Soporte

Para más ayuda, consulta:
- [Documentación de Google Sheets API](https://developers.google.com/sheets/api/reference/rest)
- [Documentación de Next.js](https://nextjs.org/docs)
- [Documentación de Google Cloud](https://cloud.google.com/docs)

---

Hecha con ❤️ para tu boda especial

## Añadir columna `Token` en Google Sheets

Si quieres que cada grupo tenga un token determinístico (hash SHA-256 corto del nombre del grupo), tienes dos opciones:

1) Apps Script (fácil, visible en la hoja):

- Abre la hoja → Extensiones → Apps Script
- Crea un nuevo archivo de script y pega el contenido de `scripts/token_apps_script.gs` en este repositorio.
- Guarda. En la hoja añade una columna `Token` y en la primera fila de datos usa la fórmula:

```
=TOKEN_FOR_GROUP(C2)
```

  (donde `C2` es la celda con el nombre del grupo). Arrastra hacia abajo para copiar.

- O corre la función `fillTokenColumn` desde el editor de Apps Script para rellenar automáticamente la columna `Token` (busca la columna `Group`/`Grupo` automáticamente).

2) Desde el servidor (recomendado para migraciones en bloque):

- Ya existe un endpoint en la app que escribe tokens en la hoja: `POST /api/admin/generate-tokens`.
- Requiere credenciales de servicio (las mismas que usa la app para acceder a la hoja). Para ejecutarlo localmente:

```
curl -X POST http://localhost:3000/api/admin/generate-tokens
```

Esto creará la columna `Token` si no existe y escribirá la primera parte del hash (12 hex chars) para cada fila.

Elige Apps Script si prefieres editar la hoja directamente; usa el endpoint si quieres una escritura consistente desde el backend o para migrar datos en bloque.

