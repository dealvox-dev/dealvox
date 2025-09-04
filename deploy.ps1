# Script de deployment para Windows PowerShell
# Configuración FTP - CAMBIA ESTOS VALORES POR LOS TUYOS
$FTP_SERVER = "tu-servidor-ftp.hostinger.com"
$FTP_USER = "tu-usuario-ftp"
$FTP_PASS = "tu-password-ftp"

Write-Host "🚀 Iniciando deployment de DealVox..." -ForegroundColor Green

# Verificar que la carpeta dist existe
if (-not (Test-Path "web\dist")) {
    Write-Host "❌ Error: La carpeta dist no existe. Ejecutando build..." -ForegroundColor Red
    Set-Location web
    npm run build
    Set-Location ..
}

Write-Host "📦 Construyendo aplicación..." -ForegroundColor Yellow
Set-Location web
npm run build
Set-Location ..

Write-Host "📤 Subiendo archivos a Hostinger..." -ForegroundColor Yellow

# Crear archivo temporal con comandos FTP
$ftpCommands = @"
open $FTP_SERVER
$FTP_USER
$FTP_PASS
binary
cd public_html
lcd web\dist
prompt off
mput *
mput .htaccess
quit
"@

$ftpCommands | Out-File -FilePath "ftp_commands.txt" -Encoding ASCII

# Ejecutar comandos FTP
ftp -s:ftp_commands.txt

# Limpiar archivo temporal
Remove-Item "ftp_commands.txt"

Write-Host "✅ ¡Deployment completado!" -ForegroundColor Green
Write-Host "🌐 Tu sitio está disponible en: https://coldleadai.com" -ForegroundColor Cyan

# Pausa para que el usuario pueda leer el mensaje
Read-Host "Presiona Enter para continuar"
