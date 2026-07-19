# 🎉 Aplicación de Boda - LISTA PARA USAR

## ✅ ESTADO ACTUAL: 100% FUNCIONAL

Tu aplicación web de bodas está **completamente funcional y lista** para que tus invitados confirmen su asistencia. Aquí está lo que tienes:

---

## 🌐 SITIO WEB (3 páginas completas)

### 1. **Página de Inicio** (`http://localhost:3001`)
- Título elegante con monograma
- Frases personalizadas de la pareja
- Fecha de la boda: **7 de noviembre de 2026**
- Ubicación: **Hacienda de Comodejé**
- Información importante:
  - Código de vestimenta formal
  - Fecha límite RSVP: 20 de septiembre
  - Políticas de alcohol, mascotas, celulares
  - Información de transporte y estacionamiento
  - Mesa de regalos
  - Duración: hasta 1:00 AM

### 2. **Página de Lugares** (`http://localhost:3001/lugares`)
- Timeline visual elegante
- **Ceremonia**: Iglesia del Señor del Cal - 14:00
- **Recepción**: Hacienda de Comodejé - 16:00-01:00
- Información detallada de ambas ubicaciones
- ✅ **Enlace Google Maps activo** para Hacienda de Comodejé
- Información de transporte (15-20 min entre lugares)

### 3. **Preguntas Frecuentes** (`http://localhost:3001/dudas`)
- 12 preguntas interactivas expandibles
- Responde todas las dudas comunes
- Información de contacto

---

## 📋 FORMULARIO RSVP (Sistema de Confirmación)

Cada invitado accede con su **link personalizado**: `/confirm?token=ID-UNICO`

**Campos del formulario:**
- ✅ Selección de asistencia (Sí/No)
- ✅ Restricciones dietéticas (solo si asiste)
- ✅ Comentarios/mensajes
- ✅ Auto-guardado en Google Sheets

**Página de confirmación:**
- Resumen de los datos ingresados
- Mensaje de agradecimiento
- Código de confirmación

---

## 🎨 DISEÑO Y COLORES

Paleta elegante aplicada:
- **Primario**: #B42150 (Burgundy)
- **Rosa**: #F9B2A0
- **Luz**: #F7F2E7 (Crema)
- **Arena**: #CFC3BC
- **Gris**: #AFA6A1
- **Acento**: #F2B705 (Dorado)

✅ Elementos decorativos:
- Monogramas elegantes
- Divisores florales
- Animaciones suaves
- Responsive design (mobile & desktop)

---

## 🚀 PRÓXIMOS PASOS: Configuración GCP

### Paso 1: Crear Google Sheet

1. Ve a [Google Sheets](https://docs.google.com/spreadsheets/)
2. Crea una nueva hoja de cálculo
3. Renómbrala: "Wedding Invitations"
4. Crea estas columnas:
   ```
   A: ID (ej: juan-garcia-token-123)
   B: Nombre (ej: Juan García)
   C: Email (ej: juan@example.com)
   D: Teléfono (opcional)
   E: RSVP (vacío, se llena con confirmación)
   F: Restricciones Dietéticas
   G: Comentarios
   H: Fecha Confirmación
   I: Link personalizado
   ```

5. Agrega tus invitados (ejemplo 2-3 filas)
6. **Copia el ID de la hoja** desde la URL: `spreadsheetId=AQUI_VA_EL_ID`

### Paso 2: Configurar GCP (Service Account)

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un nuevo proyecto: "Wedding App"
3. Habilita estas APIs:
   - Google Sheets API
   - Google Drive API

4. Crea una **Service Account**:
   - Ve a **Service Accounts**
   - Click en **Create Service Account**
   - Nombre: `wedding-app-service`
   - Click **Create and Continue**
   - Dale rol: **Editor** (o más específico: **Google Sheets Editor**)

5. Crea una **clave JSON**:
   - En la cuenta de servicio, ve a **Keys**
   - Click **Add Key → Create new key → JSON**
   - Se descargará un archivo JSON

6. **Abre el archivo JSON descargado** y copia estos valores:
   ```
   project_id → GCP_PROJECT_ID
   private_key_id → GCP_PRIVATE_KEY_ID
   private_key → GCP_PRIVATE_KEY (incluye \n al final)
   client_email → GCP_CLIENT_EMAIL
   client_id → GCP_CLIENT_ID
   ```

### Paso 3: Compartir Google Sheet con el Service Account

1. Abre tu Google Sheet
2. Click **Compartir**
3. Copia el `client_email` del JSON y comparte la hoja con ese email
4. Dale permisos de **Edición**

### Paso 4: Configurar Variables de Entorno

1. En `C:\gcp\Wedding`, crea un archivo `.env.local`:

```bash
# GCP Credentials
GCP_PROJECT_ID=tu-project-id
GCP_PRIVATE_KEY_ID=abc123...
GCP_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
GCP_CLIENT_EMAIL=wedding-app-service@...iam.gserviceaccount.com
GCP_CLIENT_ID=123456789

# Google Sheets
NEXT_PUBLIC_GOOGLE_SHEETS_ID=tu-sheet-id

# Wedding Details
NEXT_PUBLIC_WEDDING_DATE=2026-11-07
NEXT_PUBLIC_WEDDING_NAME=Nuestra Boda
NEXT_PUBLIC_WEDDING_LOCATION=Hacienda de Comodejé
```

**⚠️ IMPORTANTE**: Reemplaza los valores de ejemplo con los reales.

### Paso 5: Reinicia el servidor

```bash
# En la terminal
npm run dev
```

---

## 🛳️ Despliegue recomendado: Cloud Run

1. Asegúrate de tener instalado y autenticado el SDK de Google Cloud:

```bash
gcloud auth login
gcloud config set project YOUR_PROJECT_ID
```

2. Construye y sube la imagen con Cloud Build (usa el `cloudbuild.yaml` incluido):

```bash
gcloud builds submit --substitutions=_REPO_NAME=wedding-app
```

3. Despliega a Cloud Run (reemplaza `REGION` y `SERVICE_NAME`):

```bash
gcloud run deploy SERVICE_NAME \
   --image gcr.io/$GOOGLE_CLOUD_PROJECT/wedding-app:$SHORT_SHA \
   --platform managed \
   --region REGION \
   --allow-unauthenticated \
   --set-env-vars NEXT_PUBLIC_GOOGLE_SHEETS_ID=YOUR_SHEET_ID \
   --set-secrets GCP_PRIVATE_KEY=projects/PROJECT/secrets/PRIVATE_KEY:latest
```

4. Alternativamente, puedes desplegar directamente con una única línea (build + deploy):

```bash
gcloud builds submit --tag gcr.io/$GOOGLE_CLOUD_PROJECT/wedding-app && \
gcloud run deploy wedding-app --image gcr.io/$GOOGLE_CLOUD_PROJECT/wedding-app --region REGION --platform managed --allow-unauthenticated
```

5. Después del despliegue: en la consola de Cloud Run, agrega variables de entorno sensibles (credenciales GCP) usando Secret Manager / variables en la UI.


---

## 🧪 PROBAR LA APLICACIÓN

1. Abre [http://localhost:3001](http://localhost:3001)
2. Navega a `/confirm?token=juan-garcia-token-123`
3. Completa el formulario
4. Verifica que los datos se guardaron en tu Google Sheet

---

## 📱 GENERAR LINKS PERSONALIZADOS

Para cada invitado, crea un link con su token único:

```
https://tudominio.com/confirm?token=NOMBRE-APELLIDO-token-123
```

Ejemplo de script Python para generar los links:

```python
import csv

invitados = [
    {"nombre": "Juan García", "email": "juan@example.com"},
    {"nombre": "María López", "email": "maria@example.com"},
]

for inv in invitados:
    token = inv["nombre"].replace(" ", "-").lower() + "-token-123"
    link = f"http://localhost:3001/confirm?token={token}"
    print(f"{inv['nombre']}: {link}")
```

---

## 📧 PRÓXIMOS PASOS (Opcional)

Para enviar emails automáticos con los links:

1. Configura **SendGrid** o **Gmail API**
2. Crea un endpoint en `/api/send-invitations`
3. Envía emails con los links personalizados

---

## 🎯 RESUMEN

| Tarea | Estado |
|-------|--------|
| ✅ Diseño elegante | Completo |
| ✅ 3 páginas funcionales | Completo |
| ✅ Formulario RSVP | Completo |
| ✅ Página de confirmación | Completo |
| ⏳ Configuración GCP | En progreso (tú) |
| ⏳ Google Sheets | Crear (tú) |
| ⏳ Links personalizados | Generar (tú) |

---

## 💡 SOPORTE

¿Necesitas ayuda con:
- Configurar GCP?
- Generar links?
- Personalizar más la aplicación?

¡Estoy aquí para ayudarte! 🎉
