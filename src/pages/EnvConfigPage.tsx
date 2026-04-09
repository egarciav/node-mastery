import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function EnvConfigPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Variables de Entorno y Configuración</h1>
      <p className="text-text-muted text-lg mb-8">Gestionar configuración por entorno de forma segura</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Variables de entorno con dotenv</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las variables de entorno separan la <strong className="text-text">configuración del código</strong>.
          Credenciales, URLs de BD, claves API — todo va en un archivo <code className="text-primary">.env</code>
          que nunca se commitea a Git. <code className="text-primary">dotenv</code> carga estas variables
          en <code className="text-primary">process.env</code> al iniciar la app:
        </p>

        <CodeBlock language="bash" code={`npm install dotenv`} />

        <CodeBlock language="bash" filename=".env" code={`# Server
NODE_ENV=development
PORT=3000

# Database
DATABASE_URL=mongodb://localhost:27017/mi-api
# DATABASE_URL=postgresql://user:pass@localhost:5432/mi-api

# JWT
JWT_SECRET=tu-clave-secreta-muy-larga-y-aleatoria-1234
JWT_EXPIRES_IN=7d

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379

# External APIs
SMTP_HOST=smtp.gmail.com
SMTP_USER=email@gmail.com
SMTP_PASS=app-password`} />

        <p className="text-text-muted leading-relaxed mb-4">
          El archivo <code className="text-primary">.env.example</code> se commitea a Git como referencia
          para que otros desarrolladores sepan qué variables necesitan configurar, pero sin valores reales:
        </p>

        <CodeBlock language="bash" filename=".env.example — Commitear esto a Git" code={`NODE_ENV=development
PORT=3000
DATABASE_URL=mongodb://localhost:27017/mi-api
JWT_SECRET=change-me-in-production
JWT_EXPIRES_IN=7d
REDIS_HOST=localhost
REDIS_PORT=6379`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Validar variables de entorno con Zod</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En vez de acceder a <code className="text-primary">process.env</code> directamente (strings sin tipo, pueden faltar),
          valida todas las variables al arrancar con Zod. Si falta alguna, la app <strong className="text-text">falla
          inmediatamente</strong> con un mensaje claro en vez de crashear minutos después en un punto
          inesperado. Además obtenés tipos TypeScript correctos automáticamente:
        </p>

        <CodeBlock language="typescript" filename="config/env.ts" code={`import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),

  DATABASE_URL: z.string().url('DATABASE_URL debe ser una URL válida'),

  JWT_SECRET: z.string().min(32, 'JWT_SECRET debe tener al menos 32 caracteres'),
  JWT_EXPIRES_IN: z.string().default('7d'),

  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.coerce.number().default(6379),
  REDIS_PASSWORD: z.string().optional(),

  SMTP_HOST: z.string().optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
});

// Validar al iniciar — falla rápido si falta algo
const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Variables de entorno inválidas:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;

// Uso:
// import { env } from './config/env.js';
// console.log(env.PORT);        // number (tipado)
// console.log(env.JWT_SECRET);  // string (validado)`} />

        <InfoBox type="warning" title="Seguridad">
          <strong>NUNCA</strong> commitees <code>.env</code> a Git. Añádelo a <code>.gitignore</code>.
          Sí commitea <code>.env.example</code> con valores de ejemplo (sin secretos reales).
          En producción, usa los secrets del proveedor de hosting (Railway, Render, AWS, etc.).
        </InfoBox>
      </section>
    </div>
  );
}
