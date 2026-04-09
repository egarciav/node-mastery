import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PatronesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Patrones de Diseño en Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Repository, Service Layer, Dependency Injection y más</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Repository Pattern</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Abstrae la lógica de acceso a datos detrás de una interfaz. Permite cambiar de base de datos
          sin modificar los servicios.
        </p>

        <CodeBlock language="typescript" filename="repositories/IUserRepository.ts" code={`export interface IUserRepository {
  findAll(options: PaginationOptions): Promise<PaginatedResult<User>>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  create(data: CreateUserDTO): Promise<User>;
  update(id: string, data: UpdateUserDTO): Promise<User | null>;
  delete(id: string): Promise<boolean>;
}

// Implementación con Mongoose
export class MongoUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return UserModel.findById(id).lean();
  }
  // ... más métodos
}

// Implementación con Prisma
export class PrismaUserRepository implements IUserRepository {
  async findById(id: string): Promise<User | null> {
    return prisma.user.findUnique({ where: { id } });
  }
  // ... más métodos
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Service Layer Pattern</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El service contiene toda la <strong className="text-text">lógica de negocio</strong>: validar que un email
          no exista, hashear passwords, aplicar reglas. Lo crucial: el service <strong className="text-text">no conoce HTTP</strong>
          (nada de req/res) y <strong className="text-text">no accede a la BD directamente</strong> (usa el repository).
          Esto hace que sea completamente testeable sin mockear Express ni la BD:
        </p>

        <CodeBlock language="typescript" filename="services/userService.ts" code={`export class UserService {
  constructor(private userRepo: IUserRepository) {}

  async getUsers(options: PaginationOptions) {
    return this.userRepo.findAll(options);
  }

  async getUserById(id: string) {
    const user = await this.userRepo.findById(id);
    if (!user) throw new NotFoundError('Usuario');
    return user;
  }

  async createUser(data: CreateUserDTO) {
    // Lógica de negocio: verificar email único
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) throw new ConflictError('El email ya existe');

    // Hash password
    const hashedPassword = await bcrypt.hash(data.password, 12);
    return this.userRepo.create({ ...data, password: hashedPassword });
  }
}

// El service NO conoce HTTP (req/res)
// El service NO conoce la BD directamente (usa repository)
// El service contiene la LÓGICA DE NEGOCIO`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Dependency Injection (simple)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Con Repository + Service Layer, necesitas "cablear" las dependencias: crear el repository,
          pasárselo al service, pasárselo al controller. Un archivo <code className="text-primary">container.ts</code>
          centraliza esta composición. Si mañana cambias de MongoDB a PostgreSQL, solo cambias
          una línea (<code className="text-primary">MongoUserRepository</code> por <code className="text-primary">PrismaUserRepository</code>):
        </p>

        <CodeBlock language="typescript" filename="Wiring manual" code={`// container.ts — Composición de dependencias
import { MongoUserRepository } from './repositories/MongoUserRepository.js';
import { UserService } from './services/userService.js';
import { UserController } from './controllers/userController.js';

// Crear instancias con sus dependencias
const userRepository = new MongoUserRepository();
const userService = new UserService(userRepository);
const userController = new UserController(userService);

export { userController };

// En routes:
import { userController } from '../container.js';
router.get('/users', (req, res, next) => userController.getUsers(req, res, next));`} />

        <InfoBox type="info" title="¿Cuándo usar estos patrones?">
          Para proyectos pequeños (CRUD simple, MVP), Controller → Service → Model directo es suficiente.
          Los patrones Repository y DI añaden complejidad pero brillan en proyectos medianos/grandes
          donde necesitas testabilidad, flexibilidad y mantenibilidad a largo plazo.
        </InfoBox>
      </section>
    </div>
  );
}
