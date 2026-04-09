import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ProcessTimersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Process y Timers</h1>
      <p className="text-text-muted text-lg mb-8">El objeto global process, señales del SO y temporizadores</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El objeto process</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">process</code> es un objeto global que proporciona información y control sobre
          el proceso de Node.js actual. No necesitas importarlo — está disponible en todas partes.
        </p>

        <CodeBlock language="javascript" filename="process — Propiedades útiles" code={`// Información del proceso
console.log(process.pid);          // ID del proceso
console.log(process.ppid);         // ID del proceso padre
console.log(process.version);      // 'v22.x.x'
console.log(process.versions);     // { node, v8, openssl, ... }
console.log(process.platform);     // 'win32', 'linux', 'darwin'
console.log(process.arch);         // 'x64', 'arm64'
console.log(process.cwd());        // Directorio de trabajo actual
console.log(process.title);        // Título del proceso

// Uso de memoria
const mem = process.memoryUsage();
console.log('RSS:', (mem.rss / 1024 / 1024).toFixed(1), 'MB');
console.log('Heap usado:', (mem.heapUsed / 1024 / 1024).toFixed(1), 'MB');
console.log('Heap total:', (mem.heapTotal / 1024 / 1024).toFixed(1), 'MB');

// Tiempo de ejecución
console.log('Uptime:', process.uptime().toFixed(1), 'segundos');

// High-resolution time (para medir performance)
const start = process.hrtime.bigint();
// ... operación costosa ...
const end = process.hrtime.bigint();
console.log(\`Tomó \${(end - start) / 1000000n}ms\`);`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Variables de entorno y argumentos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">process.env</code> contiene todas las variables de entorno del sistema.
          <code className="text-primary"> process.argv</code> contiene los argumentos de línea de comandos.
          Node 18.11+ incluye <code className="text-primary">parseArgs</code> nativo para parsear argumentos sin librerías externas:
        </p>

        <CodeBlock language="javascript" filename="env y argv" code={`// Variables de entorno
console.log(process.env.NODE_ENV);     // 'development', 'production'
console.log(process.env.PORT);         // '3000'
console.log(process.env.DATABASE_URL); // 'postgres://...'

// Argumentos de línea de comandos
// node app.js --port 3000 --verbose
console.log(process.argv);
// ['/usr/bin/node', '/app/app.js', '--port', '3000', '--verbose']

// process.argv[0] = ruta de node
// process.argv[1] = ruta del script
// process.argv[2+] = argumentos del usuario

// Parsear argumentos simple
const args = process.argv.slice(2);
const portIndex = args.indexOf('--port');
const port = portIndex !== -1 ? args[portIndex + 1] : 3000;

// Node 18.11+: parseArgs nativo
import { parseArgs } from 'util';
const { values } = parseArgs({
  options: {
    port: { type: 'string', short: 'p', default: '3000' },
    verbose: { type: 'boolean', short: 'v', default: false },
  },
});
console.log(values.port);    // '3000'
console.log(values.verbose); // false`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Señales y salida del proceso</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Tu app debe manejar señales del SO para cerrar limpiamente (<strong className="text-text">graceful shutdown</strong>).
          <code className="text-primary">SIGINT</code> se envía al presionar Ctrl+C, <code className="text-primary">SIGTERM</code>
          lo envían Docker, PM2 y los deploys. También debes capturar errores no manejados para loguearlos
          antes de terminar:
        </p>

        <CodeBlock language="javascript" filename="Graceful shutdown" code={`// Salir del proceso
process.exit(0);  // Salida exitosa
process.exit(1);  // Salida con error

// Exit code sin forzar salida
process.exitCode = 1;

// Capturar señales del SO (graceful shutdown)
process.on('SIGINT', () => {
  // Ctrl+C en la terminal
  console.log('\\nRecibido SIGINT. Cerrando gracefully...');
  // Cerrar conexiones a BD, terminar peticiones pendientes, etc.
  server.close(() => {
    console.log('Servidor cerrado limpiamente');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  // Signal de terminación (Docker, PM2, kill)
  console.log('Recibido SIGTERM. Shutdown...');
  process.exit(0);
});

// Capturar errores no manejados
process.on('uncaughtException', (err) => {
  console.error('UNCAUGHT EXCEPTION:', err);
  process.exit(1); // Siempre terminar — el estado es inconsistente
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('UNHANDLED REJECTION:', reason);
  // En Node.js moderno esto ya termina el proceso por defecto
});`} />

        <InfoBox type="warning" title="Graceful Shutdown">
          En producción <strong>siempre</strong> implementa graceful shutdown. Cuando tu app recibe SIGTERM
          (Docker stop, deploy, etc.), debe: 1) Dejar de aceptar nuevas conexiones, 2) Terminar peticiones
          en curso, 3) Cerrar conexiones a BD/Redis, 4) Luego terminar. Esto evita pérdida de datos.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Timers</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js ofrece los timers clásicos (<code className="text-primary">setTimeout</code>,
          <code className="text-primary"> setInterval</code>, <code className="text-primary">setImmediate</code>)
          más versiones modernas basadas en Promises desde <code className="text-primary">timers/promises</code>
          que se pueden usar con <code className="text-primary">await</code> y <code className="text-primary">for await</code>:
        </p>

        <CodeBlock language="javascript" filename="Timers en Node.js" code={`// setTimeout — Ejecutar después de X ms
const timeoutId = setTimeout(() => {
  console.log('Ejecutado después de 2 segundos');
}, 2000);
clearTimeout(timeoutId); // Cancelar

// setInterval — Ejecutar cada X ms
const intervalId = setInterval(() => {
  console.log('Cada 5 segundos');
}, 5000);
clearInterval(intervalId); // Cancelar

// setImmediate — Ejecutar en la siguiente iteración del Event Loop
const immediateId = setImmediate(() => {
  console.log('Después de I/O, antes del próximo timer');
});
clearImmediate(immediateId);

// Timers con Promises (Node 16+)
import { setTimeout, setInterval } from 'timers/promises';

// await setTimeout — reemplazo limpio
await setTimeout(2000);
console.log('2 segundos después');

// setInterval como async iterable
const interval = setInterval(1000);
for await (const _ of interval) {
  console.log('Cada segundo');
  // break cuando quieras parar
}`} />
      </section>
    </div>
  );
}
