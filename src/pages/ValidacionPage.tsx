import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function ValidacionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Validación de Datos</h1>
      <p className="text-text-muted text-lg mb-8">Validar input del usuario con Zod, Joi y middleware custom</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué validar?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <strong className="text-text">NUNCA confíes en el input del usuario.</strong> Todo dato que llega del cliente
          puede ser malicioso, incorrecto o inesperado. La validación previene: inyección SQL/NoSQL, datos corruptos
          en la BD, crashes del servidor, y vulnerabilidades de seguridad.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Zod — El estándar moderno (recomendado)</h2>

        <CodeBlock language="bash" code={`npm install zod`} />

        <CodeBlock language="javascript" filename="schemas/userSchema.js" code={`import { z } from 'zod';

// Definir schema de validación
export const createUserSchema = z.object({
  body: z.object({
    name: z.string()
      .min(2, 'El nombre debe tener al menos 2 caracteres')
      .max(50, 'El nombre no puede exceder 50 caracteres')
      .trim(),

    email: z.string()
      .email('Email inválido')
      .toLowerCase(),

    password: z.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .regex(/[A-Z]/, 'Debe contener al menos una mayúscula')
      .regex(/[0-9]/, 'Debe contener al menos un número'),

    age: z.number()
      .int('La edad debe ser un número entero')
      .min(18, 'Debes ser mayor de edad')
      .max(120)
      .optional(),

    role: z.enum(['user', 'admin', 'moderator'])
      .default('user'),
  })
});

export const updateUserSchema = z.object({
  body: z.object({
    name: z.string().min(2).max(50).trim().optional(),
    email: z.string().email().toLowerCase().optional(),
    age: z.number().int().min(18).max(120).optional(),
  })
});

// Schema para query params
export const listUsersSchema = z.object({
  query: z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(10),
    sort: z.string().optional(),
    search: z.string().optional(),
  })
});`} />

        <CodeBlock language="javascript" filename="middlewares/validate.js — Middleware de validación" code={`export function validate(schema) {
  return (req, res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const errors = result.error.issues.map(issue => ({
        field: issue.path.join('.'),
        message: issue.message,
      }));

      return res.status(422).json({
        status: 'error',
        message: 'Error de validación',
        errors,
      });
    }

    // Reemplazar con datos parseados (tipos correctos, defaults aplicados)
    req.body = result.data.body ?? req.body;
    req.query = result.data.query ?? req.query;
    req.params = result.data.params ?? req.params;
    next();
  };
}

// Uso en rutas:
// router.post('/users', validate(createUserSchema), createUser);`} />

        <InfoBox type="tip" title="¿Por qué Zod?">
          Zod es TypeScript-first: infiere tipos automáticamente desde los schemas.
          Es más moderno que Joi, más ligero, y funciona perfectamente con TypeScript.
          Un schema Zod es tanto validación runtime como definición de tipos.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Sanitización</h2>

        <CodeBlock language="javascript" filename="Sanitizar input" code={`import { z } from 'zod';

// Zod puede transformar datos al validar
const commentSchema = z.object({
  body: z.object({
    text: z.string()
      .trim()
      .min(1, 'El comentario no puede estar vacío')
      .max(1000)
      .transform(text => {
        // Escapar HTML para prevenir XSS
        return text
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
      }),
  })
});`} />

        <InfoBox type="warning" title="Regla de seguridad">
          <strong>Valida en el servidor SIEMPRE</strong>, incluso si ya validas en el frontend.
          La validación del frontend es para UX (feedback rápido al usuario).
          La validación del backend es para <strong>seguridad</strong> (un atacante puede saltarse el frontend).
        </InfoBox>
      </section>
    </div>
  );
}
