# Guía Completa de Setup - Wedding RSVP App

## ✅ Paso 1: Proyecto Creado

Tu aplicación Next.js para el registro de bodas ha sido creada exitosamente en `C:\gcp\wedding-app`

**Tecnologías instaladas:**
- Next.js 16 + React 19
- TypeScript
- Tailwind CSS
- Google APIs

---

## 📋 Pasos Siguientes

### Paso 2: Preparar Google Cloud Platform (GCP)

1. **Crear un Proyecto en GCP**
   - Ve a [Google Cloud Console](https://console.cloud.google.com)
   - Crea un nuevo proyecto llamado "wedding-app"
   - Anota el Project ID

2. **Habilitar APIs**
   ```bash
   gcloud projects create wedding-app
   gcloud services enable sheets.googleapis.com
   ```

3. **Crear Cuenta de Servicio**
   - En Google Cloud Console → IAM & Admin → Service Accounts
   - Crea una nueva cuenta: "wedding-app"
   - Dale el rol "Editor" o "Sheets Editor"
   - Crea una clave JSON y descárgala

4. **Copiar Credenciales**
   - Abre el archivo JSON descargado
   - Extrae:
     - `project_id`
     - `private_key_id`
     - `private_key` (la línea completa)
     - `client_email`
     - `client_id`

### Paso 3: Configurar Google Sheets

1. **Crear la Hoja de Cálculo**
   - Ve a [Google Sheets](https://sheets.google.com)
   - Crea una nueva hoja: "Wedding Guest List"
   - Comparte con el email de la cuenta de servicio

2. **Estructura de Columnas**
   ```
   Fila 1 (Encabezados):
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

3. **Ejemplo de Datos**
   ```
   guest-001 | Juan García | juan@email.com | https://boda.com/rsvp?guest=guest-001 | | | | | |
   guest-002 | María López | maria@email.com | https://boda.com/rsvp?guest=guest-002 | | | | | |
   ```

4. **Copiar el ID de la Hoja**
   - En la URL: `https://docs.google.com/spreadsheets/d/[ESTE_ES_EL_ID]/`
   - Guarda el ID

### Paso 4: Configurar Variables de Entorno

1. **Crea `.env.local`**
   ```bash
   cp .env.example .env.local
   ```

2. **Edita `.env.local`** con tus valores:
   ```env
   # GCP Service Account Credentials (del archivo JSON)
   GCP_PROJECT_ID=your-project-id
   GCP_PRIVATE_KEY_ID=key-id-from-json
   GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nTU-CLAVE-PRIVADA\n-----END PRIVATE KEY-----\n"
   GCP_CLIENT_EMAIL=wedding-app@your-project-id.iam.gserviceaccount.com
   GCP_CLIENT_ID=client-id-from-json

   # Google Sheets
   NEXT_PUBLIC_GOOGLE_SHEETS_ID=tu-id-de-hoja-calculo

   # Configuración
   NEXT_PUBLIC_GCP_PROJECT_ID=your-project-id
   NEXT_PUBLIC_API_URL=http://localhost:3000
   ```

   **⚠️ IMPORTANTE:** La `private_key` debe tener saltos de línea escapados como `\n`

### Paso 5: Ejecutar en Desarrollo

```bash
# En C:\gcp\wedding-app
npm run dev
```

La app estará en: `http://localhost:3000`

**URLs de Prueba:**
- Inicio: `http://localhost:3000`
- RSVP para guest-001: `http://localhost:3000/rsvp?guest=guest-001`

### Paso 6: Generar Enlaces de Invitación

En tu hoja de Google Sheets, en la columna D, usa esta fórmula:

```
=CONCATENATE("https://tudominio.com/rsvp?guest=", A2)
```

Luego comparte la columna D con tus invitados por email.

### Paso 7: Deploy (Cuando esté Listo)

**Opción A: Vercel (Recomendado)**
```bash
npm install -g vercel
vercel
```

En el dashboard de Vercel, agrega las variables de entorno.

**Opción B: GCP Cloud Run**
```bash
gcloud run deploy wedding-app --source .
```

---

## 🎨 Personalización

### Cambiar Colores

Edita `src/tailwind.config.ts`:

```typescript
wedding: {
  gold: '#D4AF37',      // Dorado
  ivory: '#FFFFF0',     // Marfil
  burgundy: '#5C0A0A',  // Rojo vino
}
```

### Cambiar Textos

Edita los componentes en `src/components/`:
- `RSVPForm.tsx` - Formulario
- `GuestInfo.tsx` - Información del invitado
- `src/app/page.tsx` - Página de inicio

---

## 🧪 Testing

### Probar localmente

1. Agrega invitados de prueba a tu Google Sheet
2. Abre: `http://localhost:3000/rsvp?guest=test-001`
3. Completa el formulario
4. Verifica que se actualiza en Google Sheets

### Debugging

Ver logs:
```bash
# En la terminal donde corre npm run dev
# Busca los errores de conexión a Google Sheets
```

---

## ❓ Troubleshooting

**Error: "Guest not found"**
- Verifica que el ID en la URL coincida exactamente con la columna A
- Confirma que la hoja tiene datos en esa fila

**Error: "Failed to authenticate"**
- Verifica que `GCP_PRIVATE_KEY` tiene saltos de línea correctos (`\n`)
- Asegúrate de compartir la hoja con el email de la cuenta de servicio

**Error: "ECONNRESET"**
- Problema de conectividad con Google APIs
- Intenta instalar nuevamente: `npm install`

---

## 📁 Estructura del Proyecto

```
wedding-app/
├── src/
│   ├── app/
│   │   ├── api/guests/[id]/       # API endpoints
│   │   ├── rsvp/page.tsx          # Página de RSVP
│   │   ├── layout.tsx             # Layout
│   │   ├── page.tsx               # Home
│   │   └── globals.css            # Estilos
│   ├── components/
│   │   ├── RSVPForm.tsx           # Formulario
│   │   ├── GuestInfo.tsx          # Datos del invitado
│   │   └── Loading.tsx            # Loader
│   └── lib/gcp/
│       ├── sheets.ts             # Google Sheets API
│       └── config.ts             # Config GCP
├── public/                        # Assets estáticos
├── .env.example                   # Variables de ejemplo
├── package.json                   # Dependencias
└── README.md                      # Documentación

---

## 🚀 Próximos Pasos Recomendados

1. ✅ Crear proyecto en GCP
2. ✅ Crear hoja en Google Sheets
3. ✅ Configurar `.env.local`
4. ✅ Probar localmente con `npm run dev`
5. ✅ Personalizar colores y textos
6. ✅ Generar enlaces para invitados
7. ✅ Deploy a Vercel o GCP

---

**¿Necesitas ayuda?** Consulta:
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [Next.js Docs](https://nextjs.org/docs)
- [GCP Service Accounts](https://cloud.google.com/iam/docs/service-accounts)

¡Que disfrutes tu boda! 💍
