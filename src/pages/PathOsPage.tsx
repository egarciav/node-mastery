import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PathOsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Módulos path, os y url</h1>
      <p className="text-text-muted text-lg mb-8">Utilidades esenciales del sistema operativo y rutas</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Módulo path</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El módulo <code className="text-primary">path</code> proporciona utilidades para trabajar con rutas de archivos
          y directorios de forma <strong className="text-text">multiplataforma</strong> (Windows usa <code>\</code>, Unix usa <code>/</code>).
        </p>

        <CodeBlock language="javascript" filename="path — Operaciones comunes" code={`import path from 'path';

// Unir segmentos de ruta (maneja separadores automáticamente)
path.join('/usuarios', 'docs', 'archivo.txt');
// Linux: '/usuarios/docs/archivo.txt'
// Windows: '\\usuarios\\docs\\archivo.txt'

// Resolver ruta absoluta desde segmentos relativos
path.resolve('src', 'controllers', 'user.js');
// '/home/tu/proyecto/src/controllers/user.js'

// Obtener partes de una ruta
path.basename('/src/app.js');       // 'app.js'
path.basename('/src/app.js', '.js'); // 'app' (sin extensión)
path.dirname('/src/controllers/user.js');  // '/src/controllers'
path.extname('foto.png');           // '.png'

// Parsear ruta completa
path.parse('/home/user/docs/carta.pdf');
// { root: '/', dir: '/home/user/docs', base: 'carta.pdf',
//   ext: '.pdf', name: 'carta' }

// Ruta relativa entre dos rutas
path.relative('/data/orandea/test', '/data/orandea/impl/file');
// '../impl/file'

// Normalizar ruta (limpia . y ..)
path.normalize('/foo/bar//baz/../qux');
// '/foo/bar/qux'`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Módulo os</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El módulo <code className="text-primary">os</code> da información del sistema operativo:
          plataforma, CPU, RAM, directorios del usuario. Es útil para adaptar tu app al entorno
          y para determinar cuántos workers crear en un cluster:
        </p>

        <CodeBlock language="javascript" filename="os — Información del sistema" code={`import os from 'os';

console.log('Plataforma:', os.platform());   // 'win32', 'linux', 'darwin'
console.log('Arquitectura:', os.arch());      // 'x64', 'arm64'
console.log('CPUs:', os.cpus().length);       // Número de cores
console.log('RAM total:', (os.totalmem() / 1024 / 1024 / 1024).toFixed(1), 'GB');
console.log('RAM libre:', (os.freemem() / 1024 / 1024 / 1024).toFixed(1), 'GB');
console.log('Home dir:', os.homedir());       // '/home/user' o 'C:\\Users\\user'
console.log('Temp dir:', os.tmpdir());        // '/tmp' o 'C:\\Users\\...\\Temp'
console.log('Hostname:', os.hostname());
console.log('Uptime:', (os.uptime() / 3600).toFixed(1), 'horas');
console.log('EOL:', JSON.stringify(os.EOL));  // '\\n' o '\\r\\n'

// Info de red
const interfaces = os.networkInterfaces();
for (const [name, addrs] of Object.entries(interfaces)) {
  for (const addr of addrs) {
    if (addr.family === 'IPv4' && !addr.internal) {
      console.log(\`\${name}: \${addr.address}\`);
    }
  }
}`} />

        <InfoBox type="tip" title="Uso práctico de os">
          Usa <code>os.cpus().length</code> para determinar cuántos workers o procesos del cluster crear.
          Usa <code>os.tmpdir()</code> para archivos temporales. Usa <code>os.homedir()</code> para
          ubicar archivos de configuración del usuario.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Módulo url</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          La API <code className="text-primary">URL</code> (estándar web) parsea URLs en sus componentes
          y permite manipular query params con <code className="text-primary">searchParams</code>.
          Es la misma API que existe en el navegador:
        </p>

        <CodeBlock language="javascript" filename="url — Parsear y construir URLs" code={`// URL API (estándar web, recomendada)
const miUrl = new URL('https://api.example.com:8080/users?page=2&limit=10#section');

console.log(miUrl.protocol);   // 'https:'
console.log(miUrl.hostname);   // 'api.example.com'
console.log(miUrl.port);       // '8080'
console.log(miUrl.pathname);   // '/users'
console.log(miUrl.search);     // '?page=2&limit=10'
console.log(miUrl.hash);       // '#section'

// Trabajar con query params
console.log(miUrl.searchParams.get('page'));  // '2'
console.log(miUrl.searchParams.get('limit')); // '10'

miUrl.searchParams.set('sort', 'name');
miUrl.searchParams.append('filter', 'active');
console.log(miUrl.toString());
// 'https://api.example.com:8080/users?page=2&limit=10&sort=name&filter=active#section'

// Construir URL desde partes
const apiUrl = new URL('/api/v2/products', 'https://myapp.com');
console.log(apiUrl.href); // 'https://myapp.com/api/v2/products'`} />
      </section>
    </div>
  );
}
