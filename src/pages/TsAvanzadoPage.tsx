import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function TsAvanzadoPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-ts mb-2">TypeScript Avanzado para Backend</h1>
      <p className="text-text-muted text-lg mb-8">Genéricos, decoradores, type guards y patrones avanzados</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Genéricos en servicios</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los genéricos (<code className="text-primary">{`<T>`}</code>) permiten crear código <strong className="text-text">reutilizable y tipado</strong>.
          En vez de escribir un servicio CRUD para cada entidad (UserService, ProductService, OrderService),
          defines la lógica una vez con genéricos y cada entidad la hereda. Esto elimina duplicación masiva:
        </p>

        <CodeBlock language="typescript" filename="services/BaseService.ts" code={`// Servicio genérico reutilizable para cualquier modelo
export abstract class BaseService<T, CreateDTO, UpdateDTO> {
  abstract findAll(options: PaginationOptions): Promise<PaginatedResult<T>>;
  abstract findById(id: string): Promise<T | null>;
  abstract create(data: CreateDTO): Promise<T>;
  abstract update(id: string, data: UpdateDTO): Promise<T | null>;
  abstract delete(id: string): Promise<boolean>;
}

interface PaginationOptions {
  page: number;
  limit: number;
  sort?: string;
  filter?: Record<string, unknown>;
}

interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
}

// Implementación concreta
export class UserService extends BaseService<User, CreateUserDTO, UpdateUserDTO> {
  async findAll(options: PaginationOptions): Promise<PaginatedResult<User>> {
    const { page, limit } = options;
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      prisma.user.findMany({ skip, take: limit }),
      prisma.user.count(),
    ]);
    return {
      data: users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }

  async create(data: CreateUserDTO): Promise<User> {
    return prisma.user.create({ data });
  }

  async update(id: string, data: UpdateUserDTO): Promise<User | null> {
    return prisma.user.update({ where: { id }, data });
  }

  async delete(id: string): Promise<boolean> {
    await prisma.user.delete({ where: { id } });
    return true;
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Type Guards</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando recibes un <code className="text-primary">unknown</code> (como en un <code className="text-primary">catch</code>),
          TypeScript no sabe qué tipo es. Los <strong className="text-text">type guards</strong> son funciones que verifican
          el tipo en runtime y le dicen a TypeScript "dentro de este <code className="text-primary">if</code>, el objeto es de este tipo".
          Son esenciales para manejar errores de forma segura:
        </p>

        <CodeBlock language="typescript" filename="Type guards personalizados" code={`// Type guard para errores
function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

function isPrismaError(error: unknown): error is { code: string; meta?: { target: string[] } } {
  return typeof error === 'object' && error !== null && 'code' in error;
}

// Uso en error handler
function errorHandler(err: unknown, req: Request, res: Response, next: NextFunction) {
  if (isAppError(err)) {
    return res.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }

  if (isPrismaError(err)) {
    if (err.code === 'P2002') {
      return res.status(409).json({
        status: 'error',
        message: \`El campo \${err.meta?.target?.join(', ')} ya existe\`,
      });
    }
    if (err.code === 'P2025') {
      return res.status(404).json({
        status: 'error',
        message: 'Recurso no encontrado',
      });
    }
  }

  console.error('Unhandled error:', err);
  res.status(500).json({ status: 'error', message: 'Error interno' });
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Zod + TypeScript — Inferencia de tipos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El problema clásico: defines una interfaz TypeScript para el tipo Y un schema de validación
          para la misma data. Si cambias uno y olvidas el otro, se desincronizan.
          <strong className="text-text"> Zod resuelve esto</strong>: defines el schema una vez y extraes el tipo
          automáticamente con <code className="text-primary">z.infer</code>. Cero duplicación:
        </p>

        <CodeBlock language="typescript" filename="Inferir tipos desde schemas Zod" code={`import { z } from 'zod';

// Definir schema UNA vez
const createUserSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(['user', 'admin']).optional().default('user'),
});

// Inferir el tipo TypeScript automáticamente
type CreateUserInput = z.infer<typeof createUserSchema>;
// Equivalente a:
// type CreateUserInput = {
//   name: string;
//   email: string;
//   password: string;
//   role?: 'user' | 'admin';
// }

// Un solo schema = validación runtime + tipo estático
// No hay duplicación ni desincronización`} />

        <InfoBox type="tip" title="Single Source of Truth">
          Con Zod, defines tus schemas una vez y obtienes: validación runtime para las peticiones HTTP
          Y tipos estáticos para TypeScript. Esto elimina la duplicación entre tipos e interfaces
          manuales y los schemas de validación.
        </InfoBox>
      </section>
    </div>
  );
}
