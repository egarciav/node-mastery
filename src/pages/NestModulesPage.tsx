import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestModulesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Módulos en NestJS</h1>
      <p className="text-text-muted text-lg mb-8">Organizar la aplicación en módulos cohesivos y reutilizables</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Estructura de módulos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un <strong className="text-text">módulo</strong> en NestJS agrupa todo lo relacionado con una feature:
          su controller, service y providers. <code className="text-primary">controllers</code> registra qué controllers
          manejan las rutas; <code className="text-primary">providers</code> registra los services disponibles;
          <code className="text-primary">exports</code> hace un service visible para otros módulos que lo importen.
          El módulo raíz (<code className="text-primary">AppModule</code>) importa todos los demás:
        </p>

        <CodeBlock language="typescript" filename="users/users.module.ts" code={`import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Disponible para otros módulos
})
export class UsersModule {}`} />

        <CodeBlock language="typescript" filename="app.module.ts — Módulo raíz" code={`import { Module } from '@nestjs/common';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,  // Global: disponible en toda la app
    AuthModule,
    UsersModule,
  ],
})
export class AppModule {}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Módulo global (ej: Prisma)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Algunos services se usan en <strong className="text-text">todos</strong> los módulos (como la conexión a BD).
          En vez de importar <code className="text-primary">PrismaModule</code> en cada módulo, lo marcas como
          <code className="text-primary">@Global()</code> y solo lo importas una vez en <code className="text-primary">AppModule</code>.
          El PrismaService extiende PrismaClient y usa lifecycle hooks para conectar/desconectar automáticamente:
        </p>

        <CodeBlock language="typescript" filename="prisma/prisma.module.ts" code={`import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global() // Disponible en TODOS los módulos sin importar
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}`} />

        <CodeBlock language="typescript" filename="prisma/prisma.service.ts" code={`import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}`} />

        <InfoBox type="nest" title="Organización por feature">
          Cada feature (users, auth, products) tiene su propio módulo con controller, service y DTOs.
          Esto mantiene el código organizado y permite reutilizar módulos entre proyectos.
          Usa <code>nest g resource users</code> para generar todo el boilerplate automáticamente.
        </InfoBox>
      </section>
    </div>
  );
}
