import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ErroresExpressPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Manejo de Errores en Express</h1>
      <p className="text-text-muted text-lg mb-8">Errores centralizados, clases custom y async error handling</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Error Handler centralizado</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Express reconoce un middleware de errores por tener <strong className="text-text">4 parámetros</strong>:
          <code className="text-primary"> (err, req, res, next)</code>. Siempre va al final de la cadena de middlewares.
        </p>

        <CodeBlock language="javascript" filename="middlewares/errorHandler.js" code={`export function errorHandler(err, req, res, next) {
  console.error(\`[ERROR] \${err.message}\`);
  console.error(err.stack);

  // Error custom con statusCode
  const statusCode = err.statusCode || 500;
  const message = err.isOperational
    ? err.message
    : 'Error interno del servidor';

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    message,
    // Solo mostrar stack en desarrollo
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Clases de error personalizadas</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En vez de crear objetos de error genéricos, defines <strong className="text-text">clases específicas</strong>
          para cada tipo de error. Cada clase lleva su propio código HTTP y mensaje.
          La propiedad <code className="text-primary">isOperational</code> distingue errores controlados
          (usuario no encontrado) de errores inesperados (crash de BD) — estos últimos
          no deben exponer detalles internos al cliente:
        </p>

        <CodeBlock language="javascript" filename="utils/AppError.js" code={`export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true; // Errores controlados
    Error.captureStackTrace(this, this.constructor);
  }
}

export class NotFoundError extends AppError {
  constructor(resource = 'Recurso') {
    super(\`\${resource} no encontrado\`, 404);
  }
}

export class ValidationError extends AppError {
  constructor(message = 'Datos de entrada inválidos') {
    super(message, 422);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message = 'No autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'Acceso denegado') {
    super(message, 403);
  }
}`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Ahora tus controllers simplemente lanzan la excepción apropiada con <code className="text-primary">throw</code>.
          El error handler centralizado captura todo y responde con el código y mensaje correctos:
        </p>

        <CodeBlock language="javascript" filename="Usar los errores en controllers" code={`import { NotFoundError, ValidationError } from '../utils/AppError.js';

export async function getUserById(req, res, next) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new NotFoundError('Usuario');
    }

    res.json({ data: user });
  } catch (error) {
    next(error); // Pasa el error al errorHandler
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Async Error Wrapper</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Para evitar escribir try/catch en cada controller async, crea un wrapper:
        </p>

        <CodeBlock language="javascript" filename="utils/asyncHandler.js" code={`// Wrapper que captura errores de funciones async automáticamente
export function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Ahora los controllers son más limpios:
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.json({ data: users });
  // Si hay un error, se captura automáticamente y se pasa a next()
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) throw new NotFoundError('Usuario');
  res.json({ data: user });
});`} />

        <InfoBox type="tip" title="Express 5">
          Express 5 (en desarrollo) maneja automáticamente los errores de funciones async sin necesidad
          de un wrapper. Pero mientras uses Express 4, el <code>asyncHandler</code> es esencial.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Ruta 404 — Not Found</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando ninguna ruta coincide con la petición, Express pasa al siguiente middleware.
          Coloca un handler 404 <strong className="text-text">después de todas las rutas</strong> y <strong className="text-text">antes
          del error handler</strong> para capturar peticiones a rutas inexistentes:
        </p>

        <CodeBlock language="javascript" filename="app.js — Siempre antes del errorHandler" code={`// Todas las rutas...
app.use('/api', routes);

// Ruta 404 — Cuando ninguna ruta coincide
app.use((req, res, next) => {
  res.status(404).json({
    status: 'error',
    message: \`Ruta \${req.method} \${req.originalUrl} no encontrada\`
  });
});

// Error handler — Siempre al final
app.use(errorHandler);`} />
      </section>
    </div>
  );
}
