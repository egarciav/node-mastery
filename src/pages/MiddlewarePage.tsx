import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function MiddlewarePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Middleware en Express</h1>
      <p className="text-text-muted text-lg mb-8">El concepto más importante de Express — Funciones que procesan peticiones</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es un Middleware?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un middleware es una <strong className="text-text">función que tiene acceso al objeto request (req),
          response (res), y la función next()</strong>. Puede ejecutar código, modificar req/res,
          terminar el ciclo request-response, o pasar al siguiente middleware con <code className="text-primary">next()</code>.
        </p>

        <CodeBlock language="javascript" filename="Anatomía de un middleware" code={`// Un middleware tiene esta forma:
function miMiddleware(req, res, next) {
  // 1. Ejecutar alguna lógica
  console.log(\`[\${new Date().toISOString()}] \${req.method} \${req.url}\`);

  // 2. Modificar req o res
  req.requestTime = Date.now();

  // 3. Llamar a next() para pasar al siguiente middleware
  next();

  // O terminar la petición sin llamar a next():
  // res.status(403).json({ error: 'No autorizado' });
}

// Middleware de errores (4 parámetros)
function errorMiddleware(err, req, res, next) {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno' });
}`} />

        <CodeBlock language="bash" filename="Flujo de middlewares" code={`Request → Middleware 1 → Middleware 2 → Middleware 3 → Route Handler → Response

# Ejemplo concreto:
Request
  → cors()          (permite CORS)
  → helmet()        (headers de seguridad)
  → morgan()        (log de la petición)
  → express.json()  (parsea el body JSON)
  → authenticate()  (verifica JWT)
  → validate()      (valida los datos)
  → controller()    (lógica de negocio)
  → Response

# Si algún middleware NO llama a next(), la cadena se detiene ahí`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tipos de Middleware</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Existen tres niveles donde puedes aplicar middleware: <strong className="text-text">global</strong>
          (todas las peticiones), <strong className="text-text">de ruta</strong> (solo en rutas específicas),
          y <strong className="text-text">de Router</strong> (todas las rutas de un router). El nivel que elijas
          determina el alcance de la lógica:
        </p>

        <CodeBlock language="javascript" filename="1. Middleware de aplicación (global)" code={`import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';

const app = express();

// Se ejecutan en TODAS las peticiones
app.use(helmet());
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware custom global
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});`} />

        <CodeBlock language="javascript" filename="2. Middleware de ruta (específico)" code={`import { authenticate } from './middlewares/auth.js';
import { validateBody } from './middlewares/validate.js';

// Solo se ejecuta en esta ruta específica
app.post('/api/users',
  authenticate,          // Verificar token
  validateBody(schema),  // Validar body
  createUser             // Handler final
);

// Múltiples middlewares como array
const adminMiddlewares = [authenticate, requireAdmin, logAdminAction];
app.delete('/api/users/:id', adminMiddlewares, deleteUser);`} />

        <CodeBlock language="javascript" filename="3. Middleware de Router" code={`import { Router } from 'express';
const router = Router();

// Se aplica a TODAS las rutas de este router
router.use(authenticate);

router.get('/profile', getProfile);     // Requiere auth
router.put('/profile', updateProfile);  // Requiere auth

export default router;`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Middlewares esenciales</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Estos son middlewares que escribirás en casi todo proyecto. El <strong className="text-text">logger</strong>
          registra cada petición con su duración, el <strong className="text-text">authenticate</strong> verifica
          JWT tokens, y el <strong className="text-text">rate limiter</strong> protege contra abuso:
        </p>

        <CodeBlock language="javascript" filename="Logger personalizado" code={`function requestLogger(req, res, next) {
  const start = Date.now();

  // Capturar cuando la respuesta termine
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(
      \`\${req.method} \${req.originalUrl} \${res.statusCode} - \${duration}ms\`
    );
  });

  next();
}`} />

        <CodeBlock language="javascript" filename="Autenticación JWT" code={`import jwt from 'jsonwebtoken';

function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Agregar usuario al request
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}`} />

        <CodeBlock language="javascript" filename="Rate Limiter simple" code={`const requestCounts = new Map();

function rateLimiter(maxRequests = 100, windowMs = 60000) {
  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();
    const windowStart = now - windowMs;

    const requests = requestCounts.get(ip) || [];
    const recentRequests = requests.filter(time => time > windowStart);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        error: 'Demasiadas peticiones. Intenta más tarde.'
      });
    }

    recentRequests.push(now);
    requestCounts.set(ip, recentRequests);
    next();
  };
}

app.use(rateLimiter(100, 60000)); // 100 peticiones por minuto`} />

        <InfoBox type="warning" title="Orden de middlewares">
          El <strong>orden importa</strong>. Los middlewares se ejecutan en el orden en que los registras
          con <code>app.use()</code>. El middleware de errores siempre va <strong>al final</strong>.
          Los middlewares de parsing (json, urlencoded) van <strong>antes</strong> que las rutas.
        </InfoBox>
      </section>
    </div>
  );
}
