import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function BuffersStreamsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Buffers y Streams</h1>
      <p className="text-text-muted text-lg mb-8">Manejo eficiente de datos binarios y flujos de información</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es un Buffer?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un Buffer es una <strong className="text-text">zona de memoria fija</strong> que almacena datos binarios crudos.
          En JavaScript puro no puedes trabajar con datos binarios directamente — los Buffers de Node.js resuelven esto.
          Son esenciales para trabajar con archivos, redes, criptografía y cualquier dato que no sea texto puro.
        </p>

        <CodeBlock language="javascript" filename="buffers.js" code={`// Crear buffers
const buf1 = Buffer.alloc(10);              // 10 bytes inicializados en 0
const buf2 = Buffer.from('Hola Node');      // Desde string (UTF-8 por defecto)
const buf3 = Buffer.from([72, 111, 108, 97]); // Desde array de bytes

console.log(buf2);            // <Buffer 48 6f 6c 61 20 4e 6f 64 65>
console.log(buf2.toString()); // "Hola Node"
console.log(buf2.length);     // 9 (bytes, no caracteres)
console.log(buf3.toString()); // "Hola"

// Encodings soportados
const base64 = Buffer.from('Hola').toString('base64');  // "SG9sYQ=="
const hex = Buffer.from('Hola').toString('hex');         // "486f6c61"
const original = Buffer.from('SG9sYQ==', 'base64').toString(); // "Hola"

// Comparar y concatenar
const a = Buffer.from('ABC');
const b = Buffer.from('ABC');
console.log(a.equals(b));                    // true
const combined = Buffer.concat([a, b]);       // "ABCABC"

// Slice (comparten memoria — cuidado!)
const slice = buf2.subarray(0, 4);
console.log(slice.toString()); // "Hola"`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué son los Streams?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los Streams son <strong className="text-text">colecciones de datos que se procesan pieza por pieza</strong>
          (chunk by chunk) en vez de cargar todo en memoria. Imagina leer un archivo de 4GB: sin streams tendrías
          que cargarlo entero en RAM. Con streams lo procesas en pedazos pequeños.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Readable Stream</h3>
            <p className="text-text-muted text-sm">Fuente de datos. Puedes <strong className="text-text">leer</strong> de él. Ej: <code className="text-primary">fs.createReadStream()</code>, <code className="text-primary">http request</code>.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Writable Stream</h3>
            <p className="text-text-muted text-sm">Destino de datos. Puedes <strong className="text-text">escribir</strong> en él. Ej: <code className="text-primary">fs.createWriteStream()</code>, <code className="text-primary">http response</code>.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Duplex Stream</h3>
            <p className="text-text-muted text-sm">Ambos: lee y escribe. Ej: <code className="text-primary">TCP socket</code>, <code className="text-primary">zlib</code>.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Transform Stream</h3>
            <p className="text-text-muted text-sm">Duplex que <strong className="text-text">modifica</strong> los datos al pasar. Ej: <code className="text-primary">zlib.createGzip()</code>, cifrado.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Streams en práctica</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El método moderno y recomendado es <code className="text-primary">pipeline()</code> de <code className="text-primary">stream/promises</code>:
          conecta múltiples streams, maneja errores automáticamente, y limpia recursos si algo falla.
          Aquí leerás un archivo, lo comprimirás con gzip al vuelo, y lo guardarás — todo sin cargar el archivo entero en memoria:
        </p>

        <CodeBlock language="javascript" filename="Leer archivo con streams" code={`import { createReadStream, createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';
import { createGzip } from 'zlib';

// Leer archivo grande chunk por chunk
const readable = createReadStream('./archivo-grande.log', {
  encoding: 'utf8',
  highWaterMark: 64 * 1024, // 64KB por chunk (default: 64KB)
});

readable.on('data', (chunk) => {
  console.log(\`Chunk recibido: \${chunk.length} bytes\`);
});

readable.on('end', () => console.log('Lectura completa'));
readable.on('error', (err) => console.error('Error:', err));

// Copiar archivo eficientemente con pipe
const source = createReadStream('./video.mp4');
const dest = createWriteStream('./copia-video.mp4');
source.pipe(dest);

// Pipeline (recomendado) — Maneja errores y limpieza automáticamente
await pipeline(
  createReadStream('./datos.log'),
  createGzip(),                          // Comprimir al vuelo
  createWriteStream('./datos.log.gz')
);
console.log('Archivo comprimido exitosamente');`} />

        <p className="text-text-muted leading-relaxed mb-4">
          En un servidor HTTP, <code className="text-primary">pipe()</code> conecta un Readable Stream directamente
          a la respuesta. El archivo se envía chunk por chunk al cliente, usando solo ~64KB de RAM
          sin importar el tamaño del archivo:
        </p>

        <CodeBlock language="javascript" filename="Streams en un servidor HTTP" code={`import http from 'http';
import { createReadStream } from 'fs';

const server = http.createServer((req, res) => {
  // MAL — Carga TODO el archivo en memoria
  // const data = fs.readFileSync('./video.mp4');
  // res.end(data);

  // BIEN — Stream: envía chunk por chunk sin cargar todo en RAM
  const stream = createReadStream('./video.mp4');
  res.writeHead(200, { 'Content-Type': 'video/mp4' });
  stream.pipe(res);

  stream.on('error', (err) => {
    res.writeHead(500);
    res.end('Error interno');
  });
});

server.listen(3000);
// Un archivo de 4GB se sirve usando solo ~64KB de memoria`} />

        <InfoBox type="tip" title="¿Cuándo usar Streams?">
          <strong>Siempre</strong> que trabajes con datos grandes o flujos continuos: archivos grandes, video/audio
          streaming, procesamiento de logs, transferencias de red, compresión/descompresión, y respuestas HTTP
          con archivos. La regla: si el dato puede ser más grande que unos pocos MB, usa streams.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Async iterators con Streams (moderno)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los Readable Streams son <strong className="text-text">async iterables</strong>, así que puedes recorrerlos
          con <code className="text-primary">for await...of</code>. Es la forma más limpia y moderna de procesar streams:
        </p>

        <CodeBlock language="javascript" filename="for-await con streams" code={`import { createReadStream } from 'fs';

// Los Readable streams son async iterables
const stream = createReadStream('./datos.csv', { encoding: 'utf8' });

let lineCount = 0;
for await (const chunk of stream) {
  // Contar líneas en un archivo grande sin cargarlo todo en memoria
  lineCount += chunk.split('\\n').length - 1;
}
console.log(\`Total de líneas: \${lineCount}\`);`} />
      </section>
    </div>
  );
}
