import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ChildProcessPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Child Processes</h1>
      <p className="text-text-muted text-lg mb-8">Ejecutar comandos del sistema y scripts externos desde Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Métodos principales</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">exec()</h3>
            <p className="text-text-muted text-sm">Ejecuta un comando shell. Bufferea toda la salida. Ideal para comandos cortos.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-1">spawn()</h3>
            <p className="text-text-muted text-sm">Ejecuta un comando con streams. No bufferea. Ideal para procesos de larga duración o con mucha salida.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-accent mb-1">fork()</h3>
            <p className="text-text-muted text-sm">Crea un nuevo proceso Node.js. Tiene canal IPC para comunicación entre procesos.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">exec() — Comandos cortos con resultado completo</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">exec()</code> ejecuta un comando shell y espera a que termine para darte
          toda la salida de golpe (buffered). Es perfecto para comandos rápidos donde necesitas el resultado
          completo: verificar versión de Git, espacio en disco, ejecutar un script pequeño.
          <strong className="text-text"> No lo uses para procesos de larga duración</strong> porque bufferea toda la salida en memoria.
        </p>

        <CodeBlock language="typescript" filename="exec — Comando simple" code={`import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

async function getDiskSpace() {
  const { stdout } = await execAsync('df -h /');
  return stdout;
}

async function getGitLog() {
  const { stdout } = await execAsync('git log --oneline -10');
  return stdout.trim().split('\\n');
}`} />

        <h2 className="text-2xl font-bold text-text mb-4">spawn() — Procesos largos con streams</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">spawn()</code> es diferente: te da <strong className="text-text">streams</strong>
          de stdout y stderr en tiempo real, sin buffear todo en memoria. Es ideal para procesos
          de larga duración como convertir video con FFmpeg, ejecutar builds, o cualquier cosa con mucha salida:
        </p>

        <CodeBlock language="typescript" filename="spawn — Proceso con streams" code={`import { spawn } from 'child_process';

function runFFmpeg(input: string, output: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const process = spawn('ffmpeg', ['-i', input, '-codec', 'copy', output]);

    process.stdout.on('data', (data) => console.log(\`stdout: \${data}\`));
    process.stderr.on('data', (data) => console.error(\`stderr: \${data}\`));

    process.on('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(\`FFmpeg exited with code \${code}\`));
    });
  });
}`} />

        <h2 className="text-2xl font-bold text-text mb-4">fork() — Procesos Node.js con canal de comunicación</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">fork()</code> es exclusivo para crear <strong className="text-text">procesos Node.js hijos</strong>.
          Su ventaja principal: incluye un <strong className="text-text">canal IPC</strong> (Inter-Process Communication)
          automático para enviar y recibir mensajes entre padre e hijo con <code className="text-primary">.send()</code> y
          <code className="text-primary"> .on('message')</code>. Útil para delegar tareas pesadas a otro proceso:
        </p>

        <CodeBlock language="typescript" filename="fork — Proceso Node.js hijo" code={`// main.ts
import { fork } from 'child_process';

const child = fork('./heavy-task.js');

child.send({ type: 'START', data: { iterations: 1_000_000 } });

child.on('message', (result) => {
  console.log('Result from child:', result);
});

// heavy-task.js
process.on('message', (msg) => {
  const result = doHeavyWork(msg.data);
  process.send({ type: 'DONE', result });
});`} />

        <InfoBox type="tip" title="Worker Threads vs Child Process">
          <strong>Worker Threads</strong>: comparten memoria, más ligeros, ideales para CPU-intensivo en JS.
          <strong> Child Processes</strong>: procesos separados, ideales para ejecutar binarios externos (ffmpeg, python, etc.)
          o scripts que necesitan aislamiento completo.
        </InfoBox>
      </section>
    </div>
  );
}
