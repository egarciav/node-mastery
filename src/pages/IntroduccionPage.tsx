import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function IntroduccionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Introducción a Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Qué es Node.js, cómo funciona y por qué dominarlo en 2026</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es Node.js?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js es un <strong className="text-text">entorno de ejecución (runtime)</strong> para JavaScript
          del lado del servidor. Fue creado por Ryan Dahl en 2009 y está construido sobre el motor
          <strong className="text-text"> V8 de Google Chrome</strong>.
        </p>
        <p className="text-text-muted leading-relaxed mb-4">
          Antes de Node.js, JavaScript solo podía ejecutarse en el navegador. Node.js permite ejecutar
          JavaScript <strong className="text-text">fuera del navegador</strong>, lo que abrió la puerta a usar
          un solo lenguaje tanto en frontend como en backend.
        </p>

        <InfoBox type="info" title="Definición precisa">
          Node.js <strong>NO es un lenguaje de programación</strong> ni un framework. Es un
          <strong> runtime environment</strong> que permite ejecutar código JavaScript en el servidor,
          en la terminal, o en cualquier lugar fuera del navegador.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El Motor V8</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          V8 es el motor de JavaScript creado por Google para Chrome. Está escrito en C++ y su trabajo es
          <strong className="text-text"> compilar JavaScript a código máquina nativo</strong> en tiempo real
          (JIT compilation — Just In Time).
        </p>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js toma este motor y le agrega APIs de bajo nivel que JavaScript no tiene en el navegador:
          acceso al sistema de archivos, red, procesos del sistema operativo, etc.
        </p>

        <CodeBlock language="bash" filename="Relación entre las piezas" code={`# V8 = Motor que compila JS a código máquina
# libuv = Biblioteca C que maneja I/O asíncrono, event loop, threads
# Node.js = V8 + libuv + APIs nativas (fs, http, crypto, etc.)

# Piensa en V8 como el motor de un auto
# libuv como la transmisión
# Node.js como el auto completo`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Características Fundamentales</h2>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Single-threaded con Event Loop</h3>
            <p className="text-text-muted text-sm">
              Node.js usa <strong className="text-text">un solo hilo principal</strong> para ejecutar tu código JavaScript.
              Pero no se bloquea esperando operaciones lentas (leer archivos, consultar bases de datos) gracias al
              <strong className="text-text"> Event Loop</strong> y operaciones asíncronas no bloqueantes.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Non-blocking I/O</h3>
            <p className="text-text-muted text-sm">
              Cuando Node.js hace una operación de I/O (leer un archivo, hacer una petición HTTP, consultar una BD),
              <strong className="text-text"> no espera a que termine</strong>. Delega la operación al sistema operativo
              y sigue ejecutando código. Cuando la operación termina, ejecuta el callback correspondiente.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Orientado a Eventos</h3>
            <p className="text-text-muted text-sm">
              Node.js se basa en un <strong className="text-text">patrón de eventos</strong>. Muchos objetos en Node.js
              emiten eventos: un servidor HTTP emite un evento cuando recibe una petición, un stream emite un evento
              cuando hay datos disponibles, etc.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">NPM — El ecosistema más grande del mundo</h3>
            <p className="text-text-muted text-sm">
              NPM (Node Package Manager) es el registro de paquetes más grande del mundo con más de
              <strong className="text-text"> 2 millones de paquetes</strong>. Cualquier funcionalidad que necesites
              probablemente ya existe como un paquete npm.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tu primer programa en Node.js</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          A diferencia de un navegador, en Node.js no tienes <code className="text-primary">window</code> ni
          <code className="text-primary"> document</code>. En su lugar tienes objetos globales como
          <code className="text-primary"> process</code>, <code className="text-primary">__dirname</code>,
          <code className="text-primary"> Buffer</code>, etc.
        </p>

        <CodeBlock language="javascript" filename="hola.js" code={`// Tu primer programa en Node.js
console.log('¡Hola desde Node.js!');

// Acceder a información del proceso
console.log('Versión de Node:', process.version);
console.log('Plataforma:', process.platform);
console.log('Directorio actual:', process.cwd());

// Argumentos de línea de comandos
console.log('Argumentos:', process.argv);

// Variables de entorno
console.log('HOME:', process.env.HOME || process.env.USERPROFILE);`} />

        <CodeBlock language="bash" filename="Ejecutar el programa" code={`# Ejecutar con Node.js
node hola.js

# Salida:
# ¡Hola desde Node.js!
# Versión de Node: v22.x.x
# Plataforma: win32 (o linux, darwin)
# Directorio actual: C:\\Users\\tu-usuario\\proyecto
# ...`} />

        <InfoBox type="tip" title="Diferencia clave con el navegador">
          En el navegador tienes: <code>window</code>, <code>document</code>, <code>localStorage</code>, <code>fetch</code> (global).<br/>
          En Node.js tienes: <code>process</code>, <code>__dirname</code>, <code>__filename</code>, <code>Buffer</code>,
          <code> require()</code>. Desde Node 18+ también tienes <code>fetch</code> global.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Cómo funciona Node.js internamente?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando ejecutas <code className="text-primary">node app.js</code>, esto es lo que sucede:
        </p>

        <CodeBlock language="bash" filename="Flujo de ejecución de Node.js" code={`# 1. Node.js inicia el motor V8
# 2. V8 compila tu código JavaScript a código máquina
# 3. Se inicializa el Event Loop (gestionado por libuv)
# 4. Se ejecuta tu código de arriba hacia abajo (síncrono)
# 5. Se registran los callbacks asíncronos (setTimeout, fs.readFile, etc.)
# 6. El Event Loop empieza a girar:
#    - ¿Hay callbacks pendientes? → Ejecutarlos
#    - ¿Hay timers que ya expiraron? → Ejecutar sus callbacks
#    - ¿Hay operaciones I/O completadas? → Ejecutar sus callbacks
# 7. Cuando no hay más trabajo pendiente, Node.js termina el proceso`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Blocking vs Non-Blocking</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Esta es la diferencia más importante que debes entender:
        </p>

        <CodeBlock language="javascript" filename="blocking.js — NO hagas esto" code={`const fs = require('fs');

// BLOCKING (síncrono) — Detiene todo el programa hasta que termine
const data = fs.readFileSync('/archivo-enorme.txt', 'utf8');
console.log(data);
console.log('Esto se ejecuta DESPUÉS de leer todo el archivo');
// Si el archivo tarda 5 segundos, tu servidor NO puede atender nada más`} />

        <CodeBlock language="javascript" filename="non-blocking.js — Haz esto" code={`const fs = require('fs');

// NON-BLOCKING (asíncrono) — No detiene el programa
fs.readFile('/archivo-enorme.txt', 'utf8', (err, data) => {
  if (err) throw err;
  console.log(data);
});
console.log('Esto se ejecuta INMEDIATAMENTE, sin esperar');
// Node.js sigue atendiendo peticiones mientras se lee el archivo`} />

        <InfoBox type="warning" title="Regla de oro">
          <strong>NUNCA uses operaciones síncronas (Sync) en código de producción</strong> que atienda
          múltiples usuarios. Bloquean el Event Loop y tu servidor deja de responder a todos los demás
          usuarios mientras se completa la operación. La única excepción es al inicio de la app (setup inicial).
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué Node.js en 2026?</h2>
        <div className="space-y-3 text-text-muted leading-relaxed">
          <p>
            <strong className="text-text">1. Un solo lenguaje fullstack:</strong> JavaScript en frontend y backend.
            Compartes tipos, validaciones y lógica entre ambos lados.
          </p>
          <p>
            <strong className="text-text">2. Rendimiento excepcional para I/O:</strong> Node.js es ideal para aplicaciones
            que manejan muchas conexiones simultáneas: APIs REST, real-time, microservicios, chat, streaming.
          </p>
          <p>
            <strong className="text-text">3. Ecosistema masivo:</strong> NPM tiene más de 2 millones de paquetes.
            Express, Fastify, NestJS, Prisma, Socket.io, Bull... hay librería para todo.
          </p>
          <p>
            <strong className="text-text">4. Empresas top lo usan:</strong> Netflix, LinkedIn, PayPal, Uber, NASA,
            Walmart, eBay — todas usan Node.js en producción para servicios críticos.
          </p>
          <p>
            <strong className="text-text">5. TypeScript nativo:</strong> Node.js 22+ tiene soporte experimental para
            ejecutar TypeScript directamente sin compilación previa. El ecosistema evoluciona rápidamente.
          </p>
          <p>
            <strong className="text-text">6. Demanda laboral altísima:</strong> Backend con Node.js es una de las habilidades
            más demandadas globalmente. Startups y empresas grandes buscan desarrolladores Node constantemente.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Para qué NO es ideal Node.js?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Es importante conocer las limitaciones:
        </p>
        <div className="bg-surface-light border border-border rounded-xl p-4">
          <ul className="space-y-2 text-text-muted text-sm">
            <li>• <strong className="text-text">Cómputo intensivo de CPU:</strong> Cálculos matemáticos pesados, procesamiento de video/imagen, machine learning. Para esto hay Worker Threads, pero lenguajes como Go, Rust o Java son mejores opciones.</li>
            <li>• <strong className="text-text">Aplicaciones monolíticas gigantes:</strong> Para sistemas empresariales enormes con lógica de negocio muy compleja, Java/Spring o .NET pueden ser más adecuados.</li>
            <li>• <strong className="text-text">Sistemas de tiempo real crítico:</strong> Donde necesitas garantías de latencia (sistemas embebidos, trading de alta frecuencia).</li>
          </ul>
        </div>

        <InfoBox type="tip">
          Node.js <strong>es perfecto</strong> para: APIs REST, microservicios, aplicaciones real-time (chat, notificaciones),
          streaming, server-side rendering (SSR), herramientas CLI, y cualquier aplicación I/O-bound.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Node.js vs otros runtimes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-muted">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text">Aspecto</th>
                <th className="text-left py-3 px-4 text-node">Node.js</th>
                <th className="text-left py-3 px-4 text-accent">Deno</th>
                <th className="text-left py-3 px-4 text-warning">Bun</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">Motor</td>
                <td className="py-3 px-4">V8 (Google)</td>
                <td className="py-3 px-4">V8 (Google)</td>
                <td className="py-3 px-4">JavaScriptCore (Apple)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">Lenguaje</td>
                <td className="py-3 px-4">C++ / JavaScript</td>
                <td className="py-3 px-4">Rust / TypeScript</td>
                <td className="py-3 px-4">Zig / C++</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">TypeScript</td>
                <td className="py-3 px-4">Necesita transpilación*</td>
                <td className="py-3 px-4">Nativo</td>
                <td className="py-3 px-4">Nativo</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">Gestor paquetes</td>
                <td className="py-3 px-4">npm / yarn / pnpm</td>
                <td className="py-3 px-4">deno add / npm:</td>
                <td className="py-3 px-4">bun install (npm compatible)</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-3 px-4">Ecosistema</td>
                <td className="py-3 px-4">El más grande (2M+ pkgs)</td>
                <td className="py-3 px-4">Compatible con npm</td>
                <td className="py-3 px-4">Compatible con npm</td>
              </tr>
              <tr>
                <td className="py-3 px-4">Madurez</td>
                <td className="py-3 px-4">2009 — Muy maduro</td>
                <td className="py-3 px-4">2020 — Estable</td>
                <td className="py-3 px-4">2022 — En crecimiento</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-text-muted text-sm mt-3">
          * Node.js 22+ tiene soporte experimental para TypeScript con <code className="text-primary">--experimental-strip-types</code>.
        </p>
      </section>
    </div>
  );
}
