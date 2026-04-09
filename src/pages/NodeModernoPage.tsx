import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NodeModernoPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Node.js Moderno (2024-2026)</h1>
      <p className="text-text-muted text-lg mb-8">Nuevas APIs y features que transforman el desarrollo con Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Fetch API nativa</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Desde Node.js 18+, <code>fetch()</code> está disponible globalmente sin instalar ningún paquete.
          Ya no necesitas <code>axios</code> o <code>node-fetch</code> para peticiones HTTP básicas.
        </p>

        <CodeBlock language="typescript" filename="Fetch nativo en Node.js" code={`// Disponible sin importar nada — global
const response = await fetch('https://api.example.com/users');
const users = await response.json();

// POST con body
const res = await fetch('https://api.example.com/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Carlos', email: 'c@mail.com' }),
});

// Con AbortController para timeout
const controller = new AbortController();
setTimeout(() => controller.abort(), 5000); // 5s timeout

const data = await fetch('https://api.slow.com/data', {
  signal: controller.signal,
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">ESM nativo y top-level await</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Con <code className="text-primary">"type": "module"</code> en package.json, Node.js usa ESM nativo.
          Esto habilita <strong className="text-text">top-level await</strong>: usar <code className="text-primary">await</code>
          directamente en el scope del módulo sin envolverlo en una función async. También tienes
          <code className="text-primary">import.meta</code> con información útil como la ruta del archivo actual:
        </p>

        <CodeBlock language="typescript" filename="ESM + top-level await" code={`// package.json: "type": "module"

// Top-level await — sin wrapper async
const config = await import('./config.js');
const db = await connectDatabase();

// import.meta
console.log(import.meta.url);      // file:///path/to/file.js
console.log(import.meta.dirname);   // /path/to (Node 21+)
console.log(import.meta.filename);  // /path/to/file.js (Node 21+)`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Otras novedades</h2>
        <div className="space-y-3">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Web Streams API</h3>
            <p className="text-text-muted text-sm">ReadableStream, WritableStream y TransformStream nativos, compatibles con el estándar web.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Structured Clone</h3>
            <p className="text-text-muted text-sm"><code>structuredClone(obj)</code> para deep copy sin lodash. Soporta Maps, Sets, Dates, RegExp.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Crypto.randomUUID()</h3>
            <p className="text-text-muted text-sm">Generar UUIDs v4 sin dependencias: <code>crypto.randomUUID()</code></p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Watch mode</h3>
            <p className="text-text-muted text-sm"><code>node --watch server.js</code> reinicia automáticamente al cambiar archivos. Sin nodemon.</p>
          </div>
        </div>

        <InfoBox type="tip" title="Mantente actualizado">
          Node.js lanza una versión major cada 6 meses. Las versiones pares (18, 20, 22) son LTS
          con soporte de 30 meses. Revisa <strong>nodejs.org/en/blog</strong> para novedades.
        </InfoBox>
      </section>
    </div>
  );
}
