import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function MigracionesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Migraciones y Seeds</h1>
      <p className="text-text-muted text-lg mb-8">Gestionar cambios en el schema de la base de datos</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué son las migraciones?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Las migraciones son <strong className="text-text">archivos que describen cambios en la estructura de la BD</strong>.
          Son como un "control de versiones" para tu base de datos. Permiten aplicar y revertir cambios de forma
          reproducible en cualquier entorno (desarrollo, staging, producción).
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Migraciones con Prisma</h2>

        <CodeBlock language="bash" filename="Comandos de migración" code={`# Crear y aplicar migración en desarrollo
npx prisma migrate dev --name add_user_table

# Aplicar migraciones pendientes en producción
npx prisma migrate deploy

# Ver estado de migraciones
npx prisma migrate status

# Reset completo (PELIGRO: borra todos los datos)
npx prisma migrate reset

# Generar cliente después de cambios en schema
npx prisma generate

# Abrir interfaz visual de la BD
npx prisma studio`} />

        <CodeBlock language="bash" filename="Flujo de trabajo" code={`# 1. Modificar prisma/schema.prisma
# 2. Crear migración
npx prisma migrate dev --name descripcion_del_cambio

# Esto crea un archivo SQL en prisma/migrations/
# que se puede commitear a Git

# 3. En producción:
npx prisma migrate deploy`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Seeds — Datos iniciales</h2>

        <CodeBlock language="javascript" filename="prisma/seed.js" code={`import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Limpiar datos existentes
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.user.deleteMany();

  // Crear admin
  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@app.com',
      password: await bcrypt.hash('admin123', 12),
      role: 'ADMIN',
    },
  });

  // Crear usuarios de prueba
  const users = await Promise.all(
    Array.from({ length: 10 }, (_, i) =>
      prisma.user.create({
        data: {
          name: \`Usuario \${i + 1}\`,
          email: \`user\${i + 1}@test.com\`,
          password: await bcrypt.hash('password123', 12),
          role: 'USER',
        },
      })
    )
  );

  // Crear posts de ejemplo
  await prisma.post.createMany({
    data: users.slice(0, 5).map((user, i) => ({
      title: \`Post de ejemplo \${i + 1}\`,
      content: \`Contenido del post \${i + 1}\`,
      published: true,
      authorId: user.id,
    })),
  });

  console.log('Seed completado');
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());`} />

        <CodeBlock language="json" filename="package.json" code={`{
  "prisma": {
    "seed": "node prisma/seed.js"
  }
}

// Ejecutar: npx prisma db seed`} />

        <InfoBox type="warning" title="Seeds en producción">
          Los seeds son para <strong>desarrollo y testing</strong>. Nunca ejecutes seeds destructivos en producción.
          Para datos iniciales en producción (roles, categorías), usa migraciones con INSERT SQL.
        </InfoBox>
      </section>
    </div>
  );
}
