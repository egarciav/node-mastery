import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function EstructuraProyectoPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Estructura de Proyecto</h1>
      <p className="text-text-muted text-lg mb-8">Organizar código de forma escalable y mantenible</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Estructura por capas (recomendada)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Una buena estructura separa el código por <strong className="text-text">responsabilidad</strong>, no por tipo de archivo.
          Cada carpeta tiene un propósito claro: <code className="text-primary">controllers/</code> manejan HTTP,
          <code className="text-primary"> services/</code> contienen lógica de negocio, <code className="text-primary">models/</code>
          definen la BD. Esta separación hace que sea fácil encontrar cualquier cosa y testear cada capa independientemente:
        </p>

        <CodeBlock language="bash" filename="Estructura profesional" code={`src/
├── config/              # Configuraciones (DB, Redis, etc.)
│   ├── database.ts
│   ├── redis.ts
│   └── env.ts           # Validar variables de entorno
├── controllers/         # Reciben req/res, llaman a services
│   ├── authController.ts
│   ├── userController.ts
│   └── productController.ts
├── services/            # Lógica de negocio (sin HTTP)
│   ├── authService.ts
│   ├── userService.ts
│   └── productService.ts
├── models/              # Schemas de BD (Mongoose/Prisma)
│   ├── User.ts
│   └── Product.ts
├── middlewares/          # Middleware de Express
│   ├── auth.ts
│   ├── validate.ts
│   ├── errorHandler.ts
│   └── rateLimiter.ts
├── routes/              # Definición de rutas
│   ├── index.ts         # Agrupa todas las rutas
│   ├── authRoutes.ts
│   ├── userRoutes.ts
│   └── productRoutes.ts
├── schemas/             # Schemas de validación (Zod)
│   ├── authSchema.ts
│   └── userSchema.ts
├── utils/               # Funciones utilitarias
│   ├── AppError.ts
│   ├── asyncHandler.ts
│   └── logger.ts
├── types/               # Tipos TypeScript
│   ├── index.ts
│   └── express.d.ts
├── app.ts               # Configurar Express (middlewares, rutas)
└── server.ts            # Iniciar servidor (listen)`} />

        <InfoBox type="tip" title="Regla clave: app.ts vs server.ts">
          <code>app.ts</code> configura Express (middlewares, rutas, error handler) y lo exporta.
          <code> server.ts</code> importa app, conecta la BD y llama a <code>app.listen()</code>.
          Esta separación permite importar <code>app</code> en tests sin iniciar el servidor.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Flujo de una petición</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Es crucial entender <strong className="text-text">cómo fluye una petición</strong> a través de tu app.
          Cada capa tiene una responsabilidad única y pasa la información a la siguiente.
          Si alguien te pregunta "dónde va esta lógica", este diagrama te da la respuesta:
        </p>

        <CodeBlock language="bash" filename="Request flow" code={`Cliente → Request HTTP
  ↓
Express (app.ts)
  ↓
Middlewares globales (helmet, cors, json parser, rate limiter)
  ↓
Router (routes/userRoutes.ts)
  ↓
Middlewares de ruta (authenticate, validate)
  ↓
Controller (controllers/userController.ts)
  → Extrae datos de req, valida, llama al service
  ↓
Service (services/userService.ts)
  → Lógica de negocio pura. No conoce HTTP.
  ↓
Model (models/User.ts)
  → Interacción con la base de datos
  ↓
Response ← Controller formatea y envía res.json()`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Archivos base</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los dos archivos más importantes: <code className="text-primary">app.ts</code> configura Express
          (middlewares, rutas, error handler) y lo <strong className="text-text">exporta sin iniciarlo</strong>.
          <code className="text-primary"> server.ts</code> lo importa, conecta la BD y llama a <code className="text-primary">listen()</code>.
          Esta separación es <strong className="text-text">esencial para testing</strong> — los tests importan <code className="text-primary">app</code>
          directamente sin necesidad de levantar un servidor real:
        </p>

        <CodeBlock language="typescript" filename="src/app.ts" code={`import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { errorHandler } from './middlewares/errorHandler.js';
import { notFoundHandler } from './middlewares/notFound.js';
import routes from './routes/index.js';

const app = express();

// Middlewares globales
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10kb' }));

// Rutas
app.use('/api', routes);

// 404 handler
app.use(notFoundHandler);

// Error handler (siempre al final)
app.use(errorHandler);

export default app;`} />

        <CodeBlock language="typescript" filename="src/server.ts" code={`import app from './app.js';
import { connectDB } from './config/database.js';
import { env } from './config/env.js';

async function startServer() {
  await connectDB();

  app.listen(env.PORT, () => {
    console.log(\`Server running on port \${env.PORT} in \${env.NODE_ENV} mode\`);
  });
}

startServer().catch(console.error);`} />
      </section>
    </div>
  );
}
