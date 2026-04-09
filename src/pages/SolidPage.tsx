import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function SolidPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Principios SOLID</h1>
      <p className="text-text-muted text-lg mb-8">Cinco principios para escribir código limpio y mantenible</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">S — Single Responsibility</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cada clase o módulo debe tener <strong className="text-text">una sola razón para cambiar</strong>.
          Si un servicio maneja usuarios, envía emails, genera reportes y sube archivos, tiene 4 razones
          para cambiar. Separa cada responsabilidad en su propio servicio:
        </p>
        <CodeBlock language="typescript" filename="Mal vs Bien" code={`// ❌ MAL: UserService hace demasiado
class UserService {
  createUser() { /* ... */ }
  sendWelcomeEmail() { /* ... */ }
  generateReport() { /* ... */ }
  uploadAvatar() { /* ... */ }
}

// ✅ BIEN: Cada servicio tiene una responsabilidad
class UserService { createUser() { /* ... */ } }
class EmailService { sendWelcomeEmail() { /* ... */ } }
class ReportService { generateReport() { /* ... */ } }
class FileService { uploadAvatar() { /* ... */ } }`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">O — Open/Closed</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Abierto para extensión, cerrado para modificación. En vez de agregar <code className="text-primary">if/else</code>
          para cada nuevo tipo, defines una interfaz y creas clases que la implementan.
          Para añadir Slack, solo creas <code className="text-primary">SlackChannel</code> sin tocar <code className="text-primary">NotificationService</code>:
        </p>
        <CodeBlock language="typescript" code={`// ✅ Extensible: añadir nuevo tipo de notificación sin modificar NotificationService
interface NotificationChannel {
  send(to: string, message: string): Promise<void>;
}

class EmailChannel implements NotificationChannel {
  async send(to: string, message: string) { /* enviar email */ }
}

class SlackChannel implements NotificationChannel {
  async send(to: string, message: string) { /* enviar a Slack */ }
}

class NotificationService {
  constructor(private channels: NotificationChannel[]) {}

  async notify(to: string, message: string) {
    await Promise.all(this.channels.map(ch => ch.send(to, message)));
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">D — Dependency Inversion</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los módulos de alto nivel no deben depender de módulos de bajo nivel. Ambos deben depender de
          <strong className="text-text">abstracciones</strong> (interfaces). El service recibe su repositorio por
          constructor (inyección), no lo crea internamente. Así puedes cambiar Mongo por Prisma sin
          tocar el service:
        </p>
        <CodeBlock language="typescript" code={`// ❌ MAL: Dependencia directa de implementación
class UserService {
  private repo = new MongoUserRepository(); // Acoplado a Mongo
}

// ✅ BIEN: Depender de abstracción (interfaz)
class UserService {
  constructor(private repo: IUserRepository) {} // Inyectado
}

// Ahora puedes cambiar Mongo por Prisma sin tocar UserService
const service = new UserService(new PrismaUserRepository());`} />

        <InfoBox type="tip" title="SOLID en la práctica">
          No necesitas aplicar todos los principios desde el día uno. Empieza con <strong>S</strong> (responsabilidad única)
          y <strong>D</strong> (inyección de dependencias) — son los que más impacto tienen en Node.js.
          Los demás (L, I) aplícalos cuando tu código lo necesite naturalmente.
        </InfoBox>
      </section>
    </div>
  );
}
