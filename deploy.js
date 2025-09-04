const ftp = require('basic-ftp');
const fs = require('fs');
const path = require('path');

// Configuración FTP (cambia estos valores por los tuyos)
const config = {
  host: 'tu-servidor-ftp.hostinger.com',
  user: 'tu-usuario-ftp',
  password: 'tu-password-ftp',
  secure: false
};

async function deploy() {
  const client = new ftp.Client();
  
  try {
    console.log('🔄 Conectando al servidor FTP...');
    await client.access(config);
    
    console.log('🔄 Subiendo archivos...');
    
    // Cambiar al directorio de destino
    await client.ensureDir('public_html');
    await client.clearWorkingDir();
    
    // Subir archivos de la carpeta dist
    const distPath = path.join(__dirname, 'web', 'dist');
    
    if (!fs.existsSync(distPath)) {
      console.error('❌ Error: La carpeta dist no existe. Ejecuta "npm run build" primero.');
      process.exit(1);
    }
    
    await client.uploadFromDir(distPath);
    
    console.log('✅ ¡Deployment completado exitosamente!');
    console.log('🌐 Tu sitio debería estar disponible en: https://coldleadai.com');
    
  } catch (error) {
    console.error('❌ Error durante el deployment:', error.message);
    process.exit(1);
  } finally {
    client.close();
  }
}

// Verificar que se ejecute solo si se llama directamente
if (require.main === module) {
  deploy();
}

module.exports = { deploy };
