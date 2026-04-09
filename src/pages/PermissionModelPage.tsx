import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PermissionModelPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Permission Model</h1>
      <p className="text-text-muted text-lg mb-8">Restringir acceso al sistema de archivos y red en Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es el Permission Model?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Desde Node.js 20, el <strong className="text-text">Permission Model</strong> permite restringir
          qué puede hacer tu aplicación: acceso a archivos, red, child processes, y worker threads.
          Es como un sandbox que previene que código malicioso (o vulnerabilidades en dependencias)
          acceda a recursos no autorizados.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Uso</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Activas el Permission Model con <code className="text-primary">--experimental-permission</code> al ejecutar Node.
          Por defecto <strong className="text-text">todo está bloqueado</strong>. Luego vas concediendo permisos
          explícitamente con flags <code className="text-primary">--allow-fs-read</code>, <code className="text-primary">--allow-fs-write</code>,
          y <code className="text-primary">--allow-net</code>. Así una dependencia maliciosa no puede leer tu <code className="text-primary">.env</code>
          ni hacer peticiones a servidores desconocidos:
        </p>

        <CodeBlock language="bash" filename="Flags de permisos" code={`# Permitir solo lectura de un directorio
node --experimental-permission --allow-fs-read=/app/data server.js

# Permitir lectura y escritura
node --experimental-permission \\
  --allow-fs-read=/app \\
  --allow-fs-write=/app/uploads \\
  server.js

# Permitir acceso a red (outbound)
node --experimental-permission \\
  --allow-fs-read=/app \\
  --allow-net=api.example.com \\
  server.js

# Sin permisos = todo bloqueado por defecto
node --experimental-permission server.js
# → Error: Access to FileSystem denied`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Verificar permisos en código</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          También puedes verificar permisos <strong className="text-text">programáticamente</strong> antes de intentar
          una operación. Esto te permite mostrar errores amigables en vez de que tu app crashee
          cuando no tiene permiso para algo:
        </p>

        <CodeBlock language="typescript" filename="Comprobar permisos programáticamente" code={`import { permission } from 'node:process';

// Verificar antes de intentar
if (permission.has('fs.read', '/app/data')) {
  const data = await fs.readFile('/app/data/config.json', 'utf-8');
} else {
  console.error('No tengo permiso para leer /app/data');
}

// Verificar permiso de red
if (permission.has('net')) {
  await fetch('https://api.example.com/data');
}

// Verificar child process
if (permission.has('child')) {
  exec('ls -la');
}`} />

        <InfoBox type="warning" title="Estado experimental">
          El Permission Model todavía es <strong>experimental</strong> en Node.js. La API puede cambiar.
          Pero es una dirección importante para la seguridad en Node.js, especialmente para protegerse
          contra supply chain attacks (dependencias maliciosas que acceden al filesystem o red).
        </InfoBox>
      </section>
    </div>
  );
}
