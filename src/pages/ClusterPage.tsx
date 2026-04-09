import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ClusterPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Cluster y Escalabilidad</h1>
      <p className="text-text-muted text-lg mb-8">Usar todos los cores del CPU con el módulo cluster</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué Cluster?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js corre en un solo hilo. Un servidor con 8 cores solo usa 1 por defecto.
          El módulo <code>cluster</code> permite crear <strong className="text-text">múltiples procesos workers</strong>,
          uno por core, que comparten el mismo puerto. El sistema operativo distribuye las conexiones entre ellos.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Implementación</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El código del cluster tiene dos caminos: el <strong className="text-text">proceso primario</strong> (que crea los workers)
          y los <strong className="text-text">workers</strong> (que ejecutan tu servidor). Cuando un worker muere, el primario
          lo detecta y crea uno nuevo. Así tu API se mantiene disponible incluso si un proceso crashea:
        </p>

        <CodeBlock language="typescript" filename="cluster.ts" code={`import cluster from 'cluster';
import os from 'os';

const numCPUs = os.cpus().length;

if (cluster.isPrimary) {
  console.log(\`Primary \${process.pid} is running\`);
  console.log(\`Forking \${numCPUs} workers...\`);

  // Crear un worker por cada CPU
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  // Reiniciar workers que mueren
  cluster.on('exit', (worker, code, signal) => {
    console.log(\`Worker \${worker.process.pid} died (code: \${code})\`);
    console.log('Starting a new worker...');
    cluster.fork();
  });
} else {
  // Los workers ejecutan el servidor
  import('./app.js').then(({ default: app }) => {
    app.listen(3000, () => {
      console.log(\`Worker \${process.pid} started\`);
    });
  });
}`} />

        <InfoBox type="tip" title="PM2 es la forma fácil">
          En producción, <strong>PM2</strong> hace clustering automático sin que modifiques tu código:
          <code> pm2 start app.js -i max</code>. Además gestiona reinicio automático, logs y monitoreo.
          El módulo cluster nativo es útil para entender cómo funciona, pero PM2 es lo práctico.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Escalabilidad horizontal</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cluster escala <strong className="text-text">verticalmente</strong> (más cores en la misma máquina).
          Cuando una sola máquina no es suficiente, necesitas escalar <strong className="text-text">horizontalmente</strong>:
          múltiples servidores con un load balancer que distribuye el tráfico entre ellos:
        </p>

        <CodeBlock language="bash" filename="Escalar más allá de una máquina" code={`# 1. Vertical: Más CPU/RAM en la misma máquina
#    → cluster / PM2

# 2. Horizontal: Múltiples máquinas con load balancer
#    → Nginx / HAProxy / Cloud Load Balancer
#    → Docker + Kubernetes

# Nginx como load balancer
upstream api {
    server 192.168.1.10:3000;
    server 192.168.1.11:3000;
    server 192.168.1.12:3000;
}

server {
    listen 80;
    location /api {
        proxy_pass http://api;
    }
}`} />
      </section>
    </div>
  );
}
