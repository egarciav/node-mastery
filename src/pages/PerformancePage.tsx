import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PerformancePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Performance y Optimización</h1>
      <p className="text-text-muted text-lg mb-8">Profiling, memory leaks y técnicas para mejorar el rendimiento</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Identificar cuellos de botella</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Antes de optimizar, necesitas <strong className="text-text">medir</strong>. Sin datos, estás adivinando.
          Node.js ofrece varias formas de medir rendimiento, desde lo más simple (<code className="text-primary">console.time</code>)
          hasta profiling completo con Chrome DevTools. Empieza siempre por lo más simple:
        </p>

        <CodeBlock language="typescript" filename="Medir tiempo de ejecución" code={`// 1. console.time (rápido y simple)
console.time('db-query');
const users = await db.user.findMany();
console.timeEnd('db-query'); // db-query: 45.123ms

// 2. Performance API (más preciso)
import { performance } from 'perf_hooks';

const start = performance.now();
await heavyOperation();
const duration = performance.now() - start;
console.log(\`Duration: \${duration.toFixed(2)}ms\`);

// 3. Profiling con --inspect
// node --inspect src/server.js
// Abrir chrome://inspect en Chrome → Profile`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Memory Leaks</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un <strong className="text-text">memory leak</strong> ocurre cuando tu app retiene memoria que ya no necesita.
          Con el tiempo, el consumo crece hasta que el proceso crashea con "heap out of memory".
          Son difíciles de detectar porque la app funciona bien al principio y falla horas o días después.
          Aquí las causas más comunes y cómo evitarlas:
        </p>

        <CodeBlock language="typescript" filename="Causas comunes de memory leaks" code={`// ❌ MAL: Array que crece sin límite (caché sin expiración)
const cache: Record<string, unknown> = {};
app.get('/api/data/:id', async (req, res) => {
  if (!cache[req.params.id]) {
    cache[req.params.id] = await fetchFromDB(req.params.id);
    // Nunca se limpia → memory leak
  }
  res.json(cache[req.params.id]);
});

// ✅ BIEN: Usar LRU cache con tamaño máximo
import { LRUCache } from 'lru-cache';
const cache = new LRUCache<string, unknown>({ max: 500, ttl: 1000 * 60 * 5 });

// ❌ MAL: Event listeners acumulados
setInterval(() => {
  emitter.on('data', handler); // Se añade uno nuevo cada vez
}, 1000);

// ✅ BIEN: Limpiar listeners
emitter.once('data', handler);  // Se auto-elimina
// O remover explícitamente
emitter.off('data', handler);`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Para detectar leaks, monitorea el uso de memoria periódicamente. Si <code className="text-primary">heapUsed</code>
          crece constantemente sin bajar después del garbage collection, tienes un leak:
        </p>

        <CodeBlock language="bash" filename="Monitorear memoria" code={`# Verificar uso de memoria
node --max-old-space-size=512 server.js  # Limitar heap

# En código:
const used = process.memoryUsage();
console.log({
  rss: \`\${Math.round(used.rss / 1024 / 1024)} MB\`,        // Total
  heapUsed: \`\${Math.round(used.heapUsed / 1024 / 1024)} MB\`, // Heap usado
  external: \`\${Math.round(used.external / 1024 / 1024)} MB\`,  // C++ objects
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Optimizaciones comunes</h2>
        <div className="space-y-3">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Usar .lean() en Mongoose</h3>
            <p className="text-text-muted text-sm">Retorna objetos JS planos en vez de documentos Mongoose. 5-10x más rápido para lecturas.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Seleccionar solo campos necesarios</h3>
            <p className="text-text-muted text-sm"><code>User.find().select('name email')</code> en vez de traer todos los campos.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Índices en la base de datos</h3>
            <p className="text-text-muted text-sm">Crear índices para campos que se buscan frecuentemente. Sin índice, cada query es un full scan.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Compresión gzip</h3>
            <p className="text-text-muted text-sm"><code>app.use(compression())</code> reduce el tamaño de las respuestas 60-80%.</p>
          </div>
        </div>

        <InfoBox type="tip" title="Regla de oro">
          <strong>No optimices prematuramente.</strong> Primero mide, identifica el cuello de botella real,
          y solo entonces optimiza. El 80% de los problemas de performance en Node.js son:
          queries sin índices, N+1 queries, y falta de caché.
        </InfoBox>
      </section>
    </div>
  );
}
