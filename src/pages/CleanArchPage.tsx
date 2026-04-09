import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function CleanArchPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Clean Architecture</h1>
      <p className="text-text-muted text-lg mb-8">Separar responsabilidades con capas independientes del framework</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Principio fundamental</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Clean Architecture organiza el código en <strong className="text-text">capas concéntricas</strong> donde
          las dependencias siempre apuntan hacia adentro. El dominio (lógica de negocio) no conoce ni depende
          de Express, Mongoose, Prisma ni ningún framework. Esto hace el código testeable, mantenible y portable.
        </p>

        <CodeBlock language="bash" filename="Estructura Clean Architecture" code={`src/
├── domain/                  # Capa interna — NO depende de nada externo
│   ├── entities/
│   │   └── User.ts          # Entidad pura (clase/interfaz)
│   ├── repositories/
│   │   └── IUserRepository.ts  # Interfaz (contrato)
│   └── usecases/
│       ├── CreateUser.ts    # Caso de uso
│       └── GetUserById.ts
├── infrastructure/          # Capa externa — Implementaciones concretas
│   ├── database/
│   │   ├── MongoUserRepository.ts
│   │   └── PrismaUserRepository.ts
│   ├── http/
│   │   ├── controllers/
│   │   │   └── UserController.ts
│   │   ├── routes/
│   │   │   └── userRoutes.ts
│   │   └── middlewares/
│   └── services/
│       └── BcryptHashService.ts
└── app.ts`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Use Case (Caso de Uso)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un <strong className="text-text">Use Case</strong> encapsula una acción de negocio específica. Recibe datos,
          aplica reglas de negocio, y delega la persistencia a interfaces (no a implementaciones concretas).
          Lo clave: este código <strong className="text-text">no conoce Express, ni Mongoose, ni bcrypt</strong> —
          solo trabaja con interfaces. Si cambias de framework o BD, este archivo no se toca:
        </p>

        <CodeBlock language="typescript" filename="domain/usecases/CreateUser.ts" code={`import { IUserRepository } from '../repositories/IUserRepository.js';
import { IHashService } from '../services/IHashService.js';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

export class CreateUser {
  constructor(
    private userRepo: IUserRepository,
    private hashService: IHashService,
  ) {}

  async execute(input: CreateUserInput) {
    // Lógica de negocio pura
    const existing = await this.userRepo.findByEmail(input.email);
    if (existing) {
      throw new Error('Email ya registrado');
    }

    const hashedPassword = await this.hashService.hash(input.password);

    return this.userRepo.create({
      ...input,
      password: hashedPassword,
    });
  }
}

// Este use case NO conoce:
// - Express (no hay req/res)
// - Mongoose/Prisma (usa interfaz)
// - bcrypt (usa interfaz IHashService)`} />

        <InfoBox type="info" title="¿Cuándo usar Clean Architecture?">
          Para proyectos pequeños o MVPs, es overkill. Brilla en proyectos medianos/grandes con
          lógica de negocio compleja, múltiples fuentes de datos, o donde necesitas máxima testabilidad.
          Empieza simple (Controller → Service → Model) y evoluciona cuando lo necesites.
        </InfoBox>
      </section>
    </div>
  );
}
