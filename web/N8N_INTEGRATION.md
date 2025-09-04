# 🔗 Integración con n8n - DealVox

Esta guía te explica cómo configurar n8n para recibir y procesar llamadas desde DealVox.

## 📋 Configuración Requerida

### 1. **Configurar el Webhook en n8n**

1. **Crear un nuevo workflow en n8n**
2. **Añadir un nodo "Webhook"** como trigger:
   - **HTTP Method**: `POST`
   - **Path**: `llamadas` (o el que prefieras)
   - **Response Mode**: `Response Node`

3. **URL del webhook**: `https://hostbotai.app.n8n.cloud/webhook/Iniciar-Llamadas`

### 2. **Configurar tu Web App**

Edita el archivo `src/config.ts`:

```typescript
export const N8N_CONFIG = {
  // Reemplaza con tu URL real de n8n
  WEBHOOK_URL: 'https://hostbotai.app.n8n.cloud/webhook/Iniciar-Llamadas',
  
  // API Key si n8n requiere autenticación
  API_KEY: 'tu-api-key-aqui',
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000
};
```

## 🚀 Estructura del Payload

Cuando se activa el workflow, DealVox envía este payload simple a n8n:

```json
{
  "action": "start_workflow",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "metadata": {
    "source": "dealvox-webapp",
    "version": "1.0.0",
    "userId": "user123"
  }
}
```

**Para pruebas de conexión:**
```json
{
  "action": "test_connection",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "message": "Prueba de conexión desde DealVox"
}
```

## 🔧 Flujo de n8n Recomendado

### **Nodo 1: Webhook (Trigger)**
- Recibe la señal de DealVox
- Valida el payload

### **Nodo 2: Leer Google Sheets**
- Conecta con Google Sheets
- Lee los datos de clientes
- Filtra registros válidos

### **Nodo 3: Procesar Datos**
```javascript
// Código del nodo Function
const sheetData = $input.all()[0].json;
const calls = sheetData.values;

// Procesar cada llamada
for (const call of calls) {
  console.log(`Procesando llamada para: ${call[2]} - ${call[6]}`); // Nombre y Teléfono
  
  // Aquí puedes añadir lógica adicional
  // como validaciones, transformaciones, etc.
}

return calls.map(call => ({
  json: {
    id: call[0],
    dni: call[1],
    nombre: call[2],
    cp: call[3],
    direccion: call[4],
    cups: call[5],
    telefono: call[6],
    processedAt: new Date().toISOString(),
    status: 'ready_to_call'
  }
}));
```

### **Nodo 4: Dividir en Llamadas Individuales**
- Usar nodo "Split In Batches" o "Item Lists"
- Procesar cada llamada por separado

### **Nodo 5: Ejecutar Llamadas (Twilio)**
```json
{
  "name": "Twilio Call",
  "type": "n8n-nodes-base.twilio",
  "parameters": {
    "resource": "call",
    "operation": "create",
    "from": "+1234567890",
    "to": "={{ $json.telefono }}",
    "url": "https://tu-servidor.com/webhook/twilio-response",
    "statusCallback": "https://tu-servidor.com/webhook/twilio-status"
  }
}
```

### **Nodo 6: Guardar Resultados**
- Actualizar Google Sheets con el resultado
- O enviar a una base de datos
- O notificar de vuelta a DealVox

## 📞 Configuración de Servicios de Telefonía

### **Twilio**
1. Crear cuenta en [Twilio](https://www.twilio.com/)
2. Obtener Account SID y Auth Token
3. Configurar número de teléfono
4. Instalar nodo Twilio en n8n

### **Vonage (Nexmo)**
1. Crear cuenta en [Vonage](https://www.vonage.com/)
2. Obtener API Key y Secret
3. Instalar nodo Vonage en n8n

## 🧪 Pruebas

### **1. Probar Conexión**
- Usa el botón "Probar n8n" en DealVox
- Verifica que n8n reciba el payload de prueba

### **2. Probar Llamadas**
- Sube un archivo Excel con datos de prueba
- Crea lotes de llamadas
- Inicia un lote y verifica que n8n lo procese

## 🔍 Debugging

### **Logs en DealVox**
- Abre las herramientas de desarrollador (F12)
- Ve a la pestaña "Console"
- Busca mensajes que empiecen con "🚀" o "Enviando datos a n8n"

### **Logs en n8n**
- Ve a la pestaña "Executions" en n8n
- Revisa los logs de cada ejecución
- Verifica que los datos lleguen correctamente

## ⚠️ Consideraciones Importantes

1. **Rate Limiting**: n8n puede tener límites de velocidad
2. **Timeout**: Configura timeouts apropiados
3. **Error Handling**: Maneja errores de red y de API
4. **Seguridad**: Usa HTTPS y autenticación
5. **Monitoreo**: Configura alertas para fallos

## 🆘 Solución de Problemas

### **Error 404: Webhook not found**
- Verifica que la URL del webhook sea correcta
- Asegúrate de que el workflow esté activo en n8n

### **Error 401: Unauthorized**
- Verifica la API Key en la configuración
- Asegúrate de que n8n esté configurado para aceptar la autenticación

### **Error de red**
- Verifica la conectividad a internet
- Revisa si hay firewall bloqueando la conexión
- Comprueba que n8n esté funcionando

## 📚 Recursos Adicionales

- [Documentación de n8n](https://docs.n8n.io/)
- [Nodos de Twilio para n8n](https://docs.n8n.io/integrations/builtin/cli-nodes/n8n-nodes-base.twilio/)
- [Webhooks en n8n](https://docs.n8n.io/integrations/builtin/trigger-nodes/n8n-nodes-base.webhook/)
