import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function CrudPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">CRUD Completo</h1>
      <p className="text-text-muted text-lg mb-8">Implementar Create, Read, Update, Delete con Express</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Controller CRUD profesional</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El controller recibe la petición HTTP, extrae los datos necesarios (params, query, body),
          delega la lógica al service, y envía la respuesta. Usa <code className="text-primary">asyncHandler</code>
          para capturar errores automáticamente sin try/catch repetitivo. Nota cómo cada método
          usa el código HTTP correcto: 200, 201, 204:
        </p>

        <CodeBlock language="javascript" filename="controllers/userController.js" code={`import { asyncHandler } from '../utils/asyncHandler.js';
import { NotFoundError } from '../utils/AppError.js';
import * as userService from '../services/userService.js';

// GET /api/users
export const getUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, sort = '-createdAt', search } = req.query;

  const result = await userService.findAll({
    page: Number(page),
    limit: Number(limit),
    sort,
    search
  });

  res.json({
    status: 'success',
    data: result.users,
    meta: {
      total: result.total,
      page: result.page,
      limit: result.limit,
      totalPages: result.totalPages
    }
  });
});

// GET /api/users/:id
export const getUserById = asyncHandler(async (req, res) => {
  const user = await userService.findById(req.params.id);
  if (!user) throw new NotFoundError('Usuario');

  res.json({ status: 'success', data: user });
});

// POST /api/users
export const createUser = asyncHandler(async (req, res) => {
  const user = await userService.create(req.body);

  res.status(201).json({
    status: 'success',
    data: user
  });
});

// PUT /api/users/:id
export const updateUser = asyncHandler(async (req, res) => {
  const user = await userService.update(req.params.id, req.body);
  if (!user) throw new NotFoundError('Usuario');

  res.json({ status: 'success', data: user });
});

// DELETE /api/users/:id
export const deleteUser = asyncHandler(async (req, res) => {
  const user = await userService.remove(req.params.id);
  if (!user) throw new NotFoundError('Usuario');

  res.status(204).end();
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Service Layer</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El service contiene la lógica de negocio real: búsqueda con filtros, paginación, exclusión
          de campos sensibles como <code className="text-primary">password</code>. No conoce HTTP (nada de req/res).
          Si mañana necesitas la misma lógica en un CLI o un worker, reutilizas el service tal cual:
        </p>

        <CodeBlock language="javascript" filename="services/userService.js" code={`import User from '../models/User.js';

export async function findAll({ page, limit, sort, search }) {
  const query = search
    ? { name: { $regex: search, $options: 'i' } }
    : {};

  const skip = (page - 1) * limit;
  const total = await User.countDocuments(query);

  const users = await User.find(query)
    .sort(sort)
    .skip(skip)
    .limit(limit)
    .select('-password');

  return {
    users,
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit)
  };
}

export async function findById(id) {
  return User.findById(id).select('-password');
}

export async function create(data) {
  const user = new User(data);
  await user.save();
  const { password, ...userWithoutPassword } = user.toObject();
  return userWithoutPassword;
}

export async function update(id, data) {
  return User.findByIdAndUpdate(id, data, {
    new: true,          // Retornar el documento actualizado
    runValidators: true // Ejecutar validaciones del schema
  }).select('-password');
}

export async function remove(id) {
  return User.findByIdAndDelete(id);
}`} />

        <InfoBox type="tip" title="Patrón Controller → Service → Model">
          <strong>Controller:</strong> Recibe req/res, valida input, llama al service, envía respuesta.<br/>
          <strong>Service:</strong> Lógica de negocio pura. No conoce HTTP ni Express.<br/>
          <strong>Model:</strong> Interacción con la base de datos.<br/>
          Esta separación hace tu código testeable, mantenible y reutilizable.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Routes</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las rutas conectan URLs con controllers y middlewares. Las rutas públicas (GET)
          no requieren autenticación. Las que modifican datos (POST, PUT, DELETE) pasan primero
          por <code className="text-primary">authenticate</code> y <code className="text-primary">validate</code>:
        </p>

        <CodeBlock language="javascript" filename="routes/userRoutes.js" code={`import { Router } from 'express';
import {
  getUsers, getUserById, createUser, updateUser, deleteUser
} from '../controllers/userController.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createUserSchema, updateUserSchema } from '../schemas/userSchema.js';

const router = Router();

router.get('/', getUsers);
router.get('/:id', getUserById);
router.post('/', authenticate, validate(createUserSchema), createUser);
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, deleteUser);

export default router;`} />
      </section>
    </div>
  );
}
