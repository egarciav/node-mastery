import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function DisenoApiPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Diseño de APIs REST</h1>
      <p className="text-text-muted text-lg mb-8">Principios, convenciones y mejores prácticas para diseñar APIs profesionales</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es REST?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          REST (Representational State Transfer) es un <strong className="text-text">estilo arquitectónico</strong> para
          diseñar APIs web. No es un protocolo ni un estándar — es un conjunto de principios que, cuando se siguen,
          producen APIs predecibles, escalables y fáciles de entender.
        </p>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">1. Recursos con URLs</h3>
            <p className="text-text-muted text-sm">Cada entidad (usuario, producto, orden) tiene una URL única que lo identifica.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">2. Métodos HTTP como verbos</h3>
            <p className="text-text-muted text-sm">GET para leer, POST para crear, PUT/PATCH para actualizar, DELETE para eliminar.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">3. Stateless</h3>
            <p className="text-text-muted text-sm">Cada petición contiene toda la información necesaria. El servidor no guarda estado de sesión.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">4. Respuestas con códigos HTTP</h3>
            <p className="text-text-muted text-sm">200 OK, 201 Created, 404 Not Found, 500 Internal Error — el código indica el resultado.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Convenciones de naming</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las URLs deben ser <strong className="text-text">predecibles e intuitivas</strong>. Usa sustantivos en plural,
          lowercase y kebab-case. Los métodos HTTP son los verbos (GET = leer, POST = crear, etc.).
          Este ejemplo muestra las convenciones correctas y los errores comunes a evitar:
        </p>

        <CodeBlock language="bash" filename="URLs RESTful — Buenas prácticas" code={`# BIEN — Sustantivos en plural, lowercase, kebab-case
GET    /api/users              # Listar usuarios
GET    /api/users/123          # Obtener usuario 123
POST   /api/users              # Crear usuario
PUT    /api/users/123          # Reemplazar usuario 123
PATCH  /api/users/123          # Actualizar parcialmente
DELETE /api/users/123          # Eliminar usuario 123

# Recursos anidados
GET    /api/users/123/orders          # Órdenes del usuario 123
GET    /api/users/123/orders/456      # Orden 456 del usuario 123
POST   /api/users/123/orders          # Crear orden para usuario 123

# MAL — Evitar esto:
GET    /api/getUsers            # ❌ No uses verbos en la URL
GET    /api/User                # ❌ No uses singular ni PascalCase
POST   /api/users/create        # ❌ POST ya implica "crear"
GET    /api/users/delete/123    # ❌ Usa DELETE method, no la URL
GET    /api/user_list           # ❌ Usa kebab-case, no snake_case`} />

        <InfoBox type="tip" title="Regla de oro">
          Las URLs son <strong>sustantivos</strong> (recursos). Los <strong>métodos HTTP</strong> son los verbos
          (acciones). Nunca pongas verbos en las URLs.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Formato de respuesta estándar</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Todas las respuestas deben seguir un <strong className="text-text">formato consistente</strong>.
          Siempre incluye un campo <code className="text-primary">status</code> ("success" o "error"),
          los datos en <code className="text-primary">data</code>, y metadatos de paginación en <code className="text-primary">meta</code>
          para listas. Los errores incluyen <code className="text-primary">message</code> y opcionalmente un array de <code className="text-primary">errors</code>:
        </p>

        <CodeBlock language="javascript" filename="Respuesta exitosa" code={`// GET /api/users — Lista
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Carlos", "email": "carlos@mail.com" },
    { "id": 2, "name": "María", "email": "maria@mail.com" }
  ],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 10,
    "totalPages": 15
  }
}

// GET /api/users/1 — Recurso individual
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Carlos",
    "email": "carlos@mail.com",
    "createdAt": "2024-01-15T10:30:00Z"
  }
}

// POST /api/users — Creación (201)
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "Ana",
    "email": "ana@mail.com"
  }
}`} />

        <CodeBlock language="javascript" filename="Respuesta de error" code={`// 400 Bad Request — Error de validación
{
  "status": "error",
  "message": "Error de validación",
  "errors": [
    { "field": "email", "message": "Email inválido" },
    { "field": "name", "message": "El nombre es requerido" }
  ]
}

// 404 Not Found
{
  "status": "error",
  "message": "Usuario no encontrado"
}

// 500 Internal Server Error
{
  "status": "error",
  "message": "Error interno del servidor"
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Versionado de API</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando necesitas hacer cambios incompatibles (breaking changes), creas una nueva versión.
          El método más común es incluir la versión en la URL. Los clientes existentes siguen usando
          la versión anterior sin romperse:
        </p>

        <CodeBlock language="javascript" filename="Versionado en la URL (recomendado)" code={`// Versión en la URL — el más común y simple
app.use('/api/v1', routesV1);
app.use('/api/v2', routesV2);

// GET /api/v1/users — Versión antigua
// GET /api/v2/users — Versión nueva

// Esto permite mantener retrocompatibilidad
// Los clientes viejos siguen usando v1
// Los clientes nuevos migran a v2`} />
      </section>
    </div>
  );
}
