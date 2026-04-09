import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function RoutingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Routing en Express</h1>
      <p className="text-text-muted text-lg mb-8">Parámetros, query strings, Router y organización de rutas</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Parámetros de ruta</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los parámetros de ruta (precedidos por <code className="text-primary">:</code>) extraen valores
          dinámicos de la URL. Puedes tener múltiples parámetros y hasta parámetros opcionales.
          Todos llegan como strings en <code className="text-primary">req.params</code>:
        </p>

        <CodeBlock language="javascript" filename="Route params" code={`// Parámetro simple
app.get('/users/:id', (req, res) => {
  console.log(req.params.id); // "123"
  res.json({ userId: req.params.id });
});
// GET /users/123

// Múltiples parámetros
app.get('/users/:userId/posts/:postId', (req, res) => {
  const { userId, postId } = req.params;
  res.json({ userId, postId });
});
// GET /users/5/posts/42

// Parámetros opcionales con regex
app.get('/files/:name.:ext?', (req, res) => {
  const { name, ext } = req.params;
  res.json({ name, ext: ext || 'txt' });
});
// GET /files/readme       → { name: "readme", ext: "txt" }
// GET /files/readme.md    → { name: "readme", ext: "md" }`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Query Strings</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los query strings son los parámetros después del <code className="text-primary">?</code> en la URL.
          Express los parsea automáticamente en <code className="text-primary">req.query</code>.
          <strong className="text-text">Cuidado</strong>: todos los valores son strings, convierte a número si necesitas:
        </p>

        <CodeBlock language="javascript" filename="Query params" code={`// req.query contiene los parámetros de la URL después de ?
app.get('/api/products', (req, res) => {
  const { page = 1, limit = 10, sort, category } = req.query;

  console.log(page);      // "2"
  console.log(limit);     // "20"
  console.log(sort);      // "price"
  console.log(category);  // "electronics"

  // IMPORTANTE: Todos los valores de query son STRINGS
  // Convierte a número si necesitas
  const pageNum = parseInt(page, 10);
  const limitNum = parseInt(limit, 10);

  res.json({ page: pageNum, limit: limitNum, sort, category });
});
// GET /api/products?page=2&limit=20&sort=price&category=electronics`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Express Router</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">express.Router()</code> permite agrupar rutas relacionadas en módulos
          separados. Es esencial para mantener el código organizado en proyectos grandes.
        </p>

        <CodeBlock language="javascript" filename="routes/userRoutes.js" code={`import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateUser, deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { validateUser } from '../middlewares/validate.js';

const router = Router();

// Todas estas rutas tendrán el prefijo que se asigne en app.use()
router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', authenticate, validateUser, createUser);
router.put('/:id', authenticate, validateUser, updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;`} />

        <CodeBlock language="javascript" filename="routes/productRoutes.js" code={`import { Router } from 'express';
import { getProducts, createProduct } from '../controllers/productController.js';

const router = Router();

router.get('/', getProducts);
router.post('/', createProduct);

export default router;`} />

        <CodeBlock language="javascript" filename="routes/index.js — Archivo central" code={`import { Router } from 'express';
import userRoutes from './userRoutes.js';
import productRoutes from './productRoutes.js';
import authRoutes from './authRoutes.js';

const router = Router();

router.use('/users', userRoutes);       // /api/users/*
router.use('/products', productRoutes); // /api/products/*
router.use('/auth', authRoutes);        // /api/auth/*

export default router;`} />

        <CodeBlock language="javascript" filename="app.js" code={`import routes from './routes/index.js';

// Montar todas las rutas bajo /api
app.use('/api', routes);

// Resultado:
// GET  /api/users          → userRoutes → getUsers
// GET  /api/users/123      → userRoutes → getUserById
// POST /api/products       → productRoutes → createProduct
// POST /api/auth/login     → authRoutes → login`} />

        <InfoBox type="tip" title="Buena práctica">
          Usa un archivo <code>routes/index.js</code> como barrel que agrupa todos los routers.
          Así <code>app.js</code> solo tiene una línea: <code>app.use('/api', routes)</code>.
          Cada recurso (users, products, etc.) tiene su propio archivo de rutas.
        </InfoBox>
      </section>
    </div>
  );
}
