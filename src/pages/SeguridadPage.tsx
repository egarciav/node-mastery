import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function SeguridadPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Seguridad en Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Proteger tu aplicación contra las vulnerabilidades más comunes</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">OWASP Top 10 — Lo esencial</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">Injection (SQL/NoSQL)</h3>
            <p className="text-text-muted text-sm">Nunca concatenar input del usuario en queries. Usar ORMs (Prisma, Mongoose) o queries parametrizados.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">Broken Authentication</h3>
            <p className="text-text-muted text-sm">Hashear passwords con bcrypt (cost 12+). Usar JWT con expiración corta. Implementar rate limiting en login.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">XSS (Cross-Site Scripting)</h3>
            <p className="text-text-muted text-sm">Sanitizar output HTML. Usar Content-Security-Policy con Helmet. Escapar datos del usuario.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">CSRF (Cross-Site Request Forgery)</h3>
            <p className="text-text-muted text-sm">Usar tokens CSRF para formularios. APIs REST con JWT son menos vulnerables (no usan cookies por defecto).</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Configuración de seguridad</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Estos middlewares cubren las defensas esenciales: <code className="text-primary">helmet</code> configura
          headers HTTP de seguridad (CSP, HSTS, X-Frame), <code className="text-primary">cors</code> restringe
          qué dominios pueden llamar tu API, <code className="text-primary">rateLimit</code> previene fuerza bruta,
          y <code className="text-primary">mongoSanitize</code> bloquea inyecciones NoSQL:
        </p>

        <CodeBlock language="typescript" filename="Middleware de seguridad" code={`import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';

const app = express();

// Headers de seguridad (CSP, HSTS, etc.)
app.use(helmet());

// CORS restrictivo
app.use(cors({
  origin: ['https://mi-frontend.com'],
  credentials: true,
}));

// Rate limiting global
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 min
  max: 100,                    // 100 requests por IP
  standardHeaders: true,
}));

// Rate limiting estricto para auth
app.use('/api/auth', rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,  // Solo 10 intentos de login por 15 min
}));

// Sanitizar queries NoSQL
app.use(mongoSanitize());

// Limitar tamaño del body
app.use(express.json({ limit: '10kb' }));`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Checklist de seguridad</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las dependencias de npm pueden tener vulnerabilidades conocidas. <code className="text-primary">npm audit</code>
          las detecta y <code className="text-primary">npm audit fix</code> intenta corregirlas automáticamente.
          Ejecuta esto regularmente y antes de cada deploy:
        </p>

        <CodeBlock language="bash" filename="Auditoría de dependencias" code={`# Buscar vulnerabilidades en dependencias
npm audit

# Corregir automáticamente
npm audit fix

# Mantener dependencias actualizadas
npx npm-check-updates -u`} />

        <InfoBox type="warning" title="Nunca confíes en el input del usuario">
          <strong>Todo input es potencialmente malicioso.</strong> Valida con Zod, sanitiza con
          express-mongo-sanitize, escapa HTML, limita tamaños, y usa tipos estrictos con TypeScript.
          La seguridad no es un feature opcional — es un requisito fundamental.
        </InfoBox>
      </section>
    </div>
  );
}
