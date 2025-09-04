# 🚀 Guía de Deployment - DealVox

Esta guía te explica cómo deployear tu aplicación DealVox de forma automatizada.

## 📋 Opciones de Deployment

### Opción 1: GitHub Actions (Recomendado - Automático)

**Ventajas:**
- ✅ Deployment automático al hacer `git push`
- ✅ Historial de deployments
- ✅ Rollback fácil
- ✅ Gratuito

**Configuración:**

1. **Crear repositorio en GitHub:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/tu-usuario/dealvox.git
   git push -u origin main
   ```

2. **Configurar secrets en GitHub:**
   - Ve a tu repositorio → Settings → Secrets and variables → Actions
   - Agrega estos secrets:
     - `FTP_SERVER`: tu-servidor-ftp.hostinger.com
     - `FTP_USERNAME`: tu-usuario-ftp
     - `FTP_PASSWORD`: tu-password-ftp

3. **¡Listo!** Cada vez que hagas `git push`, se desplegará automáticamente.

### Opción 2: Script Local (Rápido)

**Para usar el script de PowerShell:**
```bash
npm run deploy:ps
```

**Para usar el script de Node.js:**
```bash
npm install
npm run deploy
```

**Configuración:**
1. Edita `deploy.ps1` o `deploy.js`
2. Cambia las credenciales FTP por las tuyas
3. Ejecuta el script

### Opción 3: Vercel (Alternativa fácil)

**Ventajas:**
- ✅ Setup en 2 minutos
- ✅ HTTPS automático
- ✅ CDN global
- ✅ Deployment automático

**Configuración:**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu repositorio de GitHub
3. Configura el directorio de build: `web`
4. ¡Listo!

## 🔧 Configuración de Hostinger

### Obtener credenciales FTP:

1. **Accede a tu panel de Hostinger**
2. **Ve a "FTP Accounts"** o "Cuentas FTP"
3. **Crea una cuenta FTP** o usa la principal
4. **Anota estos datos:**
   - Servidor FTP: `ftp.tu-dominio.com` o IP
   - Usuario: `tu-usuario@tu-dominio.com`
   - Contraseña: (la que configuraste)

### Configurar DNS:

1. **Registro A:**
   - Nombre: `@`
   - Valor: IP de tu hosting
   - TTL: 3600

2. **Registro CNAME:**
   - Nombre: `www`
   - Valor: `coldleadai.com`
   - TTL: 3600

## 📝 Comandos Útiles

```bash
# Desarrollo
npm run dev                 # Ejecutar en modo desarrollo
npm run build              # Construir para producción

# Deployment
npm run deploy:ps          # Deploy con PowerShell
npm run deploy             # Deploy con Node.js

# Instalación
npm run install:all        # Instalar todas las dependencias
```

## 🔄 Flujo de trabajo recomendado

### Para desarrollo diario:
1. Haz cambios en tu código
2. `git add .`
3. `git commit -m "Descripción del cambio"`
4. `git push` (se desplegará automáticamente)

### Para deployment manual:
1. `npm run build`
2. `npm run deploy:ps`

## 🚨 Solución de problemas

### Error de conexión FTP:
- Verifica las credenciales
- Asegúrate de que el servidor FTP esté activo
- Revisa el firewall

### Error 404 en el sitio:
- Verifica que el archivo `.htaccess` esté subido
- Asegúrate de que todos los archivos estén en `public_html`

### Error de JavaScript:
- Verifica que la carpeta `assets` esté completa
- Revisa la consola del navegador

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs de GitHub Actions
2. Verifica las credenciales FTP
3. Contacta al soporte de Hostinger si es necesario

---

**¡Tu aplicación estará disponible en https://coldleadai.com!** 🎉
