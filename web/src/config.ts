// Configuración de Google Sheets usando Service Account con JWT
// Reemplaza estos valores con tus datos reales del archivo JSON descargado

export const GOOGLE_SHEETS_CONFIG = {
  // Credenciales del Service Account (del archivo JSON descargado)
  SERVICE_ACCOUNT_EMAIL: 'dealvoxsheets@gestia-471007.iam.gserviceaccount.com', // ← Email del service account
  PRIVATE_KEY: '-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCy6BiUnKAf5a5v\nLmuFOHYTk2ifabBePMsLAAR5WbVgQTAsFGH3MQA5Bb8ZYvaPlP4cfxo0Et3ivUpJ\nECaBx4vhv8DvHx/vXJHUgJ73PWX5T23PRe4KRi9IWb+SJ1RKrDJjLFWfg6p74D08\nKB16a71JnsuYDsAQapiM2vQC5gC5SOGOBYza4Pg8LeUgAptDBhHLONCNX1LVinoO\njEkpdBNsRJlmBENeZuK0r8lh/cIPP2agLvzkbhx+hFV87ZgipRRWu+WPWSjvuPRl\nqgDizksekKVSD7F+PhmpK4U4Bs3+TntefVFJzQH8a1gf0NW4de6iCCYGvvX5e/Hr\ncRzIa8nxAgMBAAECggEAItAsplCDDSnrw1lIVWRa/6ytzWVqyy+vv/x5Imb9NxWA\nSveNZ6VKmo3+dXFvMpnmx8NI5UytjidQ6v5AS/05QEzIvY80Lub3vp7nsAsrynN1\nFgIQ08F8BmtmbomGKsCuzmMMZ02e8Vt9dvUEZXPNIeQLUJPANoGTnUcm9+BrUCJl\nzAvXt63FtgaID7L6yL+X7ruBcB4+ziJ6Vmz8roLklGsc9BOwtP6GyvC5tgX3Djed\ne8ng6HigSWEnHIbBDlTmF5v5L75gacnK6MGaYRVsyv5YmLdImj0wgE38h+1nPyz7\nx5vLXLlfMn7t7pKsx6ISdTtlMTPQ5Nmi3PjtinO4tQKBgQDiYtqlY8oDmRFTFWL3\ndUQ/LqJW7rIGV9LFFq9mbQE2Nb8gaV957GmeeJwsmrcigQgxV+DonbMl5oWba3Hc\nG4h8q8xxn4AQvGR+Z63cgj5AtAdB7TBSBdHTlZa4c/8slT941MdQTXq/rxE9pdUH\nGr22OjaLhep0qHOx23WIQV4anQKBgQDKT0NWzkbW7nmWTC9ONpYnIx2ZuInrc0Sz\n844xa+9bWjWR+a9VzLg1/NznBcNVAG3JHCzDJRIE+1Kpbu0Lzjj72Ox+/QU4IpWA\nhmiE+uVyzFCYyO3mcr26yExw6IvBN1m8lTZAuwaOXZbhFF8TlFpd99adENTdUqXI\nUXf5X0lSZQKBgC7VcJJCoKo54mGjzQOQmPvRM/h0DRRO2uW3GbZA2r1SRSX5Zq0c\ngYUtQnHf1/8lXoKGwZqd9U/j7sQGaFm2wHe6OuNOsfnEX63e2RMDRsmv9Mhov1RY\nq93v1mx2YtXgUm825bzxKnG5UAHG6tk7aP/n7xzSKXzU1Ip48kmr7EHpAoGAeNhN\n5g1DXWGHuVJ6s2KB4JDmPotvvvfUoxUp67WIfW3uL+sQY9TseDs6DLlxi1W9PnMY\n/dwn3lftcY30BKhDe5SA9/3VX0mxOduPlVd1NVR8FDd5e70wPeElYBBYYqrYbIBI\nrvPIn8Ohu4L6o+xq6lR/msSSEj4rDvQzEP9tAc0CgYA7QHLUUv84BkNimq0T/hzc\nQyMNdA3EVIiRSv0VR93B7PeITmlmLzISQj6rGziEfHsdi8KTOn4hOWmY5XlVkWjp\n3Y3UEjtIrdh3bDHZSP9ANGMPOWz6krRiHsPhJMYa7gJ/FziGqNJPfAyQ3qvdCzaQ\nDETHmpuQN/uKwZuIu14i3w==\n-----END PRIVATE KEY-----\n', // ← Private key del service account
  
  // El ID de tu Google Sheet (de la URL)
  SPREADSHEET_ID: '1m5J3wpwemQwWqrc5LafGqiHsNsNbyAxn_XCSIgN5ca4',
  
  // El rango de celdas donde escribir (ajusta según tus columnas)
  RANGE: 'Sheet1!A:H'
};

// Configuración de n8n Webhook
export const N8N_CONFIG = {
  // URL del webhook de n8n (reemplaza con tu URL real)
  WEBHOOK_URL: 'https://hostbotai.app.n8n.cloud/webhook/Iniciar-Llamadas',
  
  // API Key para autenticación (opcional, si n8n requiere autenticación)
  API_KEY: 'tu-api-key-aqui',
  
  // Configuración de reintentos
  MAX_RETRIES: 3,
  RETRY_DELAY: 2000 // 2 segundos
};

// INSTRUCCIONES PARA CONFIGURAR:
// 
// 1. Ve a Google Cloud Console: https://console.cloud.google.com/
// 2. Crea un proyecto o selecciona uno existente
// 3. Ve a "APIs & Services" → "Credentials"
// 4. "+ CREATE CREDENTIALS" → "Service account"
// 5. Descarga el archivo JSON
// 6. Copia el "client_email" y "private_key" del JSON
// 7. Reemplaza 'TU_SERVICE_ACCOUNT_EMAIL_AQUI' y 'TU_PRIVATE_KEY_AQUI'
// 8. Comparte tu Google Sheet con el email del service account
// 9. Dale permisos de "Editor"
//
// IMPORTANTE: Esta solución SÍ funciona desde el navegador