import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function SeguridadApiPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Seguridad en APIs</h1>
      <p className="text-text-muted text-lg mb-8">Helmet, CORS, rate limiting, y protección contra ataques comunes</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Checklist de seguridad para APIs</h2>

        <CodeBlock language="javascript" filename="app.js — Setup de seguridad completo" code={`import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// 1. HELMET — Headers de seguridad HTTP
app.use(helmet());

// 2. CORS — Control de orígenes permitidos
app.use(cors({
  origin: ['https://miapp.com', 'https://admin.miapp.com'],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// 3. RATE LIMITING — Prevenir brute force y DDoS
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutos
  max: 100,                    // 100 peticiones por ventana
  message: { error: 'Demasiadas peticiones. Intenta en 15 minutos.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Rate limit más estricto para auth
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,  // Solo 5 intentos de login cada 15 min
});
app.use('/api/auth/login', authLimiter);

// 4. PARSEO SEGURO
app.use(express.json({ limit: '10kb' })); // Limitar tamaño del body
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. SANITIZACIÓN — Prevenir NoSQL injection
app.use(mongoSanitize());
// Remueve $ y . de req.body, req.query, req.params
// { email: { "$gt": "" } } → { email: {} }`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Protecciones esenciales</h2>
        <div className="space-y-4">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-2">Contraseñas</h3>
            <p className="text-text-muted text-sm">Siempre hash con bcrypt (cost factor 12+). Nunca guardes passwords en texto plano. Nunca los retornes en respuestas JSON.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-2">Variables de entorno</h3>
            <p className="text-text-muted text-sm">JWT_SECRET, DATABASE_URL, API keys → siempre en <code className="text-primary">.env</code>. Nunca en el código. Añade <code className="text-primary">.env</code> a <code className="text-primary">.gitignore</code>.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-2">HTTPS</h3>
            <p className="text-text-muted text-sm">Siempre usa HTTPS en producción. Nunca transmitas tokens o credenciales sobre HTTP.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-2">Validación de input</h3>
            <p className="text-text-muted text-sm">Valida TODO input del usuario con Zod/Joi. Nunca confíes en datos del cliente.</p>
          </div>
        </div>

        <InfoBox type="warning" title="Las 3 reglas de seguridad">
          <strong>1. No confíes en el cliente</strong> — Valida todo en el servidor.<br/>
          <strong>2. Principio de menor privilegio</strong> — Da el mínimo acceso necesario.<br/>
          <strong>3. Defense in depth</strong> — Múltiples capas de seguridad, no una sola.
        </InfoBox>
      </section>
    </div>
  );
}
