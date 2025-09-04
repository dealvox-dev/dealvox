# 🔧 Configuración de Google Sheets - SOLUCIÓN DEFINITIVA

## ✅ SOLUCIÓN: Service Account con JWT (Funciona 100%)

### 1. Crear Service Account en Google Cloud Console

1. Ve a [Google Cloud Console](https://console.cloud.google.com/)
2. Crea un proyecto o selecciona uno existente
3. Ve a **"APIs & Services"** → **"Credentials"**
4. **"+ CREATE CREDENTIALS"** → **"Service account"**
5. Nombre: `dealvox-sheets-service`
6. **"Create and Continue"**
7. **"Done"**

### 2. Crear y descargar la clave

1. Haz clic en el service account creado
2. Ve a la pestaña **"Keys"**
3. **"Add Key"** → **"Create new key"**
4. Tipo: **"JSON"**
5. **"Create"** - se descargará un archivo JSON

### 3. Habilitar Google Sheets API

1. Ve a **"APIs & Services"** → **"Library"**
2. Busca **"Google Sheets API"**
3. **"Enable"**

### 4. Compartir el Google Sheet

1. Abre tu Google Sheet: https://docs.google.com/spreadsheets/d/1m5J3wpwemQwWqrc5LafGqiHsNsNbyAxn_XCSIgN5ca4/edit
2. **"Share"** (Compartir)
3. Agrega el email del service account (algo como: `dealvox-sheets-service@tu-proyecto.iam.gserviceaccount.com`)
4. Permisos: **"Editor"**
5. **"Send"**

### 5. Configurar el código

1. Abre el archivo JSON descargado
2. Copia los valores necesarios
3. Actualiza `src/config.ts` con estos valores:

```typescript
export const GOOGLE_SHEETS_CONFIG = {
  SERVICE_ACCOUNT_EMAIL: 'tu-service-account@tu-proyecto.iam.gserviceaccount.com',
  PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nTU_PRIVATE_KEY_AQUI\n-----END PRIVATE KEY-----\n',
  SPREADSHEET_ID: '1m5J3wpwemQwWqrc5LafGqiHsNsNbyAxn_XCSIgN5ca4',
  RANGE: 'Sheet1!A:G'
};
```

## 🚀 Ventajas de esta solución:

- ✅ **Funciona 100% desde el navegador**
- ✅ **Sin problemas de CORS**
- ✅ **Sin Google Apps Script**
- ✅ **Sin servidores externos**
- ✅ **Escritura directa en Google Sheets**
- ✅ **Más seguro que API Keys**

## 📋 Pasos siguientes:

1. Sigue las instrucciones de arriba
2. Actualiza `src/config.ts` con tus credenciales
3. Prueba la aplicación

¡Esta solución SÍ funciona!
