import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ExpressIntroPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Introducción a Express.js</h1>
      <p className="text-text-muted text-lg mb-8">El framework web más popular de Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es Express.js?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Express.js es un <strong className="text-text">framework web minimalista y flexible</strong> para Node.js.
          Proporciona un conjunto robusto de características para construir aplicaciones web y APIs REST.
          Es el framework más usado del ecosistema Node.js con millones de descargas semanales.
        </p>

        <InfoBox type="info" title="¿Por qué Express?">
          Node.js tiene un módulo HTTP nativo, pero es muy bajo nivel. Express agrega: routing, middleware,
          parsing de body/query, manejo de errores, archivos estáticos, y más. Todo sin la complejidad
          de frameworks más grandes como NestJS.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tu primer servidor Express</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Empezamos con lo mínimo: crear un proyecto, instalar Express y <code className="text-primary">nodemon</code>
          (reinicia el server automáticamente al guardar cambios). El código muestra las operaciones
          básicas: parsear JSON, rutas GET/POST, parámetros de ruta y arranque del servidor:
        </p>

        <CodeBlock language="bash" filename="Setup" code={`mkdir mi-api && cd mi-api
npm init -y
npm install express
npm install -D nodemon`} />

        <CodeBlock language="javascript" filename="app.js — Servidor básico" code={`import express from 'express';

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Ruta GET básica
app.get('/', (req, res) => {
  res.json({ message: '¡Hola desde Express!' });
});

// Ruta con parámetro
app.get('/users/:id', (req, res) => {
  const { id } = req.params;
  res.json({ userId: id, name: \`Usuario \${id}\` });
});

// Ruta POST
app.post('/users', (req, res) => {
  const { name, email } = req.body;
  res.status(201).json({
    message: 'Usuario creado',
    user: { id: Date.now(), name, email }
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
});`} />

        <CodeBlock language="json" filename="package.json scripts" code={`{
  "scripts": {
    "start": "node app.js",
    "dev": "nodemon app.js"
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Estructura profesional de un proyecto Express</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un proyecto Express profesional separa responsabilidades en carpetas: <strong className="text-text">config</strong>
          (conexión a BD), <strong className="text-text">controllers</strong> (lógica de rutas), <strong className="text-text">middlewares</strong>
          (auth, validación, errores), <strong className="text-text">models</strong> (esquemas de datos),
          <strong className="text-text">routes</strong> (definición de endpoints), y <strong className="text-text">services</strong> (lógica de negocio):
        </p>

        <CodeBlock language="bash" filename="Estructura de carpetas recomendada" code={`mi-api/
├── src/
│   ├── config/          # Configuración (db, env, etc.)
│   │   └── database.js
│   ├── controllers/     # Lógica de las rutas
│   │   └── userController.js
│   ├── middlewares/      # Middleware custom
│   │   ├── auth.js
│   │   ├── validate.js
│   │   └── errorHandler.js
│   ├── models/          # Modelos de datos
│   │   └── User.js
│   ├── routes/          # Definición de rutas
│   │   ├── index.js
│   │   └── userRoutes.js
│   ├── services/        # Lógica de negocio
│   │   └── userService.js
│   ├── utils/           # Utilidades
│   │   └── helpers.js
│   ├── app.js           # Configuración de Express
│   └── server.js        # Punto de entrada
├── tests/
├── .env
├── .gitignore
└── package.json`} />

        <p className="text-text-muted leading-relaxed mb-4">
          La clave es separar <code className="text-primary">app.js</code> (configuración de Express: middlewares, rutas,
          error handler) de <code className="text-primary">server.js</code> (arranque del servidor). Esto permite
          importar <code className="text-primary">app</code> en tests sin iniciar el servidor real:
        </p>

        <CodeBlock language="javascript" filename="src/app.js — Separar app de server" code={`import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import { errorHandler } from './middlewares/errorHandler.js';
import routes from './routes/index.js';

const app = express();

// Middlewares globales
app.use(helmet());                    // Headers de seguridad
app.use(cors());                      // CORS
app.use(morgan('dev'));               // Logging de peticiones
app.use(express.json());             // Parsear JSON
app.use(express.urlencoded({ extended: true })); // Parsear forms

// Rutas
app.use('/api', routes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Manejo de errores (siempre al final)
app.use(errorHandler);

export default app;`} />

        <CodeBlock language="javascript" filename="src/server.js" code={`import app from './app.js';

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(\`🚀 Server running on http://localhost:\${PORT}\`);
});`} />

        <InfoBox type="tip" title="¿Por qué separar app.js de server.js?">
          Separar la <strong>configuración de Express</strong> (app.js) del <strong>inicio del servidor</strong> (server.js)
          permite importar <code>app</code> en tests sin iniciar el servidor real. Esto es esencial para testing con Supertest.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Métodos HTTP en Express</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Express mapea cada método HTTP a un método del objeto <code className="text-primary">app</code>.
          Cada ruta asocia un verbo HTTP + URL con una función handler.
          <code className="text-primary">app.all()</code> captura todos los métodos para una ruta específica:
        </p>

        <CodeBlock language="javascript" filename="Métodos HTTP" code={`// GET — Obtener datos
app.get('/api/products', getProducts);

// POST — Crear recurso
app.post('/api/products', createProduct);

// PUT — Reemplazar recurso completo
app.put('/api/products/:id', replaceProduct);

// PATCH — Actualizar parcialmente
app.patch('/api/products/:id', updateProduct);

// DELETE — Eliminar recurso
app.delete('/api/products/:id', deleteProduct);

// ALL — Todos los métodos HTTP
app.all('/api/secret', requireAuth, secretHandler);`} />
      </section>
    </div>
  );
}
