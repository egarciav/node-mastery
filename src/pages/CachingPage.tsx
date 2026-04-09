import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function CachingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Estrategias de Caching</h1>
      <p className="text-text-muted text-lg mb-8">In-memory, Redis y HTTP caching para acelerar tu API</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Niveles de caché</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">In-Memory (LRU Cache)</h3>
            <p className="text-text-muted text-sm">Más rápido. Se pierde al reiniciar. Ideal para datos pequeños y frecuentes. No se comparte entre procesos.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">Redis</h3>
            <p className="text-text-muted text-sm">Rápido. Persiste entre reinicios. Se comparte entre procesos/servidores. Ideal para producción.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-accent mb-1">HTTP Cache Headers</h3>
            <p className="text-text-muted text-sm">El cliente/CDN cachea la respuesta. Cero carga en el servidor para peticiones repetidas.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">In-Memory con LRU Cache</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          La caché más simple vive en la memoria del proceso. Un <strong className="text-text">LRU Cache</strong> (Least Recently Used)
          automáticamente elimina las entradas menos usadas cuando se llena, y expira entradas por TTL.
          El patrón es: buscar en caché primero, si no está ("cache miss"), ir a la BD y guardar el resultado:
        </p>

        <CodeBlock language="typescript" filename="Caché en memoria" code={`import { LRUCache } from 'lru-cache';

const cache = new LRUCache<string, unknown>({
  max: 500,              // Máximo 500 entradas
  ttl: 1000 * 60 * 5,   // 5 minutos TTL
});

async function getProduct(id: string) {
  const cached = cache.get(\`product:\${id}\`);
  if (cached) return cached; // Cache HIT

  const product = await db.product.findUnique({ where: { id } });
  cache.set(\`product:\${id}\`, product); // Guardar en caché
  return product;
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Middleware de caché con Redis</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Para producción con múltiples servidores, la caché in-memory no sirve (cada servidor tiene su propia copia).
          <strong className="text-text"> Redis</strong> es una base de datos en memoria compartida entre todos los procesos.
          Este middleware intercepta requests GET, busca en Redis, y si encuentra la respuesta cacheada la devuelve
          sin tocar tu BD. La técnica clave es interceptar <code className="text-primary">res.json()</code> para guardar automáticamente:
        </p>

        <CodeBlock language="typescript" filename="middlewares/cache.ts" code={`import { redis } from '../config/redis.js';

export function cacheMiddleware(ttlSeconds = 300) {
  return async (req, res, next) => {
    if (req.method !== 'GET') return next();

    const key = \`cache:\${req.originalUrl}\`;
    const cached = await redis.get(key);

    if (cached) {
      return res.json(JSON.parse(cached));
    }

    // Interceptar res.json para guardar en caché
    const originalJson = res.json.bind(res);
    res.json = (body) => {
      redis.setex(key, ttlSeconds, JSON.stringify(body));
      return originalJson(body);
    };

    next();
  };
}

// Uso en rutas
router.get('/api/products', cacheMiddleware(600), productController.list);`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Cache Invalidation</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El problema más difícil del caching: <strong className="text-text">¿cuándo borrar la caché?</strong>
          Si un usuario actualiza un producto, la caché antigua sigue sirviendo datos viejos.
          La solución: invalidar (borrar) la caché cada vez que se modifican los datos en la BD:
        </p>

        <CodeBlock language="typescript" filename="Invalidar caché al modificar datos" code={`async function updateProduct(id: string, data: UpdateProductDTO) {
  const product = await db.product.update({ where: { id }, data });

  // Invalidar caché específica
  await redis.del(\`cache:/api/products/\${id}\`);
  // Invalidar lista (patrón)
  const keys = await redis.keys('cache:/api/products?*');
  if (keys.length > 0) await redis.del(...keys);

  return product;
}`} />

        <InfoBox type="warning" title="Cache Invalidation es difícil">
          "There are only two hard things in Computer Science: cache invalidation and naming things."
          Estrategias: <strong>TTL corto</strong> (acepta datos ligeramente desactualizados),
          <strong> invalidación explícita</strong> (borra al mutar), o <strong>cache-aside</strong> (lee de BD si miss).
        </InfoBox>
      </section>
    </div>
  );
}
