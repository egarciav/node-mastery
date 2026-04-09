import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function Pm2Page() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">PM2 — Process Manager</h1>
      <p className="text-text-muted text-lg mb-8">Gestionar procesos Node.js en producción con clustering y reinicio automático</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué PM2?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Si tu app Node.js crashea en producción, simplemente muere. PM2 la <strong className="text-text">reinicia automáticamente</strong>,
          hace <strong className="text-text">clustering</strong> para usar todos los cores, gestiona logs, y permite
          deploys sin downtime (zero-downtime reload).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Configuración</h2>

        <CodeBlock language="bash" code={`npm install -g pm2`} />

        <p className="text-text-muted leading-relaxed mb-4">
          PM2 se configura con un archivo <code className="text-primary">ecosystem.config.cjs</code> que define
          cómo correr tu app: cuántas instancias, límites de memoria, logs, y variables de entorno
          por ambiente. La opción <code className="text-primary">instances: 'max'</code> crea un proceso por core
          automáticamente — sin que modifiques una línea de tu código:
        </p>

        <CodeBlock language="javascript" filename="ecosystem.config.cjs" code={`module.exports = {
  apps: [{
    name: 'mi-api',
    script: './dist/server.js',
    instances: 'max',        // Un proceso por CPU
    exec_mode: 'cluster',    // Modo cluster
    env: {
      NODE_ENV: 'development',
      PORT: 3000,
    },
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000,
    },
    // Reinicio automático
    max_memory_restart: '500M',
    restart_delay: 5000,
    max_restarts: 10,
    // Logs
    log_date_format: 'YYYY-MM-DD HH:mm:ss',
    error_file: './logs/error.log',
    out_file: './logs/app.log',
    merge_logs: true,
  }],
};`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Los comandos que usarás constantemente en producción. El más importante es <code className="text-primary">pm2 reload</code>
          que reinicia los procesos uno por uno, garantizando <strong className="text-text">zero downtime</strong> — nunca
          hay un momento donde todos los workers estén caídos:
        </p>

        <CodeBlock language="bash" filename="Comandos PM2 esenciales" code={`# Iniciar
pm2 start ecosystem.config.cjs --env production

# Ver procesos
pm2 list
pm2 monit          # Dashboard en terminal

# Logs
pm2 logs
pm2 logs mi-api --lines 100

# Reinicio sin downtime
pm2 reload mi-api

# Detener
pm2 stop mi-api
pm2 delete mi-api

# Guardar configuración (sobrevive reboot)
pm2 save
pm2 startup        # Genera script de inicio del sistema`} />

        <InfoBox type="tip" title="PM2 vs Docker">
          Si usas <strong>Docker + Kubernetes</strong>, el orquestador ya gestiona reinicio, escalado y health checks —
          no necesitas PM2. Usa PM2 cuando despliegues directamente en un VPS/servidor sin Docker.
        </InfoBox>
      </section>
    </div>
  );
}
