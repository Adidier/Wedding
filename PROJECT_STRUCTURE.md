# 📁 Estructura Completa del Proyecto

```
wedding-app/
│
├── 📄 Archivos de Configuración
│   ├── package.json              # Dependencias del proyecto
│   ├── tsconfig.json             # Configuración de TypeScript
│   ├── next.config.ts            # Configuración de Next.js
│   ├── tailwind.config.ts        # Configuración de Tailwind CSS
│   ├── postcss.config.mjs        # Configuración de PostCSS
│   ├── eslint.config.mjs         # Configuración de ESLint
│   ├── .gitignore                # Archivos ignorados por Git
│   └── .env.example              # Variables de entorno (plantilla)
│
├── 📖 Documentación
│   ├── README.md                 # Documentación completa
│   ├── SETUP.md                  # Guía detallada de configuración
│   ├── QUICKSTART.md             # Inicio rápido
│   ├── GCP_SETUP.md              # Guía paso-a-paso para GCP
│   └── PROJECT_STRUCTURE.md      # Este archivo
│
├── 📂 src/
│   │
│   ├── 📂 app/
│   │   ├── 📂 api/
│   │   │   ├── 📂 guests/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── route.ts          # GET: Obtener datos del invitado
│   │   │   │   │   └── rsvp/
│   │   │   │   │       └── route.ts      # POST: Guardar RSVP
│   │   │   │   └── (otros endpoints)
│   │   │   │
│   │   │   └── 📂 admin/
│   │   │       └── guests/
│   │   │           └── route.ts          # GET: Lista de invitados (admin)
│   │   │
│   │   ├── 📂 rsvp/
│   │   │   └── page.tsx                  # Página de confirmación RSVP
│   │   │
│   │   ├── 📂 admin/
│   │   │   └── page.tsx                  # Dashboard de admin
│   │   │
│   │   ├── layout.tsx                    # Layout principal
│   │   ├── page.tsx                      # Home page
│   │   └── globals.css                   # Estilos globales
│   │
│   ├── 📂 components/
│   │   ├── RSVPForm.tsx                  # Formulario de RSVP
│   │   │   └── Features:
│   │   │       ├── Opción: Asistirá/No asistirá
│   │   │       ├── Restricciones dietéticas
│   │   │       ├── Comentarios adicionales
│   │   │       └── Validación y envío
│   │   │
│   │   ├── GuestInfo.tsx                 # Información del invitado
│   │   │   └── Features:
│   │   │       ├── Nombre
│   │   │       ├── Email
│   │   │       ├── Acompañante (opcional)
│   │   │       └── Número de invitados
│   │   │
│   │   └── Loading.tsx                   # Componente de carga
│   │
│   └── 📂 lib/
│       └── 📂 gcp/
│           ├── sheets.ts                 # Integración con Google Sheets API
│           │   └── Funciones:
│           │       ├── getGuestFromSheets()      # Leer datos del invitado
│           │       ├── updateGuestRSVP()         # Actualizar RSVP
│           │       └── getAllGuests()            # Obtener todos los invitados
│           │
│           └── config.ts                 # Configuración de GCP
│               └── Funciones:
│                   ├── getGCPConfig()
│                   └── validateGCPCredentials()
│
├── 📂 public/
│   └── (Archivos estáticos: imágenes, favicons, etc.)
│
├── 📂 scripts/
│   ├── generate-links.js                 # Generador de enlaces (Node.js)
│   └── generate-links.ps1                # Generador de enlaces (PowerShell)
│
└── 📂 node_modules/                      # Dependencias instaladas (427 paquetes)
```

## 🔄 Flujo de Datos

```
┌─────────────────────────────────────────────────────────────┐
│                     Invitado                               │
│              (accede por enlace único)                      │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
        ┌────────────────────────────┐
        │  http://localhost:3000/rsvp│
        │  ?guest=guest-001          │
        └────────────┬───────────────┘
                     │
                     ▼
        ┌──────────────────────┐
        │  /rsvp/page.tsx      │
        │  (React Component)   │
        └────────┬─────────────┘
                 │
        ┌────────▼────────────────┐
        │  useEffect: fetch guest │
        │  GET /api/guests/:id    │
        └────────┬────────────────┘
                 │
                 ▼
      ┌──────────────────────┐
      │ Backend API Route    │
      │ /api/guests/[id]/    │
      │ (route.ts)           │
      └───────┬──────────────┘
              │
              ▼
    ┌─────────────────────┐
    │ getGuestFromSheets()│
    │ (sheets.ts)         │
    └────────┬────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Google Sheets API    │
    │ (Lee datos)          │
    └────────┬─────────────┘
             │
             ▼
    ┌──────────────────────┐
    │ Google Sheets        │
    │ (Base de datos)      │
    └──────────────────────┘
```

**Luego el invitado completa el formulario:**

```
┌─────────────────────────────────┐
│    Formulario RSVP              │
│  ✓ Asistencia                   │
│  ✓ Restricciones dietéticas    │
│  ✓ Comentarios                  │
└────────────┬────────────────────┘
             │
             ▼
  ┌────────────────────────┐
  │ Submit Form            │
  │ POST /api/guests/:id/  │
  │ /rsvp                  │
  └────────┬───────────────┘
           │
           ▼
  ┌─────────────────────────┐
  │ Backend API Route       │
  │ /api/guests/[id]/rsvp   │
  │ (route.ts)              │
  └────────┬────────────────┘
           │
           ▼
  ┌──────────────────────────┐
  │ updateGuestRSVP()        │
  │ (sheets.ts)              │
  └────────┬─────────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Google Sheets API    │
  │ (Escribe datos)      │
  └────────┬─────────────┘
           │
           ▼
  ┌──────────────────────┐
  │ Google Sheets        │
  │ (Actualiza registro) │
  └──────────────────────┘
```

## 🎯 Características por Módulo

### Frontend (`src/components/`)
- **RSVPForm**: Formulario interactivo con validación
- **GuestInfo**: Muestra datos personalizados del invitado
- **Loading**: Indicador de carga mientras se obtienen datos

### Backend (`src/app/api/`)
- **GET /api/guests/[id]**: Obtiene datos del invitado desde Google Sheets
- **POST /api/guests/[id]/rsvp**: Guarda la respuesta en Google Sheets
- **GET /api/admin/guests**: Lista todos los invitados (para dashboard)

### Integración GCP (`src/lib/gcp/`)
- **sheets.ts**: Funciones para leer/escribir en Google Sheets
- **config.ts**: Configuración de credenciales de GCP

### Páginas (`src/app/`)
- **/ (page.tsx)**: Página de inicio
- **/rsvp (rsvp/page.tsx)**: Página de RSVP del invitado
- **/admin (admin/page.tsx)**: Dashboard de administrador

## 📊 Google Sheets Structure

```
Columna | Header               | Contenido
--------|----------------------|--------
   A    | Guest ID             | guest-001, guest-002, ...
   B    | Name                 | Nombre del invitado
   C    | Email                | correo@ejemplo.com
   D    | Invitation Link      | https://.../?guest=xxx
   E    | RSVP Status          | "Confirmado", "Rechazado", o vacío
   F    | Dietary Restrictions | "Vegetariano", "Sin gluten", etc.
   G    | Partner Name         | Nombre del acompañante
   H    | Number of Guests     | 1, 2, 3, ...
   I    | Comments             | Mensaje personalizado
   J    | Submitted Date       | 2024-07-03T23:45:00Z
```

## 🔐 Variables de Entorno

```env
# GCP Service Account
GCP_PROJECT_ID              # ID del proyecto en GCP
GCP_PRIVATE_KEY_ID          # ID de la clave privada
GCP_PRIVATE_KEY             # Clave privada (multiline)
GCP_CLIENT_EMAIL            # Email de la cuenta de servicio
GCP_CLIENT_ID               # ID de cliente

# Google Sheets
NEXT_PUBLIC_GOOGLE_SHEETS_ID   # ID de la hoja de cálculo

# Otros
NEXT_PUBLIC_GCP_PROJECT_ID     # (duplicado para cliente)
NEXT_PUBLIC_API_URL            # URL base de la API
```

## 🚀 Ciclo de Desarrollo

```
1. Desarrollo Local
   npm run dev
   → http://localhost:3000

2. Compilación
   npm run build

3. Testing
   npm test (cuando se agregue)

4. Linting
   npm run lint

5. Deploy
   vercel deploy  (para Vercel)
   o
   gcloud run deploy (para GCP Cloud Run)
```

## 📦 Dependencias Principales

- **next**: 16.2.0 - Framework React
- **react**: 19.0.0 - Librería UI
- **typescript**: 5.x - Tipado estático
- **tailwindcss**: 3.4.0 - CSS utilities
- **google-auth-library**: Autenticación GCP
- **googleapis**: Google Sheets API

---

Ver más detalles en los archivos de documentación incluidos.
