import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function FileSystemPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">File System (fs)</h1>
      <p className="text-text-muted text-lg mb-8">Leer, escribir, crear y manipular archivos y directorios</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El módulo fs</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El módulo <code className="text-primary">fs</code> (File System) es uno de los módulos core más usados de Node.js.
          Permite interactuar con el sistema de archivos: leer, escribir, crear, eliminar archivos y directorios.
          Tiene tres APIs: <strong className="text-text">callbacks</strong>, <strong className="text-text">síncrona</strong>, y
          <strong className="text-text"> promises</strong> (la recomendada).
        </p>

        <CodeBlock language="javascript" filename="Las tres APIs de fs" code={`// 1. Promises API (RECOMENDADA)
import { readFile, writeFile, mkdir, rm } from 'fs/promises';

// 2. Callback API (legacy)
import fs from 'fs';
fs.readFile('./file.txt', 'utf8', (err, data) => { /* ... */ });

// 3. Sync API (solo para scripts o setup inicial)
const data = fs.readFileSync('./file.txt', 'utf8');`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Operaciones con archivos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las operaciones de lectura más comunes: leer texto con <code className="text-primary">readFile</code>,
          leer binarios (imágenes, PDFs), y obtener metadatos con <code className="text-primary">stat</code>.
          Siempre especifica <code className="text-primary">'utf8'</code> para texto; sin encoding obtienes un Buffer:
        </p>

        <CodeBlock language="javascript" filename="Leer archivos" code={`import { readFile, readdir, stat } from 'fs/promises';

// Leer archivo como texto
const contenido = await readFile('./config.json', 'utf8');
const config = JSON.parse(contenido);

// Leer archivo como Buffer (binario)
const imagen = await readFile('./foto.png');
console.log(imagen.length, 'bytes');

// Verificar si un archivo existe y obtener info
const info = await stat('./archivo.txt');
console.log('Tamaño:', info.size, 'bytes');
console.log('Es archivo:', info.isFile());
console.log('Es directorio:', info.isDirectory());
console.log('Modificado:', info.mtime);`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Para escritura: <code className="text-primary">writeFile</code> crea/sobreescribe,
          <code className="text-primary"> appendFile</code> agrega al final sin borrar lo existente.
          También puedes copiar, renombrar/mover y eliminar archivos:
        </p>

        <CodeBlock language="javascript" filename="Escribir archivos" code={`import { writeFile, appendFile, copyFile, rename, unlink } from 'fs/promises';

// Escribir archivo (crea si no existe, sobreescribe si existe)
await writeFile('./salida.txt', 'Hola Mundo', 'utf8');

// Escribir JSON
const datos = { nombre: 'Node', version: 22 };
await writeFile('./datos.json', JSON.stringify(datos, null, 2));

// Agregar al final del archivo (no sobreescribe)
await appendFile('./log.txt', \`[\${new Date().toISOString()}] Evento\\n\`);

// Copiar archivo
await copyFile('./original.txt', './copia.txt');

// Renombrar / mover archivo
await rename('./viejo.txt', './nuevo.txt');
await rename('./archivo.txt', './carpeta/archivo.txt'); // mover

// Eliminar archivo
await unlink('./temporal.txt');`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Para directorios: <code className="text-primary">mkdir</code> con <code className="text-primary">recursive: true</code>
          crea toda la cadena de carpetas. <code className="text-primary">readdir</code> con <code className="text-primary">withFileTypes</code>
          te dice si cada entrada es archivo o directorio. <code className="text-primary">rm</code> con <code className="text-primary">recursive</code>
          elimina carpetas con todo su contenido:
        </p>

        <CodeBlock language="javascript" filename="Operaciones con directorios" code={`import { mkdir, readdir, rm, access, constants } from 'fs/promises';

// Crear directorio
await mkdir('./nueva-carpeta');

// Crear directorios anidados (recursive: true)
await mkdir('./src/controllers/api', { recursive: true });

// Listar contenidos de un directorio
const archivos = await readdir('./src');
console.log(archivos); // ['app.js', 'controllers', 'models']

// Listar con detalles
const items = await readdir('./src', { withFileTypes: true });
for (const item of items) {
  const tipo = item.isDirectory() ? 'DIR' : 'FILE';
  console.log(\`[\${tipo}] \${item.name}\`);
}

// Eliminar directorio (y todo su contenido)
await rm('./temp', { recursive: true, force: true });

// Verificar si existe un archivo/directorio
try {
  await access('./config.json', constants.F_OK);
  console.log('El archivo existe');
} catch {
  console.log('El archivo NO existe');
}`} />

        <InfoBox type="warning" title="Seguridad: Path Traversal">
          <strong>NUNCA</strong> uses input del usuario directamente en rutas de archivo sin sanitizar.
          Un atacante podría enviar <code>../../etc/passwd</code> para acceder a archivos del sistema.
          Siempre valida y sanitiza las rutas con <code>path.resolve()</code> y verifica que estén dentro
          del directorio permitido.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Watch: Observar cambios en archivos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">fs.watch()</code> observa cambios en archivos o directorios en tiempo real.
          Retorna un async iterable que emite eventos cuando se crean, modifican o eliminan archivos.
          Es la misma técnica que usan herramientas como <code className="text-primary">nodemon</code>:
        </p>

        <CodeBlock language="javascript" filename="Watcher" code={`import { watch } from 'fs/promises';

// Observar cambios en un directorio
const watcher = watch('./src', { recursive: true });

for await (const event of watcher) {
  console.log(\`[\${event.eventType}] \${event.filename}\`);
  // [rename] nuevo-archivo.js
  // [change] app.js
}

// Esto es lo que usan herramientas como nodemon internamente`} />
      </section>
    </div>
  );
}
