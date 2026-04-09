import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PackageJsonPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">package.json a fondo</h1>
      <p className="text-text-muted text-lg mb-8">El archivo más importante de cualquier proyecto Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Anatomía completa de package.json</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cada campo tiene un propósito específico. Este ejemplo muestra un <code className="text-primary">package.json</code>
          profesional completo con scripts para desarrollo, testing, linting, base de datos y Docker.
          Estudiá cada sección para entender por qué está ahí:
        </p>

        <CodeBlock language="json" filename="package.json completo" code={`{
  "name": "mi-api",
  "version": "1.0.0",
  "description": "API REST profesional con Express y TypeScript",
  "main": "dist/server.js",
  "type": "module",
  "engines": {
    "node": ">=20.0.0"
  },
  "scripts": {
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "test": "vitest",
    "test:coverage": "vitest --coverage",
    "lint": "eslint src/",
    "lint:fix": "eslint src/ --fix",
    "format": "prettier --write src/",
    "db:migrate": "prisma migrate dev",
    "db:seed": "tsx prisma/seed.ts",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down"
  },
  "dependencies": {
    "express": "^4.21.0",
    "cors": "^2.8.5",
    "dotenv": "^16.4.0",
    "jsonwebtoken": "^9.0.2",
    "bcrypt": "^5.1.1",
    "zod": "^3.23.0",
    "prisma": "^5.20.0",
    "@prisma/client": "^5.20.0",
    "helmet": "^7.1.0",
    "morgan": "^1.10.0",
    "winston": "^3.14.0"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
    "tsx": "^4.19.0",
    "@types/node": "^22.0.0",
    "@types/express": "^4.17.21",
    "@types/cors": "^2.8.17",
    "@types/jsonwebtoken": "^9.0.7",
    "@types/bcrypt": "^5.0.2",
    "@types/morgan": "^1.9.9",
    "vitest": "^2.1.0",
    "eslint": "^9.0.0",
    "prettier": "^3.3.0",
    "supertest": "^7.0.0"
  },
  "keywords": ["api", "rest", "express", "typescript"],
  "author": "Tu Nombre <tu@email.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/tu-usuario/mi-api.git"
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Campos importantes explicados</h2>
        <div className="space-y-4">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">"type": "module"</h3>
            <p className="text-text-muted text-sm">
              Activa ES Modules en todos los archivos .js del proyecto. Sin esto, Node.js usa CommonJS por defecto.
              <strong className="text-text"> Recomendado para proyectos nuevos en 2026.</strong>
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">"engines"</h3>
            <p className="text-text-muted text-sm">
              Especifica la versión mínima de Node.js requerida. npm muestra un warning si el usuario tiene otra versión.
              Útil para evitar bugs por features no soportadas en versiones antiguas.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">"main" / "exports"</h3>
            <p className="text-text-muted text-sm">
              <code className="text-primary">"main"</code> define el punto de entrada del paquete.
              <code className="text-primary"> "exports"</code> (moderno) permite definir múltiples entry points
              y restringir qué archivos pueden importarse.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">El campo "exports" (moderno)</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El campo <code className="text-primary">"exports"</code> es la versión moderna de <code className="text-primary">"main"</code>.
          Permite definir múltiples puntos de entrada (para ESM y CJS), incluir tipos TypeScript,
          y <strong className="text-text">restringir qué archivos internos pueden importarse</strong> — todo lo no listado
          queda bloqueado:
        </p>

        <CodeBlock language="json" filename="Exports map" code={`{
  "name": "mi-libreria",
  "exports": {
    ".": {
      "import": "./dist/esm/index.js",
      "require": "./dist/cjs/index.js",
      "types": "./dist/types/index.d.ts"
    },
    "./utils": {
      "import": "./dist/esm/utils.js",
      "require": "./dist/cjs/utils.js"
    }
  }
}

// Uso:
// import { algo } from 'mi-libreria';        → usa "."
// import { util } from 'mi-libreria/utils';  → usa "./utils"
// import { x } from 'mi-libreria/internal';  → ERROR (no exportado)`} />

        <InfoBox type="info" title="¿Cuándo usar exports?">
          Usa <code>"exports"</code> si estás creando una librería que otros importarán. Para aplicaciones
          (APIs, servidores), <code>"main"</code> es suficiente. El campo <code>"exports"</code> es más seguro
          porque impide que usuarios importen archivos internos que podrías cambiar.
        </InfoBox>
      </section>
    </div>
  );
}
