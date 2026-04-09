import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function EstaticosPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Archivos Estáticos</h1>
      <p className="text-text-muted text-lg mb-8">Servir imágenes, CSS, JavaScript y otros archivos con Express</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">express.static()</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Express puede servir archivos estáticos (HTML, CSS, JS, imágenes, PDFs, etc.) directamente
          desde una carpeta usando el middleware <code className="text-primary">express.static()</code>.
          Puedes montar sin prefijo (archivos accesibles desde la raíz) o con prefijo de URL.
          Las opciones avanzadas permiten configurar caché del navegador, ETags y bloquear dotfiles:
        </p>

        <CodeBlock language="javascript" filename="Servir archivos estáticos" code={`import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// Servir archivos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));
// public/logo.png  → http://localhost:3000/logo.png
// public/css/style.css → http://localhost:3000/css/style.css

// Servir con prefijo de URL
app.use('/static', express.static(path.join(__dirname, 'public')));
// public/logo.png  → http://localhost:3000/static/logo.png

// Servir uploads con prefijo
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Opciones avanzadas
app.use(express.static('public', {
  maxAge: '1d',        // Cache del navegador: 1 día
  etag: true,          // ETags para cache validation
  dotfiles: 'deny',    // No servir archivos que empiecen con .
  index: 'index.html', // Archivo por defecto en directorios
}));`} />

        <InfoBox type="tip" title="En producción">
          Para producción, es mejor servir archivos estáticos con <strong>Nginx</strong> o un
          <strong> CDN</strong> (CloudFront, Cloudflare) en vez de Express. Express puede hacerlo,
          pero Nginx es significativamente más rápido para archivos estáticos.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Template Engines</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Si necesitas renderizar HTML dinámico en el servidor (Server-Side Rendering), Express
          soporta template engines como EJS, Pug, Handlebars:
        </p>

        <CodeBlock language="javascript" filename="Usando EJS" code={`// npm install ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/dashboard', (req, res) => {
  res.render('dashboard', {
    title: 'Mi Dashboard',
    user: { name: 'Carlos', role: 'Admin' },
    items: ['Producto 1', 'Producto 2', 'Producto 3']
  });
});`} />

        <InfoBox type="info">
          En 2026, la mayoría de aplicaciones usan Express como <strong>API REST pura</strong> (solo JSON)
          con un frontend separado en React, Vue, Angular, etc. Los template engines se usan menos,
          pero son útiles para emails HTML, páginas de admin simples, o landing pages.
        </InfoBox>
      </section>
    </div>
  );
}
