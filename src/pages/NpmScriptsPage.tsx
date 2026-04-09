import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NpmScriptsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">NPM Scripts</h1>
      <p className="text-text-muted text-lg mb-8">Automatizar tareas con scripts de npm</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué son los npm scripts?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los npm scripts son comandos definidos en <code className="text-primary">package.json</code> que puedes
          ejecutar con <code className="text-primary">npm run nombre</code>. Son la forma estándar de automatizar
          tareas como iniciar el servidor, ejecutar tests, compilar, lint, deploy, etc.
        </p>

        <CodeBlock language="json" filename="Scripts comunes en un proyecto profesional" code={`{
  "scripts": {
    "start": "node dist/server.js",
    "dev": "tsx watch src/server.ts",
    "build": "tsc && tsc-alias",
    "test": "vitest",
    "test:watch": "vitest --watch",
    "test:coverage": "vitest --coverage",
    "test:e2e": "vitest --config vitest.e2e.config.ts",
    "lint": "eslint src/ --ext .ts",
    "lint:fix": "eslint src/ --ext .ts --fix",
    "format": "prettier --write 'src/**/*.ts'",
    "format:check": "prettier --check 'src/**/*.ts'",
    "typecheck": "tsc --noEmit",
    "db:migrate": "prisma migrate dev",
    "db:generate": "prisma generate",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "docker:up": "docker compose up -d",
    "docker:down": "docker compose down -v",
    "clean": "rimraf dist coverage",
    "prestart": "npm run build",
    "prepare": "husky"
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Ejecutar scripts</h2>

        <CodeBlock language="bash" filename="Comandos" code={`# Scripts con nombre reservado (no necesitan "run")
npm start       # Ejecuta "start"
npm test        # Ejecuta "test"  (alias: npm t)

# Scripts personalizados (necesitan "run")
npm run dev
npm run build
npm run lint:fix
npm run db:migrate

# Pasar argumentos al script
npm test -- --watch          # Pasa --watch al comando de test
npm run dev -- --port 4000   # Pasa --port 4000 al script dev`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Pre y Post hooks</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          NPM ejecuta automáticamente scripts con prefijo <code className="text-primary">pre</code> y
          <code className="text-primary"> post</code> antes y después de un script:
        </p>

        <CodeBlock language="json" filename="Hooks automáticos" code={`{
  "scripts": {
    "prebuild": "npm run clean",
    "build": "tsc",
    "postbuild": "echo 'Build completado!'",

    "pretest": "npm run lint",
    "test": "vitest",

    "prestart": "npm run build",
    "start": "node dist/server.js",

    "prepare": "husky"
  }
}

// Al ejecutar "npm run build":
// 1. Ejecuta "prebuild" → npm run clean
// 2. Ejecuta "build" → tsc
// 3. Ejecuta "postbuild" → echo 'Build completado!'

// "prepare" es especial: se ejecuta automáticamente después de npm install`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">npx — Ejecutar sin instalar</h2>

        <CodeBlock language="bash" filename="npx" code={`# npx ejecuta un paquete sin instalarlo globalmente
npx create-express-app mi-api
npx prisma init
npx eslint --init
npx tsx script.ts
npx ts-node archivo.ts

# También ejecuta binarios de node_modules/.bin/
# Cuando instalas un paquete con binario (ej: eslint),
# npx lo encuentra automáticamente
npx eslint src/       # Ejecuta ./node_modules/.bin/eslint`} />

        <InfoBox type="tip" title="npx vs npm install -g">
          Prefiere <code>npx</code> sobre instalar globalmente. Con npx siempre usas la versión más
          reciente, no contaminas tu sistema con paquetes globales, y otros desarrolladores no necesitan
          instalar nada extra.
        </InfoBox>
      </section>
    </div>
  );
}
