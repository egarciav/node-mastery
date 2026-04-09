import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function WorkerThreadsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Worker Threads</h1>
      <p className="text-text-muted text-lg mb-8">Ejecutar código CPU-intensivo sin bloquear el Event Loop</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El problema</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js es <strong className="text-text">single-threaded</strong>. Operaciones CPU-intensivas (hash pesados,
          procesamiento de imágenes, cálculos complejos) bloquean el Event Loop y dejan al servidor sin responder.
          <code>worker_threads</code> permite ejecutar JavaScript en hilos separados.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Ejemplo básico</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El patrón es simple: el <strong className="text-text">hilo principal</strong> crea un Worker, le envía datos,
          y escucha el resultado via mensajes. El <strong className="text-text">worker</strong> ejecuta el cómputo pesado
          en su propio hilo y envía el resultado de vuelta. Mientras tanto, el Event Loop del hilo principal
          sigue libre para atender otras peticiones HTTP:
        </p>

        <CodeBlock language="typescript" filename="main.ts — Hilo principal" code={`import { Worker } from 'worker_threads';

function runWorker(data: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker('./worker.js', {
      workerData: data,
    });

    worker.on('message', resolve);   // Resultado del worker
    worker.on('error', reject);      // Error en el worker
    worker.on('exit', (code) => {
      if (code !== 0) reject(new Error(\`Worker stopped with code \${code}\`));
    });
  });
}

// No bloquea el Event Loop
app.get('/api/heavy-task', async (req, res) => {
  const result = await runWorker(1_000_000);
  res.json({ result });
});`} />

        <p className="text-text-muted leading-relaxed mb-4">
          El archivo del worker se ejecuta en un <strong className="text-text">hilo completamente separado</strong>.
          Recibe datos vía <code className="text-primary">workerData</code> y envía resultados vía <code className="text-primary">parentPort.postMessage()</code>.
          Todo el cómputo pesado ocurre aquí sin afectar al hilo principal:
        </p>

        <CodeBlock language="typescript" filename="worker.ts — Hilo secundario" code={`import { parentPort, workerData } from 'worker_threads';

// Operación CPU-intensiva (en su propio hilo)
function heavyComputation(n: number): number {
  let sum = 0;
  for (let i = 0; i < n; i++) {
    sum += Math.sqrt(i) * Math.sin(i);
  }
  return sum;
}

const result = heavyComputation(workerData);
parentPort?.postMessage(result); // Enviar resultado al hilo principal`} />

        <InfoBox type="tip" title="¿Cuándo usar Worker Threads?">
          <strong>Úsalos para</strong>: procesamiento de imágenes/video, criptografía pesada, parsing de archivos grandes,
          cálculos matemáticos. <strong>No los uses para</strong>: I/O (BD, HTTP, archivos) — Node.js ya maneja eso
          eficientemente con el Event Loop.
        </InfoBox>
      </section>
    </div>
  );
}
