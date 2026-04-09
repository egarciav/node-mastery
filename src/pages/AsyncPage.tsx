import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function AsyncPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Async: Callbacks → Promises → Await</h1>
      <p className="text-text-muted text-lg mb-8">La evolución del código asíncrono en Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué asíncrono?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js es <strong className="text-text">single-threaded</strong>. Si hicieras todo de forma síncrona
          (esperar a que termine cada operación antes de continuar), tu servidor se bloquearía con cada lectura de
          archivo, consulta a BD o petición HTTP. La programación asíncrona permite que Node.js siga trabajando
          mientras espera que las operaciones lentas terminen.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Era 1: Callbacks (2009-2015)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El patrón original de Node.js. Pasas una función como argumento que se ejecuta cuando la operación termina.
          Convención: el primer argumento del callback es siempre el <strong className="text-text">error</strong> (error-first callbacks).
        </p>

        <CodeBlock language="javascript" filename="callbacks.js" code={`import fs from 'fs';

// Error-first callback pattern
fs.readFile('./config.json', 'utf8', (err, data) => {
  if (err) {
    console.error('Error leyendo archivo:', err.message);
    return;
  }
  console.log('Contenido:', data);
});

// El problema: Callback Hell (Pyramid of Doom)
fs.readFile('./usuario.json', 'utf8', (err, userData) => {
  if (err) return console.error(err);
  const user = JSON.parse(userData);

  fs.readFile(\`./permisos/\${user.role}.json\`, 'utf8', (err, permsData) => {
    if (err) return console.error(err);
    const perms = JSON.parse(permsData);

    fs.readFile(\`./config/\${perms.configFile}\`, 'utf8', (err, configData) => {
      if (err) return console.error(err);
      const config = JSON.parse(configData);

      // 3 niveles de anidación... y puede seguir creciendo
      console.log('Config final:', config);
    });
  });
});`} />

        <InfoBox type="warning" title="Callback Hell">
          El código con callbacks anidados se vuelve difícil de leer, mantener y depurar.
          Cada operación asíncrona agrega un nivel de indentación. Este problema se conoce como
          <strong> "Callback Hell"</strong> o <strong>"Pyramid of Doom"</strong>.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Era 2: Promises (ES2015/ES6)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Una Promise representa un <strong className="text-text">valor que estará disponible en el futuro</strong>.
          Puede estar en tres estados: <strong className="text-text">pending</strong> (esperando),
          <strong className="text-text"> fulfilled</strong> (resuelta con éxito), o
          <strong className="text-text"> rejected</strong> (rechazada con error).
        </p>

        <CodeBlock language="javascript" filename="promises.js" code={`import { readFile } from 'fs/promises';

// Usar promises con .then()/.catch()
readFile('./config.json', 'utf8')
  .then(data => {
    console.log('Contenido:', data);
    return JSON.parse(data);
  })
  .then(config => {
    console.log('Puerto:', config.port);
  })
  .catch(err => {
    console.error('Error:', err.message);
  })
  .finally(() => {
    console.log('Operación completada (éxito o error)');
  });

// Crear tus propias Promises
function esperar(ms) {
  return new Promise((resolve, reject) => {
    if (ms < 0) reject(new Error('Tiempo no puede ser negativo'));
    setTimeout(() => resolve(\`Esperé \${ms}ms\`), ms);
  });
}

esperar(2000)
  .then(msg => console.log(msg))   // "Esperé 2000ms"
  .catch(err => console.error(err));

// Encadenar promises (adiós callback hell)
readFile('./usuario.json', 'utf8')
  .then(data => JSON.parse(data))
  .then(user => readFile(\`./permisos/\${user.role}.json\`, 'utf8'))
  .then(data => JSON.parse(data))
  .then(perms => readFile(\`./config/\${perms.configFile}\`, 'utf8'))
  .then(data => JSON.parse(data))
  .then(config => console.log('Config final:', config))
  .catch(err => console.error('Error en cualquier paso:', err));`} />

        <CodeBlock language="javascript" filename="Promise combinators" code={`// Promise.all — Espera a que TODAS se resuelvan (en paralelo)
const [users, products, orders] = await Promise.all([
  fetch('/api/users').then(r => r.json()),
  fetch('/api/products').then(r => r.json()),
  fetch('/api/orders').then(r => r.json()),
]);
// Si UNA falla, todo falla

// Promise.allSettled — Espera a que TODAS terminen (éxito o error)
const results = await Promise.allSettled([
  fetch('/api/users'),
  fetch('/api/broken-endpoint'),  // Este falla pero no afecta a los demás
]);
results.forEach(r => {
  if (r.status === 'fulfilled') console.log('OK:', r.value);
  if (r.status === 'rejected') console.log('Error:', r.reason);
});

// Promise.race — Retorna la primera que termine (éxito o error)
const fastest = await Promise.race([
  fetch('https://api1.example.com/data'),
  fetch('https://api2.example.com/data'),
]);

// Promise.any — Retorna la primera que RESUELVA (ignora errores)
const firstSuccess = await Promise.any([
  fetch('https://cdn1.example.com/file'),
  fetch('https://cdn2.example.com/file'),
]);`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Era 3: async/await (ES2017) — El estándar actual</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">async/await</code> es <strong className="text-text">sintactic sugar</strong> sobre
          Promises. Hace que el código asíncrono se lea como código síncrono, sin perder sus ventajas.
        </p>

        <CodeBlock language="javascript" filename="async-await.js — El estándar moderno" code={`import { readFile, writeFile } from 'fs/promises';

// Una función async SIEMPRE retorna una Promise
async function cargarConfig() {
  try {
    // await "pausa" la ejecución hasta que la Promise se resuelva
    const userData = await readFile('./usuario.json', 'utf8');
    const user = JSON.parse(userData);

    const permsData = await readFile(\`./permisos/\${user.role}.json\`, 'utf8');
    const perms = JSON.parse(permsData);

    const configData = await readFile(\`./config/\${perms.configFile}\`, 'utf8');
    const config = JSON.parse(configData);

    return config; // Esto se envuelve automáticamente en Promise.resolve(config)
  } catch (error) {
    // catch captura errores de CUALQUIER await anterior
    console.error('Error cargando config:', error.message);
    throw error; // Re-lanzar para que quien llame sepa que falló
  }
}

// Usar la función
const config = await cargarConfig();
console.log('Config:', config);`} />

        <CodeBlock language="javascript" filename="Patrones comunes con async/await" code={`// 1. Ejecución en paralelo (NO secuencial)
async function cargarDatos() {
  // MAL — Secuencial (uno espera al otro)
  const users = await fetch('/api/users');
  const products = await fetch('/api/products'); // espera a que users termine

  // BIEN — En paralelo (ambos al mismo tiempo)
  const [usersRes, productsRes] = await Promise.all([
    fetch('/api/users'),
    fetch('/api/products'),
  ]);
}

// 2. Loop con async/await
async function procesarArchivos(archivos) {
  // Secuencial (uno a la vez) — cuando el orden importa
  for (const archivo of archivos) {
    const data = await readFile(archivo, 'utf8');
    console.log(data);
  }

  // Paralelo (todos al mismo tiempo) — cuando el orden NO importa
  const resultados = await Promise.all(
    archivos.map(archivo => readFile(archivo, 'utf8'))
  );
}

// 3. Manejo de errores granular
async function obtenerUsuario(id) {
  let userData;
  try {
    userData = await db.findUser(id);
  } catch (err) {
    throw new Error(\`Usuario \${id} no encontrado\`);
  }

  let permisos;
  try {
    permisos = await db.findPermisos(userData.roleId);
  } catch (err) {
    // Error diferente, manejo diferente
    permisos = { nivel: 'basico' }; // fallback
  }

  return { ...userData, permisos };
}`} />

        <InfoBox type="tip" title="Regla de oro async/await">
          <strong>Siempre usa try/catch</strong> con await en código de producción. Un await sin try/catch
          que falle causará un <code>UnhandledPromiseRejection</code>, que en Node.js moderno termina el proceso.
          En Express, usa middleware de errores. En funciones standalone, siempre envuelve con try/catch.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Top-level await</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En ES Modules puedes usar <code className="text-primary">await</code> fuera de una función async:
        </p>

        <CodeBlock language="javascript" filename="top-level-await.mjs" code={`// Solo funciona en ES Modules (type: "module" en package.json)
import { readFile } from 'fs/promises';

// await directamente en el nivel superior del módulo
const config = JSON.parse(
  await readFile('./config.json', 'utf8')
);

console.log('Puerto:', config.port);

// Esto es útil para inicialización de módulos
export const db = await conectarBaseDeDatos();
export const cache = await inicializarRedis();`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Convertir callbacks a Promises</h2>

        <CodeBlock language="javascript" filename="Promisificar callbacks" code={`import { promisify } from 'util';
import { exec } from 'child_process';

// Forma 1: util.promisify (para funciones error-first callback)
const execAsync = promisify(exec);

async function obtenerVersion() {
  const { stdout } = await execAsync('node --version');
  return stdout.trim();
}

// Forma 2: Envolver manualmente
function leerArchivoPromise(ruta) {
  return new Promise((resolve, reject) => {
    fs.readFile(ruta, 'utf8', (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });
}

// Forma 3: Usar las versiones promises nativas (recomendada)
import { readFile } from 'fs/promises';      // fs ya tiene versión promises
import dns from 'dns/promises';               // dns también
import { setTimeout } from 'timers/promises'; // timers también

await setTimeout(1000); // esperar 1 segundo sin callback`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Resumen: ¿Qué usar en 2026?</h2>
        <div className="bg-surface-light border border-border rounded-xl p-4">
          <ul className="space-y-2 text-text-muted text-sm">
            <li>• <strong className="text-text">async/await</strong> — Usa esto siempre. Es el estándar.</li>
            <li>• <strong className="text-text">Promise.all()</strong> — Para ejecutar operaciones en paralelo.</li>
            <li>• <strong className="text-text">Promise.allSettled()</strong> — Cuando no quieres que un error cancele todo.</li>
            <li>• <strong className="text-text">try/catch</strong> — Siempre envuelve tus awaits en producción.</li>
            <li>• <strong className="text-text">Callbacks</strong> — Solo si la API no tiene versión Promise (cada vez más raro).</li>
            <li>• <strong className="text-text">.then()/.catch()</strong> — Ocasionalmente útil para encadenamientos simples.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
