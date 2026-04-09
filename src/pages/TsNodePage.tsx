import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function TsNodePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-ts mb-2">TypeScript con Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Configuración, tipado y mejores prácticas para backend con TypeScript</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué TypeScript en Node.js?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          TypeScript añade <strong className="text-text">tipado estático</strong> a JavaScript, detectando errores
          en tiempo de compilación en vez de en producción. En 2026, es el estándar de facto para proyectos
          Node.js profesionales. Mejora la documentación, el autocompletado y la mantenibilidad del código.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Setup de un proyecto Node.js + TypeScript</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Configurar TypeScript en Node.js requiere tres cosas: el compilador (<code className="text-primary">typescript</code>),
          los tipos del runtime (<code className="text-primary">@types/node</code>), y un ejecutor rápido para desarrollo
          (<code className="text-primary">tsx</code>). Veamos cómo inicializar un proyecto desde cero:
        </p>

        <CodeBlock language="bash" filename="Instalación" code={`mkdir mi-api && cd mi-api
npm init -y

# TypeScript y tipos de Node
npm install -D typescript @types/node tsx

# Configurar TypeScript
npx tsc --init`} />

        <p className="text-text-muted leading-relaxed mb-4">
          El archivo <code className="text-primary">tsconfig.json</code> controla cómo TypeScript compila tu código.
          Cada opción tiene un propósito específico — aquí las más importantes para backend:
        </p>

        <CodeBlock language="json" filename="tsconfig.json — Configuración recomendada" code={`{
  "compilerOptions": {
    "target": "ES2022",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Necesitas scripts para desarrollo (con recarga automática), compilación, ejecución en producción,
          y verificación de tipos. El campo <code className="text-primary">"type": "module"</code> activa ESM nativo:
        </p>

        <CodeBlock language="json" filename="package.json scripts" code={`{
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "typecheck": "tsc --noEmit"
  }
}`} />

        <InfoBox type="tip" title="tsx vs ts-node">
          <code>tsx</code> es más rápido que <code>ts-node</code> porque usa esbuild internamente.
          Soporta ESM nativamente sin configuración extra. Es la opción recomendada en 2026
          para desarrollo con Node.js + TypeScript.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tipos esenciales para Express</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Express no viene con tipos — necesitas instalar <code className="text-primary">@types/express</code> por separado.
          Una vez instalado, puedes tipar los <strong className="text-text">parámetros de ruta</strong>, el <strong className="text-text">body</strong>,
          los <strong className="text-text">query params</strong> y la <strong className="text-text">respuesta</strong> de cada endpoint.
          Esto te da autocompletado y detecta errores antes de ejecutar.
        </p>

        <CodeBlock language="bash" code={`npm install express
npm install -D @types/express`} />

        <CodeBlock language="typescript" filename="src/server.ts" code={`import express, { Request, Response, NextFunction } from 'express';

const app = express();
app.use(express.json());

// Tipar parámetros de ruta
interface UserParams {
  id: string;
}

// Tipar body del request
interface CreateUserBody {
  name: string;
  email: string;
  password: string;
}

// Tipar query params
interface ListUsersQuery {
  page?: string;
  limit?: string;
  search?: string;
}

// Tipar respuesta
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
}

// Ruta tipada
app.get('/api/users/:id', (
  req: Request<UserParams>,
  res: Response<ApiResponse<{ id: string; name: string }>>
) => {
  const { id } = req.params; // id es string (tipado)
  res.json({ status: 'success', data: { id, name: 'Carlos' } });
});

app.post('/api/users', (
  req: Request<{}, {}, CreateUserBody>,
  res: Response<ApiResponse<{ id: number }>>
) => {
  const { name, email } = req.body; // tipados
  res.status(201).json({ status: 'success', data: { id: 1 } });
});

app.get('/api/users', (
  req: Request<{}, {}, {}, ListUsersQuery>,
  res: Response
) => {
  const page = parseInt(req.query.page ?? '1', 10);
  res.json({ status: 'success', data: [] });
});

app.listen(3000, () => console.log('Server running on port 3000'));`} />
      </section>
    </div>
  );
}
