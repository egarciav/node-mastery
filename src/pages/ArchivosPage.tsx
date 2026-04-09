import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ArchivosPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Upload de Archivos</h1>
      <p className="text-text-muted text-lg mb-8">Subir imágenes y archivos con Multer</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Multer — Middleware para file uploads</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">Multer</code> intercepta peticiones <code className="text-primary">multipart/form-data</code>
          y maneja la subida de archivos. Configuras: dónde guardarlos (<code className="text-primary">diskStorage</code>
          o <code className="text-primary">memoryStorage</code>), cómo nombrarlos (nunca uses el nombre original del usuario),
          qué tipos aceptar, y el tamaño máximo:
        </p>

        <CodeBlock language="bash" code={`npm install multer`} />

        <CodeBlock language="javascript" filename="middlewares/upload.js" code={`import multer from 'multer';
import path from 'path';
import { AppError } from '../utils/AppError.js';

// Configurar almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta de destino
  },
  filename: (req, file, cb) => {
    // Generar nombre único: timestamp-random.ext
    const uniqueName = \`\${Date.now()}-\${Math.round(Math.random() * 1E9)}\`;
    const ext = path.extname(file.originalname);
    cb(null, \`\${uniqueName}\${ext}\`);
  }
});

// Filtrar tipos de archivo
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError('Tipo de archivo no permitido. Solo: JPG, PNG, WebP, GIF', 400), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB máximo
    files: 5                    // Máximo 5 archivos
  }
});

// Para guardar en memoria (útil para subir a S3/Cloudinary)
export const uploadMemory = multer({
  storage: multer.memoryStorage(),
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }
});`} />

        <p className="text-text-muted leading-relaxed mb-4">
          En las rutas, usas <code className="text-primary">upload.single('campo')</code> para un archivo
          o <code className="text-primary">upload.array('campo', max)</code> para varios. Después del middleware,
          <code className="text-primary"> req.file</code> (o <code className="text-primary">req.files</code>) contiene
          la info del archivo subido:
        </p>

        <CodeBlock language="javascript" filename="Usar en rutas" code={`import { upload } from '../middlewares/upload.js';

// Subir un archivo
router.post('/avatar',
  authenticate,
  upload.single('avatar'),  // 'avatar' = nombre del campo del form
  async (req, res) => {
    // req.file contiene la info del archivo subido
    const { filename, path, size, mimetype } = req.file;

    await User.findByIdAndUpdate(req.user.userId, {
      avatar: \`/uploads/\${filename}\`
    });

    res.json({
      status: 'success',
      data: { url: \`/uploads/\${filename}\`, size }
    });
  }
);

// Subir múltiples archivos
router.post('/gallery',
  authenticate,
  upload.array('photos', 10),  // Máximo 10 fotos
  async (req, res) => {
    // req.files es un array de archivos
    const urls = req.files.map(f => \`/uploads/\${f.filename}\`);
    res.json({ status: 'success', data: { urls } });
  }
);`} />

        <InfoBox type="warning" title="Seguridad en uploads">
          <strong>Siempre:</strong> Valida el tipo MIME, limita el tamaño, genera nombres aleatorios
          (nunca uses el nombre original del usuario), y sirve archivos desde un directorio separado.
          En producción, sube a un servicio como S3 o Cloudinary en vez del disco local.
        </InfoBox>
      </section>
    </div>
  );
}
