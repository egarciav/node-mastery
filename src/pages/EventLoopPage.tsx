import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function EventLoopPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">El Event Loop</h1>
      <p className="text-text-muted text-lg mb-8">El corazón de Node.js — Cómo maneja miles de conexiones con un solo hilo</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es el Event Loop?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El Event Loop es el <strong className="text-text">mecanismo central</strong> que permite a Node.js realizar
          operaciones de I/O no bloqueantes a pesar de que JavaScript es single-threaded. Es lo que hace posible
          que un servidor Node.js atienda miles de conexiones simultáneamente con un solo hilo.
        </p>
        <p className="text-text-muted leading-relaxed mb-4">
          Piensa en el Event Loop como un <strong className="text-text">ciclo infinito</strong> que constantemente
          revisa si hay tareas pendientes por ejecutar. Si hay callbacks listos, los ejecuta. Si no, espera a que lleguen nuevos eventos.
        </p>

        <InfoBox type="info" title="Analogía">
          Imagina un chef (hilo principal) en un restaurante. En vez de esperar junto al horno a que se cocine cada platillo,
          pone el platillo en el horno, pone un timer, y va a preparar el siguiente. Cuando el timer suena (callback),
          vuelve a atender ese platillo. Un solo chef puede manejar muchos platillos simultáneamente.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Las fases del Event Loop</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El Event Loop de Node.js (implementado por <strong className="text-text">libuv</strong>) tiene
          varias fases que se ejecutan en un orden específico:
        </p>

        <CodeBlock language="bash" filename="Fases del Event Loop" code={`┌───────────────────────────┐
│         timers            │  ← setTimeout, setInterval
├───────────────────────────┤
│     pending callbacks     │  ← callbacks de I/O diferidos
├───────────────────────────┤
│       idle, prepare       │  ← uso interno de Node.js
├───────────────────────────┤
│          poll             │  ← nuevos eventos I/O, callbacks I/O
├───────────────────────────┤
│         check             │  ← setImmediate()
├───────────────────────────┤
│     close callbacks       │  ← socket.on('close', ...)
└───────────────────────────┘

# Cada iteración completa del loop se llama un "tick"`} />

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">1. Timers</h3>
            <p className="text-text-muted text-sm">
              Ejecuta callbacks de <code className="text-primary">setTimeout()</code> y
              <code className="text-primary"> setInterval()</code> que ya hayan expirado.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">2. Pending Callbacks</h3>
            <p className="text-text-muted text-sm">
              Ejecuta callbacks de operaciones del sistema que fueron diferidos al tick anterior
              (errores TCP, por ejemplo).
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">3. Poll</h3>
            <p className="text-text-muted text-sm">
              La fase más importante. Recupera nuevos eventos de I/O y ejecuta sus callbacks
              (leer archivos, recibir datos de red, etc.). Si no hay timers pendientes, puede
              <strong className="text-text"> bloquear aquí</strong> esperando nuevos eventos.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">4. Check</h3>
            <p className="text-text-muted text-sm">
              Ejecuta callbacks de <code className="text-primary">setImmediate()</code>.
              Se ejecuta inmediatamente después de la fase poll.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">5. Close Callbacks</h3>
            <p className="text-text-muted text-sm">
              Ejecuta callbacks de cierre como <code className="text-primary">socket.on('close', ...)</code>.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Microtasks vs Macrotasks</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Además de las fases del Event Loop, existen dos colas especiales que se ejecutan
          <strong className="text-text"> entre cada fase</strong>:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-success mb-2">Microtasks (mayor prioridad)</h3>
            <p className="text-text-muted text-sm">
              <code className="text-primary">Promise.then()</code>, <code className="text-primary">Promise.catch()</code>,
              <code className="text-primary"> queueMicrotask()</code>, <code className="text-primary">process.nextTick()</code>.
              Se ejecutan <strong className="text-text">ANTES</strong> de pasar a la siguiente fase.
              <code className="text-primary"> process.nextTick()</code> tiene la prioridad más alta de todas.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-2">Macrotasks (menor prioridad)</h3>
            <p className="text-text-muted text-sm">
              <code className="text-primary">setTimeout()</code>, <code className="text-primary">setInterval()</code>,
              <code className="text-primary"> setImmediate()</code>, I/O callbacks. Se ejecutan en sus fases correspondientes.
            </p>
          </div>
        </div>

        <CodeBlock language="javascript" filename="Orden de ejecución — Ejemplo clave" code={`console.log('1 - Inicio (síncrono)');

setTimeout(() => {
  console.log('5 - setTimeout (macrotask - fase timers)');
}, 0);

setImmediate(() => {
  console.log('6 - setImmediate (macrotask - fase check)');
});

Promise.resolve().then(() => {
  console.log('3 - Promise.then (microtask)');
});

process.nextTick(() => {
  console.log('2 - process.nextTick (microtask, máxima prioridad)');
});

console.log('4 - Fin (síncrono)');

// Salida:
// 1 - Inicio (síncrono)
// 4 - Fin (síncrono)
// 2 - process.nextTick (microtask, máxima prioridad)
// 3 - Promise.then (microtask)
// 5 - setTimeout (macrotask - fase timers)
// 6 - setImmediate (macrotask - fase check)`} />

        <InfoBox type="warning" title="Orden de prioridad">
          <strong>1.</strong> Código síncrono (se ejecuta primero, de arriba a abajo)<br/>
          <strong>2.</strong> process.nextTick() (microtask de máxima prioridad)<br/>
          <strong>3.</strong> Promises (microtasks)<br/>
          <strong>4.</strong> setTimeout/setInterval (macrotask - fase timers)<br/>
          <strong>5.</strong> setImmediate (macrotask - fase check)<br/>
          <strong>6.</strong> I/O callbacks (macrotask - fase poll)
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Ejemplo práctico: I/O y Event Loop</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Dentro de un callback I/O (como leer un archivo), <code className="text-primary">setImmediate</code>
          <strong className="text-text"> siempre se ejecuta antes</strong> que <code className="text-primary">setTimeout</code>,
          porque después de la fase poll viene check (setImmediate), y luego timers en el siguiente ciclo:
        </p>

        <CodeBlock language="javascript" filename="event-loop-io.js" code={`import { readFile } from 'fs';

console.log('1 - Inicio');

readFile('./archivo.txt', 'utf8', (err, data) => {
  console.log('4 - Archivo leído (I/O callback - fase poll)');

  setTimeout(() => {
    console.log('6 - setTimeout dentro de I/O');
  }, 0);

  setImmediate(() => {
    console.log('5 - setImmediate dentro de I/O');
  });

  // Dentro de un callback I/O, setImmediate SIEMPRE va antes que setTimeout
  // porque después de poll viene check (setImmediate), luego timers
});

setTimeout(() => {
  console.log('3 - setTimeout');
}, 0);

console.log('2 - Fin');

// Salida:
// 1 - Inicio
// 2 - Fin
// 3 - setTimeout
// 4 - Archivo leído
// 5 - setImmediate dentro de I/O  ← siempre antes que setTimeout aquí
// 6 - setTimeout dentro de I/O`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Bloqueando el Event Loop — El error más grave</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Si ejecutas código síncrono pesado, <strong className="text-text">bloqueas todo el Event Loop</strong>
          y tu servidor no puede atender a nadie más:
        </p>

        <CodeBlock language="javascript" filename="MALO — Bloquea el Event Loop" code={`import express from 'express';
const app = express();

app.get('/calcular', (req, res) => {
  // Operación CPU-intensiva — BLOQUEA TODO
  let resultado = 0;
  for (let i = 0; i < 10_000_000_000; i++) {
    resultado += Math.sqrt(i);
  }
  // Mientras este loop corre, NINGUNA otra petición puede ser atendida
  // Todos los demás usuarios esperan
  res.json({ resultado });
});

app.listen(3000);`} />

        <CodeBlock language="javascript" filename="BUENO — No bloquea" code={`import express from 'express';
import { Worker } from 'worker_threads';
const app = express();

app.get('/calcular', (req, res) => {
  // Delegar a un Worker Thread para no bloquear el Event Loop
  const worker = new Worker('./heavy-calc.js');

  worker.on('message', (resultado) => {
    res.json({ resultado });
  });

  worker.on('error', (err) => {
    res.status(500).json({ error: err.message });
  });
});

app.listen(3000);
// El Event Loop sigue libre para atender otras peticiones`} />

        <InfoBox type="warning" title="Regla de oro del Event Loop">
          <strong>NUNCA pongas operaciones CPU-intensivas en el hilo principal.</strong> Usa Worker Threads,
          child processes, o servicios externos para cómputo pesado. El hilo principal debe estar libre
          para manejar I/O y callbacks.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">process.nextTick() vs setImmediate()</h2>

        <CodeBlock language="javascript" filename="Diferencia práctica" code={`// process.nextTick() — Se ejecuta ANTES de continuar el Event Loop
// Usa esto cuando necesites que algo se ejecute inmediatamente después
// del código actual, pero antes de cualquier I/O
process.nextTick(() => {
  console.log('nextTick: se ejecuta antes de cualquier I/O');
});

// setImmediate() — Se ejecuta en la siguiente iteración del Event Loop
// Usa esto cuando quieras ejecutar algo después de la fase poll
setImmediate(() => {
  console.log('setImmediate: se ejecuta después de I/O');
});

// ¿Cuándo usar cada uno?
// process.nextTick(): Para asegurar que un callback se ejecute antes de que
//   el Event Loop continúe. Ej: emitir eventos después de que un constructor termine.
// setImmediate(): Para diferir trabajo no crítico al siguiente ciclo del Event Loop.

// CUIDADO: process.nextTick() recursivo puede "starve" el Event Loop
// (impedir que avance a otras fases). Prefiere setImmediate() en general.`} />
      </section>
    </div>
  );
}
