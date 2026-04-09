import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function TiposPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-ts mb-2">Tipos e Interfaces en Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Definir tipos para modelos, servicios, controladores y middlewares</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tipos para el dominio de la aplicación</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En una API profesional, defines tipos para todo: las <strong className="text-text">entidades</strong> (User, Product),
          los <strong className="text-text">DTOs</strong> (lo que entra y sale de la API), y las <strong className="text-text">respuestas</strong>.
          Centralizar tipos en un archivo <code className="text-primary">types/</code> evita duplicación y garantiza
          que toda la app hable el mismo idioma. Veamos un ejemplo completo:
        </p>

        <CodeBlock language="typescript" filename="types/index.ts" code={`// Entidades del dominio
export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type Role = 'user' | 'admin' | 'moderator';

// DTOs — Data Transfer Objects (lo que entra/sale de la API)
export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role?: Role;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface LoginDTO {
  email: string;
  password: string;
}

// Respuestas de la API
export interface ApiResponse<T = unknown> {
  status: 'success' | 'error';
  data?: T;
  message?: string;
  errors?: FieldError[];
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface FieldError {
  field: string;
  message: string;
}

// JWT Payload
export interface JwtPayload {
  userId: string;
  role: Role;
  iat: number;
  exp: number;
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Extender el objeto Request de Express</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando añades propiedades personalizadas a <code className="text-primary">req</code> (como <code className="text-primary">req.user</code>
          desde un middleware de autenticación), TypeScript no las conoce y marca error. La solución
          es usar <strong className="text-text">declaration merging</strong>: un archivo <code className="text-primary">.d.ts</code>
          que extiende la interfaz <code className="text-primary">Request</code> globalmente.
        </p>

        <CodeBlock language="typescript" filename="types/express.d.ts" code={`import { JwtPayload } from './index';

// Extender el tipo Request globalmente
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      requestId?: string;
    }
  }
}

// Ahora req.user está tipado en todos los middlewares y controllers
// Sin necesidad de castear`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Con la declaración global, ahora <code className="text-primary">req.user</code> está tipado automáticamente
          en todos los controllers y middlewares. Veamos cómo se usa en un middleware de autenticación real:
        </p>

        <CodeBlock language="typescript" filename="middlewares/auth.ts — Middleware tipado" code={`import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JwtPayload } from '../types/index.js';

export function authenticate(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ status: 'error', message: 'Token requerido' });
    return;
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
    req.user = decoded; // Tipado gracias a express.d.ts
    next();
  } catch {
    res.status(401).json({ status: 'error', message: 'Token inválido' });
  }
}`} />

        <InfoBox type="tip" title="Utility Types útiles">
          <code>Partial&lt;User&gt;</code> — Todos los campos opcionales (para updates).
          <code> Pick&lt;User, 'name' | 'email'&gt;</code> — Solo campos específicos.
          <code> Omit&lt;User, 'password'&gt;</code> — Todos excepto password.
          <code> Record&lt;string, unknown&gt;</code> — Objeto con claves string.
        </InfoBox>
      </section>
    </div>
  );
}
