import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function RedisPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Redis</h1>
      <p className="text-text-muted text-lg mb-8">Caché en memoria, sesiones, colas y pub/sub</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es Redis?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Redis es un <strong className="text-text">almacén de datos en memoria</strong> ultrarrápido. Se usa como
          caché, almacén de sesiones, cola de mensajes, y sistema pub/sub. Es clave-valor y soporta
          estructuras de datos como strings, hashes, listas, sets y sorted sets.
        </p>

        <CodeBlock language="bash" code={`npm install ioredis`} />

        <CodeBlock language="javascript" filename="config/redis.js" code={`import Redis from 'ioredis';

const redis = new Redis({
  host: process.env.REDIS_HOST || 'localhost',
  port: process.env.REDIS_PORT || 6379,
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: 3,
});

redis.on('connect', () => console.log('Redis conectado'));
redis.on('error', (err) => console.error('Redis error:', err));

export default redis;`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Caché de API responses</h2>

        <CodeBlock language="javascript" filename="middlewares/cache.js" code={`import redis from '../config/redis.js';

export function cache(ttlSeconds = 300) {
  return async (req, res, next) => {
    // Solo cachear GET requests
    if (req.method !== 'GET') return next();

    const key = \`cache:\${req.originalUrl}\`;

    try {
      const cached = await redis.get(key);
      if (cached) {
        return res.json(JSON.parse(cached));
      }

      // Interceptar res.json para cachear la respuesta
      const originalJson = res.json.bind(res);
      res.json = (body) => {
        redis.setex(key, ttlSeconds, JSON.stringify(body));
        return originalJson(body);
      };

      next();
    } catch (err) {
      // Si Redis falla, continuar sin caché
      next();
    }
  };
}

// Invalidar caché
export async function invalidateCache(pattern) {
  const keys = await redis.keys(\`cache:\${pattern}\`);
  if (keys.length > 0) {
    await redis.del(...keys);
  }
}

// Uso en rutas:
router.get('/products', cache(600), getProducts);  // Cache 10 min
router.get('/products/:id', cache(300), getProductById);

// Invalidar al modificar
router.post('/products', authenticate, async (req, res) => {
  await createProduct(req, res);
  await invalidateCache('/api/products*');
});`} />

        <InfoBox type="tip" title="Cuándo usar caché">
          Cachea datos que: se leen mucho más de lo que se escriben, no necesitan ser 100% frescos,
          y son costosos de calcular/consultar. Ejemplos: listas de productos, perfiles de usuario,
          configuraciones. <strong>No cachees</strong> datos sensibles o que cambian cada segundo.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Sesiones con Redis</h2>

        <CodeBlock language="javascript" filename="Almacenar sesiones en Redis" code={`import session from 'express-session';
import RedisStore from 'connect-redis';
import redis from './config/redis.js';

app.use(session({
  store: new RedisStore({ client: redis }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 día
  },
}));`} />
      </section>
    </div>
  );
}
