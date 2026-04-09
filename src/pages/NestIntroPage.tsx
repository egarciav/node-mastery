import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestIntroPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Introducción a NestJS</h1>
      <p className="text-text-muted text-lg mb-8">Framework progresivo para construir aplicaciones server-side eficientes y escalables</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es NestJS?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          NestJS es un framework para Node.js que usa <strong className="text-text">TypeScript</strong> por defecto,
          está inspirado en Angular, y proporciona una arquitectura opinada con <strong className="text-text">decoradores</strong>,
          <strong className="text-text">inyección de dependencias</strong>, y módulos. Usa Express (o Fastify) por debajo.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Setup</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          NestJS tiene su propia CLI que genera proyectos con una estructura completa: módulos,
          controllers, services, y archivos de test ya configurados. Un solo comando te da un
          proyecto listo para desarrollar:
        </p>

        <CodeBlock language="bash" code={`# Instalar CLI
npm install -g @nestjs/cli

# Crear proyecto
nest new mi-api-nest

# Estructura generada
cd mi-api-nest
npm run start:dev`} />

        <CodeBlock language="bash" filename="Estructura del proyecto" code={`src/
├── app.module.ts        # Módulo raíz
├── app.controller.ts    # Controller de ejemplo
├── app.service.ts       # Service de ejemplo
├── app.controller.spec.ts  # Test
└── main.ts              # Entry point`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Entry point</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El archivo <code className="text-primary">main.ts</code> es donde arranca la app. Aquí configuras
          comportamientos globales: <strong className="text-text">ValidationPipe</strong> para validar automáticamente
          todos los DTOs, CORS para permitir peticiones desde el frontend, y un prefijo global
          para que todas las rutas empiecen con <code className="text-primary">/api</code>:
        </p>

        <CodeBlock language="typescript" filename="main.ts" code={`import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Validación global con class-validator
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,       // Elimina propiedades no definidas en DTO
    forbidNonWhitelisted: true,
    transform: true,       // Transforma tipos automáticamente
  }));

  app.enableCors();
  app.setGlobalPrefix('api');

  await app.listen(3000);
  console.log('NestJS running on http://localhost:3000');
}

bootstrap();`} />

        <InfoBox type="nest" title="¿Express o NestJS?">
          <strong>Express</strong>: máxima flexibilidad, tú decides la arquitectura. Ideal si quieres control total.
          <strong> NestJS</strong>: arquitectura opinada, inyección de dependencias, decoradores. Ideal para equipos
          grandes y proyectos enterprise donde la consistencia es clave.
        </InfoBox>
      </section>
    </div>
  );
}
