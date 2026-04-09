import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PostgreSQLPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">PostgreSQL y Prisma</h1>
      <p className="text-text-muted text-lg mb-8">Base de datos relacional con el ORM más moderno de Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué Prisma?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Prisma es un <strong className="text-text">ORM de nueva generación</strong> para Node.js y TypeScript.
          Ofrece schema declarativo, migraciones automáticas, cliente type-safe auto-generado, y una excelente
          experiencia de desarrollo. Soporta PostgreSQL, MySQL, SQLite, MongoDB y SQL Server.
        </p>

        <CodeBlock language="bash" filename="Setup de Prisma" code={`npm install prisma @prisma/client
npx prisma init

# Esto crea:
# prisma/schema.prisma  → Definición del schema
# .env                  → Variable DATABASE_URL`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Definir el Schema</h2>

        <CodeBlock language="javascript" filename="prisma/schema.prisma" code={`generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  name      String
  password  String
  role      Role     @default(USER)
  avatar    String?
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relaciones
  posts     Post[]
  comments  Comment[]
  profile   Profile?

  @@index([email])
  @@map("users") // Nombre de la tabla en la BD
}

model Post {
  id        Int      @id @default(autoincrement())
  title     String
  content   String
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // Relación: Un post pertenece a un usuario
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int

  comments  Comment[]
  tags      Tag[]

  @@map("posts")
}

model Comment {
  id        Int      @id @default(autoincrement())
  text      String
  createdAt DateTime @default(now())
  author    User     @relation(fields: [authorId], references: [id])
  authorId  Int
  post      Post     @relation(fields: [postId], references: [id], onDelete: Cascade)
  postId    Int

  @@map("comments")
}

model Profile {
  id     Int    @id @default(autoincrement())
  bio    String?
  website String?
  user   User   @relation(fields: [userId], references: [id])
  userId Int    @unique

  @@map("profiles")
}

model Tag {
  id    Int    @id @default(autoincrement())
  name  String @unique
  posts Post[]

  @@map("tags")
}

enum Role {
  USER
  ADMIN
  MODERATOR
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">CRUD con Prisma Client</h2>

        <CodeBlock language="javascript" filename="lib/prisma.js — Singleton" code={`import { PrismaClient } from '@prisma/client';

// Singleton para evitar múltiples conexiones en desarrollo
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

export default prisma;`} />

        <CodeBlock language="javascript" filename="Operaciones CRUD" code={`import prisma from '../lib/prisma.js';

// CREAR
const user = await prisma.user.create({
  data: { name: 'Carlos', email: 'c@mail.com', password: hashedPassword },
});

// LEER
const users = await prisma.user.findMany({
  where: { isActive: true },
  orderBy: { createdAt: 'desc' },
  skip: 0,
  take: 10,
  select: { id: true, name: true, email: true, role: true },
});

const user = await prisma.user.findUnique({ where: { email: 'c@mail.com' } });

// LEER CON RELACIONES
const userWithPosts = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: { where: { published: true }, orderBy: { createdAt: 'desc' } },
    profile: true,
  },
});

// ACTUALIZAR
const updated = await prisma.user.update({
  where: { id: 1 },
  data: { name: 'Carlos Updated' },
});

// ELIMINAR
await prisma.user.delete({ where: { id: 1 } });

// TRANSACCIÓN
const [post, notification] = await prisma.$transaction([
  prisma.post.create({ data: { title: 'Nuevo', content: '...', authorId: 1 } }),
  prisma.notification.create({ data: { userId: 1, message: 'Post creado' } }),
]);`} />

        <InfoBox type="tip" title="Migraciones">
          Después de cambiar el schema, ejecuta <code>npx prisma migrate dev --name descripcion</code> para
          crear y aplicar la migración. Usa <code>npx prisma generate</code> para regenerar el client.
          <code> npx prisma studio</code> abre una UI web para explorar tu BD.
        </InfoBox>
      </section>
    </div>
  );
}
