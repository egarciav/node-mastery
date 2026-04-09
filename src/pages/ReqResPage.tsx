import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ReqResPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-express mb-2">Request y Response</h1>
      <p className="text-text-muted text-lg mb-8">Todo lo que puedes hacer con req y res en Express</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El objeto Request (req)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El objeto <code className="text-primary">req</code> contiene toda la información de la petición entrante:
          el body, los parámetros de ruta, query strings, headers, cookies, y propiedades custom
          que middlewares anteriores hayan añadido. Aquí las propiedades que usarás constantemente:
        </p>

        <CodeBlock language="javascript" filename="Propiedades de req" code={`app.post('/api/users', (req, res) => {
  // Body (requiere express.json() middleware)
  req.body;            // { name: "Carlos", email: "c@mail.com" }

  // Parámetros de ruta
  req.params;          // { id: "123" }   (de /users/:id)

  // Query strings
  req.query;           // { page: "1", limit: "10" }

  // Headers
  req.headers;                      // Todos los headers
  req.headers['content-type'];      // 'application/json'
  req.headers['authorization'];     // 'Bearer eyJhbG...'
  req.get('Content-Type');          // Alias para headers

  // Info de la petición
  req.method;          // 'POST'
  req.url;             // '/api/users?page=1'
  req.originalUrl;     // '/api/users?page=1' (original, no modificada)
  req.path;            // '/api/users'
  req.protocol;        // 'http' o 'https'
  req.hostname;        // 'localhost'
  req.ip;              // '::1' o '127.0.0.1'

  // Cookies (requiere cookie-parser middleware)
  req.cookies;         // { session: "abc123" }

  // Propiedades custom (agregadas por middlewares)
  req.user;            // { id: 1, role: "admin" } (de auth middleware)
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El objeto Response (res)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El objeto <code className="text-primary">res</code> te permite enviar la respuesta al cliente.
          El método más común para APIs es <code className="text-primary">res.json()</code>. Puedes establecer
          códigos de estado, headers, cookies, y hasta enviar archivos o redirecciones:
        </p>

        <CodeBlock language="javascript" filename="Métodos de res" code={`app.get('/api/demo', (req, res) => {
  // Enviar JSON (el más común en APIs)
  res.json({ message: 'Hola', data: [1, 2, 3] });

  // Establecer status code
  res.status(201).json({ id: 1, name: 'Nuevo' });
  res.status(404).json({ error: 'No encontrado' });
  res.status(204).end();  // No content (sin body)

  // Enviar texto
  res.send('Hola mundo');

  // Enviar archivo
  res.sendFile('/path/to/file.pdf');
  res.download('/path/to/file.pdf', 'reporte.pdf');

  // Establecer headers
  res.set('X-Custom-Header', 'valor');
  res.set({
    'X-Powered-By': 'Mi API',
    'Cache-Control': 'no-store'
  });

  // Cookies
  res.cookie('session', 'abc123', {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000  // 1 día
  });
  res.clearCookie('session');

  // Redireccionar
  res.redirect('/nueva-url');
  res.redirect(301, '/url-permanente');
});`} />

        <InfoBox type="warning" title="No envíes respuesta dos veces">
          <strong>Solo puedes enviar UNA respuesta por petición.</strong> Después de <code>res.json()</code>,
          <code> res.send()</code> o <code>res.end()</code>, no puedes enviar otra respuesta. Si lo intentas,
          obtendrás el error: <code>"Cannot set headers after they are sent"</code>.
          Usa <code>return</code> antes de <code>res.json()</code> para evitar ejecución posterior.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Códigos de estado HTTP comunes</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-muted">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text">Código</th>
                <th className="text-left py-3 px-4 text-text">Nombre</th>
                <th className="text-left py-3 px-4">Cuándo usarlo</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-success font-mono">200</td><td className="py-2 px-4">OK</td><td className="py-2 px-4">GET exitoso, PUT/PATCH exitoso</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-success font-mono">201</td><td className="py-2 px-4">Created</td><td className="py-2 px-4">POST exitoso — recurso creado</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-success font-mono">204</td><td className="py-2 px-4">No Content</td><td className="py-2 px-4">DELETE exitoso — sin body</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">400</td><td className="py-2 px-4">Bad Request</td><td className="py-2 px-4">Datos de entrada inválidos</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">401</td><td className="py-2 px-4">Unauthorized</td><td className="py-2 px-4">No autenticado — falta token</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">403</td><td className="py-2 px-4">Forbidden</td><td className="py-2 px-4">Autenticado pero sin permisos</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">404</td><td className="py-2 px-4">Not Found</td><td className="py-2 px-4">Recurso no existe</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">409</td><td className="py-2 px-4">Conflict</td><td className="py-2 px-4">Email ya registrado, duplicados</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">422</td><td className="py-2 px-4">Unprocessable</td><td className="py-2 px-4">Validación fallida</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 text-warning font-mono">429</td><td className="py-2 px-4">Too Many Requests</td><td className="py-2 px-4">Rate limit excedido</td></tr>
              <tr><td className="py-2 px-4 text-error font-mono">500</td><td className="py-2 px-4">Internal Error</td><td className="py-2 px-4">Error inesperado del servidor</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
