import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function AutorizacionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Autorización y Roles</h1>
      <p className="text-text-muted text-lg mb-8">Control de acceso basado en roles (RBAC) y permisos</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Autenticación vs Autorización</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Autenticación (AuthN)</h3>
            <p className="text-text-muted text-sm">¿<strong className="text-text">Quién eres</strong>? Verificar la identidad del usuario (login, JWT, OAuth).</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-2">Autorización (AuthZ)</h3>
            <p className="text-text-muted text-sm">¿<strong className="text-text">Qué puedes hacer</strong>? Verificar que el usuario tiene permiso para la acción solicitada.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">RBAC — Role-Based Access Control</h2>

        <CodeBlock language="javascript" filename="middlewares/authorize.js" code={`import { ForbiddenError } from '../utils/AppError.js';

// Middleware factory — Recibe roles permitidos, retorna middleware
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    // req.user viene del middleware authenticate
    if (!req.user) {
      throw new ForbiddenError('No autenticado');
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(
        \`El rol '\${req.user.role}' no tiene acceso a este recurso\`
      );
    }

    next();
  };
}

// Middleware para verificar que el usuario accede a sus propios recursos
export function authorizeOwner(paramName = 'id') {
  return (req, res, next) => {
    const resourceId = req.params[paramName];
    const userId = req.user.userId;

    // Admin puede acceder a todo
    if (req.user.role === 'admin') return next();

    // El usuario solo puede acceder a sus propios recursos
    if (resourceId !== userId) {
      throw new ForbiddenError('No tienes permiso para acceder a este recurso');
    }

    next();
  };
}`} />

        <CodeBlock language="javascript" filename="Usar en rutas" code={`import { authenticate } from '../middlewares/auth.js';
import { authorize, authorizeOwner } from '../middlewares/authorize.js';

const router = Router();

// Rutas públicas — Sin autenticación
router.get('/products', getProducts);

// Rutas autenticadas — Cualquier usuario logueado
router.get('/profile', authenticate, getProfile);
router.put('/profile', authenticate, updateProfile);

// Rutas con rol específico
router.post('/products', authenticate, authorize('admin', 'editor'), createProduct);
router.delete('/products/:id', authenticate, authorize('admin'), deleteProduct);

// Rutas con ownership
router.get('/users/:id', authenticate, authorizeOwner('id'), getUserById);
router.put('/users/:id', authenticate, authorizeOwner('id'), updateUser);

// Rutas solo admin
router.get('/admin/dashboard', authenticate, authorize('admin'), getDashboard);
router.get('/admin/users', authenticate, authorize('admin'), getAllUsers);`} />

        <InfoBox type="tip" title="Principio de menor privilegio">
          Siempre asigna el <strong>mínimo nivel de acceso</strong> necesario. Un usuario nuevo debería tener
          rol 'user' por defecto. Solo promueve a 'admin' manualmente. Nunca des permisos de admin
          automáticamente.
        </InfoBox>
      </section>
    </div>
  );
}
