import { useEffect, useState, useRef } from "react";
import { auth, db } from "./firebase";
import {
  onAuthStateChanged,
  signOut,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import * as XLSX from 'xlsx';
import { GOOGLE_SHEETS_CONFIG, N8N_CONFIG } from './config';
import { KJUR } from 'jsrsasign';
import { createPortal } from 'react-dom';
import { 
  BarChart3, 
  Phone, 
  CheckCircle, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Bell, 
  Search, 
  Upload, 
  FileSpreadsheet, 
  Download, 
  Play, 
  RotateCcw,
  Activity,
  Target,
  Clock,
  AlertCircle,
  XCircle,
  TrendingUp
} from "lucide-react";

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    if (!email || !password) return setError("Rellena email y contraseña.");
    if (mode === "signup" && password.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");

    try {
      setLoading(true);
      if (mode === "login") {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        // crea/actualiza perfil básico en Firestore (opcional pero útil)
        await setDoc(
          doc(db, "users", cred.user.uid),
          { email, createdAt: serverTimestamp() },
          { merge: true }
        );
      }
    } catch (e: any) {
      const msg =
        e?.code === "auth/email-already-in-use"
          ? "Ese email ya está registrado."
          : e?.code === "auth/invalid-credential"
          ? "Credenciales no válidas."
          : e?.code === "auth/invalid-email"
          ? "Email inválido."
          : e?.code === "auth/wrong-password"
          ? "Contraseña incorrecta."
          : e?.message || "Error al autenticar.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword() {
    setError(null);
    setInfo(null);
    if (!email) return setError("Escribe tu email para enviar el enlace.");
    try {
      await sendPasswordResetEmail(auth, email);
      setInfo("Te enviamos un enlace para restablecer la contraseña.");
    } catch (e: any) {
      setError(e?.message || "No se pudo enviar el correo de restablecimiento.");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-black via-gray-900 to-black flex-col justify-center items-center p-16 relative">
        <div className="max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-500 rounded-2xl flex items-center justify-center mb-8 shadow-2xl">
            <Phone className="w-10 h-10 text-black" />
          </div>
          <h1 className="text-4xl font-bold text-gray-100 mb-4">DealVox</h1>
          <p className="text-xl text-gray-400 mb-12">Automatización inteligente de llamadas empresariales</p>
          
          <div className="space-y-6">
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Gestión completa de campañas</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Analytics en tiempo real</span>
            </div>
            <div className="flex items-center space-x-4 text-gray-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full"></div>
              <span>Integración con n8n</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-8 lg:p-16 bg-gray-800">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-12">
            <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <Phone className="w-8 h-8 text-black" />
            </div>
            <h1 className="text-3xl font-bold text-gray-100 mb-2">DealVox</h1>
            <p className="text-gray-400">Automatización inteligente de llamadas</p>
          </div>

          {/* Login Form */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-100 mb-2">
              {mode === "login" ? "Bienvenido de vuelta" : "Crear cuenta"}
            </h2>
            <p className="text-gray-400">
              {mode === "login" ? "Inicia sesión en tu cuenta" : "Comienza tu prueba gratuita"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
          <input
            type="email"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="tu@empresa.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Contraseña
              </label>
          <input
            type="password"
                className="w-full px-4 py-3 bg-gray-700 border border-gray-600 text-gray-100 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all placeholder-gray-400"
                placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            required
            minLength={6}
          />
            </div>

                                    {mode === "login" && (
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={resetPassword}
                  className="text-sm text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            )}

          <button
            type="submit"
            disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-black font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
                ? "Procesando..."
              : mode === "login"
                ? "Iniciar sesión"
              : "Crear cuenta"}
          </button>
        </form>

          <div className="mt-8 text-center">
            <p className="text-gray-400">
              {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
                className="ml-2 text-emerald-400 hover:text-emerald-300 font-semibold"
            type="button"
          >
                {mode === "login" ? "Regístrate" : "Inicia sesión"}
          </button>
            </p>
          </div>

          {error && (
            <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}
          
          {info && (
            <div className="mt-6 p-4 bg-emerald-900/20 border border-emerald-800 rounded-lg">
              <p className="text-emerald-400 text-sm">{info}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ExcelUploader({ user }: { user: User }) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processedData, setProcessedData] = useState<any[]>([]);
  const [parsingInfo, setParsingInfo] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Estados para gestión de llamadas
  const [callBatches, setCallBatches] = useState<any[]>([]);
  const [callStats, setCallStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    failed: 0
  });

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    const excelFile = files.find(file => 
      file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      file.name.endsWith('.xlsx')
    );
    
    if (excelFile) {
      handleFileUpload(excelFile);
    } else {
      setError('Por favor, selecciona un archivo Excel (.xlsx)');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const parseExcelData = (rawData: any[]) => {
    // Función para normalizar nombres de columnas
    const normalizeColumnName = (name: string) => {
      return name
        .toLowerCase()
        .trim()
        .replace(/[áàäâ]/g, 'a')
        .replace(/[éèëê]/g, 'e')
        .replace(/[íìïî]/g, 'i')
        .replace(/[óòöô]/g, 'o')
        .replace(/[úùüû]/g, 'u')
        .replace(/[ñ]/g, 'n')
        .replace(/[ç]/g, 'c')
        .replace(/[^a-z0-9]/g, '');
    };

    // Mapeo de campos posibles a campos requeridos (incluyendo teléfono)
    const fieldMappings: { [key: string]: string[] } = {
      'DNI': ['dni', 'documento', 'cedula', 'identificacion', 'nif', 'nie'],
      'IBAN': ['iban', 'cuenta', 'cuentabancaria', 'numero', 'numerocuenta'],
      'Dirección': ['direccion', 'direccion', 'domicilio', 'calle', 'direccioncompleta', 'domicilio'],
      'Nombre': ['nombre', 'name', 'cliente', 'razonsocial', 'empresa', 'titular'],
      'CUPS': ['cups', 'codigocups', 'codigo', 'cups'],
      'Teléfono': ['telefono', 'phone', 'movil', 'celular', 'contacto', 'numero', 'tlf']
    };

    if (rawData.length === 0) {
      throw new Error('El archivo Excel está vacío');
    }

    // Obtener las columnas del primer registro
    const firstRow = rawData[0];
    const availableColumns = Object.keys(firstRow);
    
    console.log('Columnas disponibles:', availableColumns);

    // Encontrar el mapeo de columnas
    const columnMapping: { [key: string]: string } = {};
    
    for (const [requiredField, possibleNames] of Object.entries(fieldMappings)) {
      const foundColumn = availableColumns.find(col => {
        const normalizedCol = normalizeColumnName(col);
        return possibleNames.some(name => normalizedCol.includes(name));
      });
      
      if (foundColumn) {
        columnMapping[requiredField] = foundColumn;
        console.log(`Mapeado: ${requiredField} -> ${foundColumn}`);
      }
    }

    // Verificar que tenemos al menos algunos campos requeridos
    const foundFields = Object.keys(columnMapping);
    if (foundFields.length === 0) {
      throw new Error('No se encontraron campos reconocibles en el Excel. Asegúrate de que contenga columnas como: DNI, IBAN, Dirección, Nombre, CUPS, Teléfono');
    }

    // Procesar los datos
    const processedData = rawData.map((row, index) => {
      const processedRow: any = {};
      
      for (const [requiredField, sourceColumn] of Object.entries(columnMapping)) {
        const value = row[sourceColumn];
        processedRow[requiredField] = value ? String(value).trim() : '';
      }
      
      // Agregar un ID único para cada registro
      processedRow['ID'] = index + 1;
      
      return processedRow;
    });

    // Filtrar filas vacías
    const filteredData = processedData.filter(row => {
      return Object.values(row).some(value => value && String(value).trim() !== '');
    });

    // Eliminar duplicados basándose en el número de teléfono
    const uniqueData = [];
    const seenPhones = new Set<string>();
    let duplicatesRemoved = 0;

    for (const row of filteredData) {
      const phone = row['Teléfono'] || '';
      const normalizedPhone = phone.replace(/\D/g, ''); // Solo números
      
      if (normalizedPhone && seenPhones.has(normalizedPhone)) {
        duplicatesRemoved++;
        console.log(`Duplicado encontrado y eliminado: ${phone}`);
        continue;
      }
      
      if (normalizedPhone) {
        seenPhones.add(normalizedPhone);
      }
      
      uniqueData.push(row);
    }

    console.log(`Duplicados eliminados: ${duplicatesRemoved}`);

    return {
      data: uniqueData,
      mapping: columnMapping,
      foundFields: foundFields,
      totalRows: rawData.length,
      validRows: filteredData.length,
      uniqueRows: uniqueData.length,
      duplicatesRemoved: duplicatesRemoved
    };
  };

  const handleFileUpload = async (file: File) => {
    setError(null);
    setUploadedFile(file);
    setIsProcessing(true);

    try {
      const rawData = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const workbook = XLSX.read(e.target?.result, { type: 'binary' });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const jsonData = XLSX.utils.sheet_to_json(worksheet);
            resolve(jsonData);
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = () => reject(new Error('Error al leer el archivo'));
        reader.readAsBinaryString(file);
      });

      // Parsear los datos con nuestros campos específicos
      const parsedResult = parseExcelData(rawData as any[]);
      setProcessedData(parsedResult.data);
      setParsingInfo(parsedResult);
      
      // Crear lotes de llamadas automáticamente
      createCallBatches(parsedResult.data);
      
      console.log('Datos parseados:', parsedResult);
      console.log('Campos encontrados:', parsedResult.foundFields);
      console.log('Mapeo de columnas:', parsedResult.mapping);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al procesar el archivo Excel. Asegúrate de que sea un archivo válido.');
      console.error('Error:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Función para generar JWT
  const generateJWT = () => {
    const { SERVICE_ACCOUNT_EMAIL, PRIVATE_KEY } = GOOGLE_SHEETS_CONFIG;
    
    if (SERVICE_ACCOUNT_EMAIL === 'TU_SERVICE_ACCOUNT_EMAIL_AQUI' || PRIVATE_KEY === 'TU_PRIVATE_KEY_AQUI') {
      throw new Error('❌ Configuración incompleta. Debes configurar SERVICE_ACCOUNT_EMAIL y PRIVATE_KEY en src/config.ts');
    }

    const now = Math.floor(Date.now() / 1000);
    const header = {
      alg: 'RS256',
      typ: 'JWT'
    };

    const payload = {
      iss: SERVICE_ACCOUNT_EMAIL,
      scope: 'https://www.googleapis.com/auth/spreadsheets',
      aud: 'https://oauth2.googleapis.com/token',
      exp: now + 3600,
      iat: now
    };

    const sHeader = JSON.stringify(header);
    const sPayload = JSON.stringify(payload);
    const sJWT = KJUR.jws.JWS.sign('RS256', sHeader, sPayload, PRIVATE_KEY);
    
    return sJWT;
  };

  // Función para obtener access token
  const getAccessToken = async () => {
    const jwt = generateJWT();
    
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion: jwt
      })
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(`Error obteniendo access token: ${data.error_description || data.error}`);
    }

    return data.access_token;
  };

  const writeToGoogleSheets = async (data: any[]) => {
    try {
      const { SPREADSHEET_ID, RANGE } = GOOGLE_SHEETS_CONFIG;

      console.log('Enviando datos a Google Sheets via JWT:', {
        rows: data.length,
        sampleData: data[0]
      });

      // Obtener access token
      const accessToken = await getAccessToken();

      // Preparar los datos para Google Sheets
      // Estructura: id, dni, name, cp, street, actual_company, teléfono, phone
      const values = data.map(row => [
        row.ID || '',                    // A: id
        row.DNI || '',                   // B: dni
        row.Nombre || '',                // C: name
        row.CP || '',                    // D: cp
        row.Dirección || '',             // E: street
        row.CUPS || '',                  // F: actual_company (usando CUPS como actual_company)
        row.Teléfono || '',              // G: teléfono
        ''                               // H: phone (vacío)
      ]);

      // Escribir en Google Sheets
      const response = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values/${RANGE}:append?valueInputOption=RAW`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          values: values
        })
      });

      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(`Error escribiendo en Google Sheets: ${result.error?.message || 'Error desconocido'}`);
      }

      console.log('Datos escritos en Google Sheets:', result);
      
      return { 
        success: true, 
        updatedRows: result.updates?.updatedRows || values.length 
      };
    } catch (error) {
      console.error('Error escribiendo en Google Sheets:', error);
      throw error;
    }
  };

  const handleDownload = () => {
    if (processedData.length === 0) return;
    
    const ws = XLSX.utils.json_to_sheet(processedData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Datos Procesados');
    XLSX.writeFile(wb, 'datos_procesados.xlsx');
  };



  const handleUploadToSheets = async () => {
    if (processedData.length === 0) return;
    
    setIsProcessing(true);
    try {
      const result = await writeToGoogleSheets(processedData);
      setInfo(`✅ Datos subidos exitosamente a Google Sheets. ${result.updatedRows} filas actualizadas.`);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error al subir a Google Sheets');
    } finally {
      setIsProcessing(false);
    }
  };

  const resetUpload = () => {
    setUploadedFile(null);
    setProcessedData([]);
    setParsingInfo(null);
    setError(null);
    setInfo(null);
    setIsProcessing(false);
    setCallBatches([]);
    setCallStats({ total: 0, completed: 0, inProgress: 0, failed: 0 });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Función para crear lotes de llamadas
  const createCallBatches = (data: any[]) => {
    const batches = [];
    for (let i = 0; i < data.length; i += 10) {
      const batch = data.slice(i, i + 10);
      batches.push({
        id: Math.floor(i / 10) + 1,
        data: batch,
        status: 'pending', // pending, in_progress, completed, failed
        startTime: null,
        endTime: null,
        results: []
      });
    }
    setCallBatches(batches);
    setCallStats({
      total: data.length,
      completed: 0,
      inProgress: 0,
      failed: 0
    });
  };

  // Función para iniciar un lote de llamadas
  // Función simple para activar el workflow de n8n
  const startN8nWorkflow = async () => {
    try {
      setInfo('🚀 Iniciando workflow de n8n...');
      
      const payload = {
        action: 'start_workflow',
        timestamp: new Date().toISOString(),
        metadata: {
          source: 'dealvox-webapp',
          version: '1.0.0',
          userId: user?.uid || 'anonymous'
        }
      };

      console.log('Activando workflow de n8n:', payload);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };

      // Añadir API key si está configurada
      if (N8N_CONFIG.API_KEY && N8N_CONFIG.API_KEY !== 'tu-api-key-aqui') {
        headers['Authorization'] = `Bearer ${N8N_CONFIG.API_KEY}`;
      }

      const response = await fetch(N8N_CONFIG.WEBHOOK_URL, {
        method: 'POST',
        headers,
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Workflow de n8n iniciado:', result);
        setInfo('✅ Workflow de n8n iniciado correctamente. n8n se encargará de leer Google Sheets y procesar las llamadas.');
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error iniciando workflow de n8n:', error);
      setError(`❌ Error al iniciar workflow de n8n: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  };



  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <div
        className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300 cursor-pointer backdrop-blur-xl ${
          isDragOver
            ? 'border-emerald-500 bg-emerald-500/10 shadow-2xl shadow-emerald-500/25'
            : 'border-steel-600/50 hover:border-emerald-400/50 bg-steel-800/30 hover:bg-steel-800/50'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileSelect}
          className="hidden"
        />
        
        <div className="w-16 h-16 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-emerald-500/25">
          <Upload className="w-8 h-8 text-black" />
        </div>
        
        <h4 className="text-xl font-bold text-gray-100 mb-2">
          {isDragOver ? 'Suelta el archivo aquí' : 'Arrastra tu base de datos de clientes'}
        </h4>
        <p className="text-gray-400 mb-4">Sube tu archivo Excel con los datos de clientes para iniciar las llamadas</p>
        
        <button 
          type="button"
          className="px-6 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 font-semibold"
        >
          Seleccionar Archivo
            </button>
      </div>

      {/* File Info */}
      {uploadedFile && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5 text-black" />
              </div>
              <div>
                <p className="font-semibold text-emerald-200">{uploadedFile.name}</p>
                <p className="text-sm text-emerald-300">
                  {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={resetUpload}
              className="text-emerald-300 hover:text-emerald-200 p-1 hover:bg-emerald-500/20 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Processing Status */}
      {isProcessing && (
        <div className="bg-blue-500/20 border border-blue-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-blue-200 font-semibold">Procesando archivo Excel...</p>
        </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-red-400 text-lg">⚠️</div>
            <p className="text-red-200 font-semibold">{error}</p>
      </div>
        </div>
      )}

      {/* Info Message */}
      {info && (
        <div className="bg-emerald-500/20 border border-emerald-500/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 text-emerald-400 text-lg">✅</div>
            <p className="text-emerald-200 font-semibold">{info}</p>
          </div>
        </div>
      )}

      {/* Parsing Information */}
      {parsingInfo && (
        <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-xl">
          <h4 className="font-bold text-gray-100 mb-4 text-lg flex items-center">
            <div className="w-6 h-6 bg-blue-500 rounded-lg flex items-center justify-center mr-2">
              <span className="text-white text-sm">📊</span>
            </div>
            Información del Procesamiento
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Registros procesados:</strong> {parsingInfo.validRows} de {parsingInfo.totalRows}
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Registros únicos:</strong> {parsingInfo.uniqueRows}
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Duplicados eliminados:</strong> {parsingInfo.duplicatesRemoved || 0}
              </p>
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Campos encontrados:</strong> {parsingInfo.foundFields.length} de 6
              </p>
            </div>
            <div>
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Campos detectados:</strong>
              </p>
              <div className="flex flex-wrap gap-1">
                {parsingInfo.foundFields.map((field: string) => (
                  <span key={field} className="px-2 py-1 bg-emerald-500/20 text-emerald-200 text-xs rounded-full border border-emerald-500/30">
                    {field}
                  </span>
                ))}
              </div>
            </div>
          </div>
          
          {parsingInfo.mapping && (
            <div className="mt-4">
              <p className="text-gray-300 mb-2">
                <strong className="text-gray-100">Mapeo de columnas:</strong>
              </p>
              <div className="text-gray-400 space-y-1 text-sm">
                {Object.entries(parsingInfo.mapping).map(([required, original]) => (
                  <div key={required} className="flex items-center space-x-2">
                    <span className="font-semibold text-emerald-300">{required}</span>
                    <span className="text-gray-500">←</span>
                    <span className="text-gray-300">{String(original)}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Processed Data */}
      {processedData.length > 0 && (
                <div className="bg-gray-800/50 border border-gray-700/50 rounded-lg p-6 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-bold text-gray-100 text-lg">
              Datos procesados ({processedData.length} registros)
            </h4>
            <div className="flex space-x-3">
              <button
                onClick={handleUploadToSheets}
                disabled={isProcessing}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Upload className="w-4 h-4" />
                <span>{isProcessing ? 'Subiendo...' : 'Subir a Google Sheets'}</span>
              </button>
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-black rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-emerald-500/25 font-semibold"
              >
                <Download className="w-4 h-4" />
                <span>Descargar Excel</span>
              </button>
            </div>
          </div>

          {/* Data Preview */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-600/50">
                  {Object.keys(processedData[0] || {}).slice(0, 5).map((key) => (
                    <th key={key} className="text-left py-2 px-3 font-semibold text-gray-300">
                      {key}
                    </th>
                  ))}
                  {Object.keys(processedData[0] || {}).length > 5 && (
                    <th className="text-left py-2 px-3 font-semibold text-gray-300">
                      ...
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {processedData.slice(0, 3).map((row, index) => (
                  <tr key={index} className="border-b border-gray-700/30">
                    {Object.values(row).slice(0, 5).map((value, i) => (
                      <td key={i} className="py-2 px-3 text-gray-300">
                        {String(value)}
                      </td>
                    ))}
                    {Object.keys(processedData[0] || {}).length > 5 && (
                      <td className="py-2 px-3 text-gray-500">...</td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
            {processedData.length > 3 && (
              <p className="text-gray-400 mt-3 text-center">
                Mostrando 3 de {processedData.length} registros
              </p>
            )}
          </div>
        </div>
      )}

      {/* Sección de Gestión de Llamadas */}
      {callBatches.length > 0 && (
        <div className="bg-steel-800/50 backdrop-blur-xl rounded-2xl p-6 border border-steel-700/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center">
                <Phone className="w-5 h-5 text-black" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-steel-100 font-sans">Gestión de Llamadas</h3>
                <p className="text-steel-400 font-medium">Inicia el workflow de n8n para procesar llamadas automáticamente</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Botón principal para iniciar workflow de n8n */}
              <button
                onClick={startN8nWorkflow}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
              >
                <Play className="w-4 h-4" />
                <span>Iniciar Llamadas</span>
              </button>
            </div>
          </div>

          {/* Estadísticas de Llamadas */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-steel-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Target className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-steel-100">{callStats.total}</p>
                  <p className="text-steel-400 text-sm font-medium">Total</p>
                </div>
              </div>
            </div>
            
            <div className="bg-steel-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-steel-100">{callStats.completed}</p>
                  <p className="text-steel-400 text-sm font-medium">Completadas</p>
                </div>
              </div>
            </div>
            
            <div className="bg-steel-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-steel-100">{callStats.inProgress}</p>
                  <p className="text-steel-400 text-sm font-medium">En Progreso</p>
                </div>
              </div>
            </div>
            
            <div className="bg-steel-700/50 rounded-xl p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-steel-100">{callStats.failed}</p>
                  <p className="text-steel-400 text-sm font-medium">Fallidas</p>
                </div>
              </div>
            </div>
          </div>

          {/* Lista de Lotes */}
          <div className="space-y-3">
            <h4 className="text-lg font-semibold text-steel-100 mb-4 font-sans">Lotes de Llamadas ({callBatches.length})</h4>
            
            <div className="grid gap-3">
              {callBatches.map((batch) => (
                <div
                  key={batch.id}
                  className={`bg-steel-700/30 rounded-xl p-4 border transition-all ${
                    batch.status === 'in_progress' 
                      ? 'border-emerald-500/50 bg-emerald-500/10' 
                      : batch.status === 'completed'
                      ? 'border-emerald-500/30'
                      : batch.status === 'failed'
                      ? 'border-red-500/30'
                      : 'border-steel-600/30'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        batch.status === 'pending' ? 'bg-steel-600' :
                        batch.status === 'in_progress' ? 'bg-emerald-500' :
                        batch.status === 'completed' ? 'bg-emerald-500' :
                        'bg-red-500'
                      }`}>
                        {batch.status === 'pending' && <Clock className="w-5 h-5 text-steel-300" />}
                        {batch.status === 'in_progress' && <Activity className="w-5 h-5 text-white animate-pulse" />}
                        {batch.status === 'completed' && <CheckCircle className="w-5 h-5 text-white" />}
                        {batch.status === 'failed' && <AlertCircle className="w-5 h-5 text-white" />}
                      </div>
                      
                      <div>
                        <h5 className="font-semibold text-steel-100">Lote {batch.id}</h5>
                        <p className="text-steel-400 text-sm">
                          {batch.data.length} llamadas • 
                          {batch.status === 'pending' && ' Pendiente'}
                          {batch.status === 'in_progress' && ' En progreso'}
                          {batch.status === 'completed' && ' Completado'}
                          {batch.status === 'failed' && ' Fallido'}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {batch.status === 'pending' && (
                        <div className="flex items-center space-x-2 text-steel-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-sm font-medium">Pendiente</span>
                        </div>
                      )}
                      
                      {batch.status === 'in_progress' && (
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <Activity className="w-4 h-4 animate-pulse" />
                          <span className="text-sm font-medium">Ejecutando...</span>
                        </div>
                      )}
                      
                      {batch.status === 'completed' && (
                        <div className="flex items-center space-x-2 text-emerald-400">
                          <CheckCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Completado</span>
                        </div>
                      )}
                      
                      {batch.status === 'failed' && (
                        <div className="flex items-center space-x-2 text-red-400">
                          <AlertCircle className="w-4 h-4" />
                          <span className="text-sm font-medium">Fallido</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Componente de Página de Llamadas Detallada
function CallsPage() {
  const [callHistory] = useState([
    {
      id: 1,
      phone: '+34 612 345 678',
      name: 'Juan Pérez',
      status: 'completed',
      duration: '2:34',
      timestamp: '2024-01-15 14:30',
      result: 'Interesado',
      notes: 'Cliente muy interesado en el producto premium'
    },
    {
      id: 2,
      phone: '+34 623 456 789',
      name: 'María García',
      status: 'failed',
      duration: '0:45',
      timestamp: '2024-01-15 14:25',
      result: 'No contesta',
      notes: 'Llamada sin respuesta'
    },
    {
      id: 3,
      phone: '+34 634 567 890',
      name: 'Carlos López',
      status: 'completed',
      duration: '4:12',
      timestamp: '2024-01-15 14:20',
      result: 'Cita agendada',
      notes: 'Cita programada para el viernes'
    },
    {
      id: 4,
      phone: '+34 645 678 901',
      name: 'Ana Martín',
      status: 'in_progress',
      duration: '1:23',
      timestamp: '2024-01-15 14:15',
      result: 'En curso',
      notes: 'Llamada en progreso'
    }
  ]);

  const [filter, setFilter] = useState<'all' | 'completed' | 'failed' | 'in_progress'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCalls = callHistory.filter(call => {
    const matchesFilter = filter === 'all' || call.status === filter;
    const matchesSearch = call.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         call.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });



  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completada';
      case 'failed': return 'Fallida';
      case 'in_progress': return 'En Progreso';
      default: return 'Desconocido';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header con Filtros */}
      <div className="bg-steel-800/50 backdrop-blur-xl rounded-2xl p-6 border border-steel-700/50">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-steel-100 font-sans">Historial de Llamadas</h2>
            <p className="text-steel-400 font-medium">Gestiona y revisa todas las llamadas realizadas</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-steel-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o teléfono..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-steel-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 bg-steel-700/50 text-steel-100 placeholder-steel-400"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="px-4 py-2 border border-steel-600/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 bg-steel-700/50 text-steel-100"
            >
              <option value="all">Todas las llamadas</option>
              <option value="completed">Completadas</option>
              <option value="failed">Fallidas</option>
              <option value="in_progress">En Progreso</option>
            </select>
          </div>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-steel-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                <Phone className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">{callHistory.length}</p>
                <p className="text-steel-400 text-sm font-medium">Total Llamadas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-steel-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">
                  {callHistory.filter(c => c.status === 'completed').length}
                </p>
                <p className="text-steel-400 text-sm font-medium">Completadas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-steel-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">
                  {callHistory.filter(c => c.status === 'failed').length}
                </p>
                <p className="text-steel-400 text-sm font-medium">Fallidas</p>
              </div>
            </div>
          </div>
          
          <div className="bg-steel-700/50 rounded-xl p-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-2xl font-bold text-steel-100">
                  {callHistory.filter(c => c.status === 'in_progress').length}
                </p>
                <p className="text-steel-400 text-sm font-medium">En Progreso</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Llamadas */}
      <div className="bg-steel-800/50 backdrop-blur-xl rounded-2xl border border-steel-700/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-steel-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Cliente</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Teléfono</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Estado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Duración</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Resultado</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Fecha</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-steel-200">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-steel-700/30">
              {filteredCalls.map((call) => (
                <tr key={call.id} className="hover:bg-steel-700/20 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                        <span className="text-black text-sm font-medium">
                          {call.name.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-steel-100">{call.name}</p>
                        <p className="text-xs text-steel-400">{call.notes}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-steel-300 font-mono">{call.phone}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      call.status === 'completed' ? 'text-emerald-400 bg-emerald-500/20' :
                      call.status === 'failed' ? 'text-red-400 bg-red-500/20' :
                      call.status === 'in_progress' ? 'text-yellow-400 bg-yellow-500/20' :
                      'text-steel-400 bg-steel-500/20'
                    }`}>
                      {getStatusText(call.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-steel-300 font-mono">{call.duration}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-steel-300">{call.result}</p>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm text-steel-400">{call.timestamp}</p>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-steel-400">-</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Componente de Dashboard de Analíticas Avanzadas
function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState('7d');
  const [selectedMetric, setSelectedMetric] = useState('calls');

  // Datos mock para analíticas
  const analyticsData = {
    overview: {
      totalCalls: 1247,
      successfulCalls: 1089,
      failedCalls: 158,
      successRate: 87.3,
      avgDuration: '4:32',
      totalDuration: '94:15:23'
    },
    hourlyData: [
      { hour: '09:00', calls: 45, success: 42, failed: 3 },
      { hour: '10:00', calls: 67, success: 58, failed: 9 },
      { hour: '11:00', calls: 89, success: 78, failed: 11 },
      { hour: '12:00', calls: 34, success: 31, failed: 3 },
      { hour: '13:00', calls: 23, success: 20, failed: 3 },
      { hour: '14:00', calls: 56, success: 49, failed: 7 },
      { hour: '15:00', calls: 78, success: 71, failed: 7 },
      { hour: '16:00', calls: 92, success: 85, failed: 7 },
      { hour: '17:00', calls: 45, success: 41, failed: 4 }
    ],
    dailyData: [
      { day: 'Lun', calls: 234, success: 201, failed: 33 },
      { day: 'Mar', calls: 267, success: 234, failed: 33 },
      { day: 'Mié', calls: 189, success: 167, failed: 22 },
      { day: 'Jue', calls: 298, success: 267, failed: 31 },
      { day: 'Vie', calls: 259, success: 220, failed: 39 }
    ],
    topPerformers: [
      { name: 'Operador A', calls: 156, success: 142, rate: 91.0 },
      { name: 'Operador B', calls: 134, success: 118, rate: 88.1 },
      { name: 'Operador C', calls: 98, success: 85, rate: 86.7 }
    ],
    callReasons: [
      { reason: 'Información General', count: 456, percentage: 36.6 },
      { reason: 'Soporte Técnico', count: 234, percentage: 18.8 },
      { reason: 'Ventas', count: 189, percentage: 15.2 },
      { reason: 'Reclamaciones', count: 156, percentage: 12.5 },
      { reason: 'Otros', count: 212, percentage: 17.0 }
    ]
  };



  return (
    <div className="space-y-8">
      {/* Header con controles */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div>
          <h1 className="text-3xl font-bold text-steel-100 mb-2">Analíticas de Llamadas</h1>
          <p className="text-steel-400">Dashboard avanzado de métricas y rendimiento</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Selector de rango de tiempo */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-steel-300">Período:</label>
            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="bg-steel-800/50 border border-steel-600/50 rounded-lg px-3 py-2 text-steel-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="90d">Últimos 90 días</option>
            </select>
          </div>

          {/* Selector de métrica */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-steel-300">Métrica:</label>
            <select 
              value={selectedMetric} 
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="bg-steel-800/50 border border-steel-600/50 rounded-lg px-3 py-2 text-steel-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            >
              <option value="calls">Llamadas</option>
              <option value="duration">Duración</option>
              <option value="success">Tasa de Éxito</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-steel-400 text-sm font-medium">Total Llamadas</p>
              <p className="text-2xl font-bold text-steel-100">{analyticsData.overview.totalCalls.toLocaleString()}</p>
            </div>
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center">
              <Phone className="w-6 h-6 text-blue-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400">+12.5%</span>
            <span className="text-steel-400 ml-2">vs período anterior</span>
          </div>
        </div>

        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-steel-400 text-sm font-medium">Tasa de Éxito</p>
              <p className="text-2xl font-bold text-steel-100">{analyticsData.overview.successRate}%</p>
            </div>
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-emerald-400">+2.1%</span>
            <span className="text-steel-400 ml-2">vs período anterior</span>
          </div>
        </div>

        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-steel-400 text-sm font-medium">Duración Promedio</p>
              <p className="text-2xl font-bold text-steel-100">{analyticsData.overview.avgDuration}</p>
            </div>
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center">
              <Clock className="w-6 h-6 text-purple-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400">-0:15</span>
            <span className="text-steel-400 ml-2">vs período anterior</span>
          </div>
        </div>

        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-steel-400 text-sm font-medium">Llamadas Fallidas</p>
              <p className="text-2xl font-bold text-steel-100">{analyticsData.overview.failedCalls}</p>
            </div>
            <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center">
              <XCircle className="w-6 h-6 text-red-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <span className="text-red-400">+5.2%</span>
            <span className="text-steel-400 ml-2">vs período anterior</span>
          </div>
        </div>
      </div>

      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Gráfico de llamadas por hora */}
        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <h3 className="text-lg font-bold text-steel-100 mb-6">Llamadas por Hora</h3>
          <div className="space-y-4">
            {analyticsData.hourlyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-steel-300 w-16">{data.hour}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-steel-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.calls / 100) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-steel-100">{data.calls}</span>
                  <span className="text-xs text-steel-400 ml-1">llamadas</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico de llamadas por día */}
        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <h3 className="text-lg font-bold text-steel-100 mb-6">Llamadas por Día</h3>
          <div className="space-y-4">
            {analyticsData.dailyData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm text-steel-300 w-12">{data.day}</span>
                <div className="flex-1 mx-4">
                  <div className="w-full bg-steel-700/50 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${(data.calls / 300) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-sm font-semibold text-steel-100">{data.calls}</span>
                  <span className="text-xs text-steel-400 ml-1">llamadas</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tablas de rendimiento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Top performers */}
        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <h3 className="text-lg font-bold text-steel-100 mb-6">Top Operadores</h3>
          <div className="space-y-4">
            {analyticsData.topPerformers.map((performer, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-steel-700/30 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-sm">#{index + 1}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-steel-100">{performer.name}</p>
                    <p className="text-sm text-steel-400">{performer.calls} llamadas</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-emerald-400">{performer.rate}%</p>
                  <p className="text-xs text-steel-400">éxito</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Razones de llamada */}
        <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
          <h3 className="text-lg font-bold text-steel-100 mb-6">Razones de Llamada</h3>
          <div className="space-y-4">
            {analyticsData.callReasons.map((reason, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-steel-300">{reason.reason}</span>
                  <span className="text-sm font-semibold text-steel-100">{reason.count}</span>
                </div>
                <div className="w-full bg-steel-700/50 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-emerald-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${reason.percentage}%` }}
                  ></div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-steel-400">{reason.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Resumen de rendimiento */}
      <div className="bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 p-6">
        <h3 className="text-lg font-bold text-steel-100 mb-6">Resumen de Rendimiento</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-steel-700/30 rounded-lg">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <p className="text-2xl font-bold text-steel-100">+15.3%</p>
            <p className="text-sm text-steel-400">Crecimiento de llamadas</p>
          </div>
          
          <div className="text-center p-4 bg-steel-700/30 rounded-lg">
            <div className="w-12 h-12 bg-blue-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-steel-100">87.3%</p>
            <p className="text-sm text-steel-400">Objetivo de éxito</p>
          </div>
          
          <div className="text-center p-4 bg-steel-700/30 rounded-lg">
            <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Activity className="w-6 h-6 text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-steel-100">4:32</p>
            <p className="text-sm text-steel-400">Tiempo promedio</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Componente de Notificaciones con Portal
function NotificationDropdown({ 
  show, 
  onClose, 
  notifications, 
  onMarkAllRead 
}: { 
  show: boolean; 
  onClose: () => void; 
  notifications: any[]; 
  onMarkAllRead: () => void; 
}) {
  if (!show) return null;

  return createPortal(
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 z-[99999]" 
        onClick={onClose}
      ></div>
      
      {/* Dropdown */}
      <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-steel-800/95 backdrop-blur-xl rounded-xl shadow-2xl border border-steel-700/50 z-[99999] transform -translate-x-0 sm:translate-x-0">
        <div className="p-4 border-b border-steel-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-steel-100">Notificaciones</h3>
            <span className="text-sm text-steel-400">
              {notifications.filter(n => !n.read).length} nuevas
            </span>
          </div>
        </div>
        
        <div className="max-h-96 overflow-y-auto">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border-b border-steel-700/30 hover:bg-steel-700/30 transition-colors ${
                !notification.read ? 'bg-steel-700/20' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  notification.type === 'success' ? 'bg-emerald-500' :
                  notification.type === 'error' ? 'bg-red-500' :
                  'bg-blue-500'
                }`}></div>
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-steel-100">
                    {notification.title}
                  </h4>
                  <p className="text-sm text-steel-400 mt-1">
                    {notification.message}
                  </p>
                  <p className="text-xs text-steel-500 mt-2">
                    {notification.time}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t border-steel-700/50">
          <button 
            onClick={onMarkAllRead}
            className="w-full text-sm text-emerald-400 hover:text-emerald-300 font-medium"
          >
            Marcar todas como leídas
          </button>
        </div>
      </div>
    </>,
    document.body
  );
}

function Dashboard({ user }: { user: User }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'calls' | 'analytics' | 'settings'>('dashboard');

  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Lote 1 completado",
      message: "10 llamadas procesadas exitosamente",
      time: "Hace 2 minutos",
      type: "success",
      read: false
    },
    {
      id: 2,
      title: "Nuevo archivo procesado",
      message: "25 registros únicos encontrados",
      time: "Hace 5 minutos",
      type: "info",
      read: false
    },
    {
      id: 3,
      title: "Lote 3 falló",
      message: "Error en la conexión con n8n",
      time: "Hace 10 minutos",
      type: "error",
      read: true
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-charcoal-950 via-steel-950 to-platinum-950 flex relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-steel-800/10 opacity-40"></div>
      
      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-80 bg-steel-900/95 backdrop-blur-xl shadow-2xl border-r border-steel-700/50 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 lg:static lg:inset-0`}>
        <div className="flex items-center justify-between h-20 px-8 border-b border-gray-700/50">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/25">
              <Phone className="w-8 h-8 text-black" />
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-100">DealVox</span>
              <p className="text-xs text-gray-400 font-medium">Call Center Dashboard</p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
          >
            <X className="w-6 h-6 text-gray-300" />
          </button>
        </div>

        <nav className="mt-8 px-6">
          <div className="space-y-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                activeTab === 'dashboard' 
                  ? 'text-black bg-emerald-500 shadow-lg shadow-emerald-500/25' 
                  : 'text-steel-300 hover:text-steel-100 hover:bg-steel-700/50'
              }`}
            >
              <Phone className="w-6 h-6 mr-4" />
              Centro de Llamadas
            </button>
            <button 
              onClick={() => setActiveTab('calls')}
              className={`w-full flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                activeTab === 'calls' 
                  ? 'text-black bg-emerald-500 shadow-lg shadow-emerald-500/25' 
                  : 'text-steel-300 hover:text-steel-100 hover:bg-steel-700/50'
              }`}
            >
              <Phone className="w-6 h-6 mr-4" />
              Llamadas
            </button>
            <button 
              onClick={() => setActiveTab('analytics')}
              className={`w-full flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                activeTab === 'analytics' 
                  ? 'text-black bg-emerald-500 shadow-lg shadow-emerald-500/25' 
                  : 'text-steel-300 hover:text-steel-100 hover:bg-steel-700/50'
              }`}
            >
              <BarChart3 className="w-6 h-6 mr-4" />
              Analíticas
            </button>
            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center px-4 py-4 text-base font-medium rounded-2xl transition-all duration-200 ${
                activeTab === 'settings' 
                  ? 'text-black bg-emerald-500 shadow-lg shadow-emerald-500/25' 
                  : 'text-steel-300 hover:text-steel-100 hover:bg-steel-700/50'
              }`}
            >
              <Settings className="w-6 h-6 mr-4" />
              Configuración
            </button>
          </div>
          

        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navigation */}
        <header className="bg-steel-900/80 backdrop-blur-xl shadow-sm border-b border-steel-700/50 h-20 relative z-10">
          <div className="flex items-center justify-between h-full px-8">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
              >
                <Menu className="w-6 h-6 text-gray-300" />
              </button>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar llamadas, clientes, reportes..."
                  className="pl-12 pr-4 py-3 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 w-96 text-base bg-gray-700/50 backdrop-blur-sm text-gray-100 placeholder-gray-400"
                />
              </div>
            </div>
            
            <div className="flex items-center space-x-6">
              <div className="relative z-[99998]">
                <button 
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="p-3 rounded-xl hover:bg-steel-700/50 relative transition-colors"
                >
                  <Bell className="w-6 h-6 text-steel-300" />
                  {notifications.filter(n => !n.read).length > 0 && (
                    <span className="absolute top-2 right-2 w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
                  )}
                </button>
                
                {/* Componente de Notificaciones con Portal */}
                <NotificationDropdown
                  show={showNotifications}
                  onClose={() => setShowNotifications(false)}
                  notifications={notifications}
                  onMarkAllRead={markAllAsRead}
                />
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/25">
                  <span className="text-black text-lg font-medium">
                    {user.email?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="hidden md:block">
                  <p className="text-base font-medium text-gray-100">{user.email}</p>
                  <p className="text-sm text-gray-500">Administrador</p>
                </div>
            <button
              onClick={() => signOut(auth)}
                  className="p-3 rounded-xl hover:bg-gray-700/50 text-gray-300 transition-colors"
                  title="Cerrar sesión"
            >
                  <LogOut className="w-6 h-6" />
            </button>
              </div>
            </div>
          </div>
        </header>

                {/* Dashboard Content */}
        <main className="flex-1 p-8 relative z-10">
          <div className="w-full max-w-6xl mx-auto">
            {/* Welcome Section */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-steel-100 mb-3 font-sans">
                DealVox - Centro de Llamadas
              </h1>
              <p className="text-lg text-steel-400 font-medium max-w-2xl mx-auto">
                Transforma tus cold calls en conversaciones de calidad. Automatiza, optimiza y convierte más prospects con inteligencia artificial
          </p>
        </div>

            {/* Simple KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SimpleKPICard 
                icon={FileSpreadsheet} 
                label="Archivos Procesados" 
                value="12" 
                color="blue"
              />
              <SimpleKPICard 
                icon={Phone} 
                label="Llamadas Realizadas" 
                value="1,234" 
                color="green"
              />
              <SimpleKPICard 
                icon={CheckCircle} 
                label="Tasa de Éxito" 
                value="87%" 
                color="purple"
              />
        </div>

            {activeTab === 'dashboard' && (
              <>
                {/* Main Excel Upload Section */}
                <div className="bg-gray-800/40 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-700/50 p-8 mb-8">
                  <h3 className="text-2xl font-bold text-gray-100 mb-6 text-center flex items-center justify-center">
                    <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mr-3">
                      <span className="text-black text-lg">📊</span>
      </div>
                    Procesar Archivo Excel
                  </h3>
                  
                  <ExcelUploader user={user} />
                </div>
              </>
            )}

            {activeTab === 'calls' && (
              <CallsPage />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsPage />
            )}

            {activeTab === 'settings' && (
              <div className="text-center py-20">
                <Settings className="w-16 h-16 text-steel-400 mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-steel-100 mb-2">Configuración</h2>
                <p className="text-steel-400">Próximamente: Panel de configuración</p>
              </div>
            )}

            {activeTab === 'dashboard' && (
              <>
              {/* Processing Steps */}
              <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FileSpreadsheet className="w-6 h-6 text-white" />
                  </div>
                  <h5 className="font-bold text-steel-100 mb-2 text-lg">1. Subir Excel</h5>
                  <p className="text-steel-400">Carga tu archivo con datos de clientes</p>
                </div>
                
                <div className="text-center p-6 bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <RotateCcw className="w-6 h-6 text-black" />
                  </div>
                  <h5 className="font-bold text-steel-100 mb-2 text-lg">2. Procesar Datos</h5>
                  <p className="text-steel-400">IA parsea y ordena la información</p>
                </div>
                
                <div className="text-center p-6 bg-steel-800/40 backdrop-blur-xl rounded-xl border border-steel-700/50 shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
                  <div className="w-12 h-12 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <Play className="w-6 h-6 text-black" />
                  </div>
                  <h5 className="font-bold text-steel-100 mb-2 text-lg">3. Automatizar</h5>
                  <p className="text-steel-400">n8n ejecuta las llamadas automáticamente</p>
                </div>
              </div>




              </>
            )}
          </div>
        </main>
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}

function SimpleKPICard({ 
  icon: Icon, 
  label, 
  value, 
  color 
}: { 
  icon: any; 
  label: string; 
  value: string; 
  color: 'blue' | 'green' | 'purple' | 'orange';
}) {
  const colorClasses = {
    blue: 'bg-blue-500',
    green: 'bg-emerald-500',
    purple: 'bg-emerald-500',
    orange: 'bg-emerald-500'
  };

  return (
    <div className="bg-gray-800/50 backdrop-blur-xl rounded-xl shadow-xl border border-gray-700/50 p-6 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300 transform hover:-translate-y-1">
      <div className="text-center">
        <div className={`w-12 h-12 ${colorClasses[color]} rounded-xl flex items-center justify-center mx-auto mb-4 shadow-lg`}>
          <Icon className="w-6 h-6 text-black" />
        </div>
        
        <div>
          <p className="text-2xl font-bold text-gray-100 mb-1">{value}</p>
          <p className="text-gray-400 font-medium">{label}</p>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<User | null>();
  useEffect(() => onAuthStateChanged(auth, setUser), []);

  if (user === undefined) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gray-800/20 opacity-40"></div>
      
      <div className="text-center relative z-10">
        <div className="w-20 h-20 bg-emerald-500 rounded-3xl flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl shadow-emerald-500/25">
          <Phone className="w-10 h-10 text-black" />
        </div>
        <p className="text-gray-300 font-medium text-xl">Cargando DealVox...</p>
      </div>
    </div>
  );
  if (!user) return <AuthScreen />;
  return <Dashboard user={user} />;
}