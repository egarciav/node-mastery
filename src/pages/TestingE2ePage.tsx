import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function TestingE2ePage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Testing E2E</h1>
      <p className="text-text-muted text-lg mb-8">Tests end-to-end que validan flujos completos del sistema</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es un test E2E?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los tests E2E simulan el <strong className="text-text">flujo completo de un usuario real</strong>:
          registrarse, hacer login, crear recursos, verificar que todo funciona de punta a punta.
          Son los más lentos y frágiles, pero validan que el sistema completo funciona correctamente.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">E2E con Supertest — Flujo completo</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Este test simula exactamente lo que haría un usuario real: registrarse, hacer login,
          acceder a rutas protegidas, crear contenido, y verificar que sin token se bloquea.
          Los tests se ejecutan <strong className="text-text">en orden secuencial</strong> — el token del paso 2
          se usa en el paso 3 y 4. La BD se limpia antes de cada suite para que los tests sean independientes:
        </p>

        <CodeBlock language="typescript" filename="tests/e2e/userFlow.test.ts" code={`import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import request from 'supertest';
import app from '../../src/app';
import { connectDB, disconnectDB, clearDB } from '../helpers/db';

describe('E2E: User Flow', () => {
  let token: string;
  let userId: string;

  beforeAll(async () => {
    await connectDB(); // Conectar BD de test
    await clearDB();   // Limpiar datos previos
  });

  afterAll(async () => {
    await disconnectDB();
  });

  it('1. Register a new user', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Carlos Test',
        email: 'carlos@test.com',
        password: 'SecurePass123!',
      })
      .expect(201);

    expect(res.body.status).toBe('success');
    expect(res.body.data.user).toHaveProperty('id');
    userId = res.body.data.user.id;
  });

  it('2. Login with the new user', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'carlos@test.com',
        password: 'SecurePass123!',
      })
      .expect(200);

    expect(res.body.data).toHaveProperty('token');
    token = res.body.data.token;
  });

  it('3. Access protected route with token', async () => {
    const res = await request(app)
      .get('/api/users/me')
      .set('Authorization', \`Bearer \${token}\`)
      .expect(200);

    expect(res.body.data.email).toBe('carlos@test.com');
  });

  it('4. Create a post', async () => {
    const res = await request(app)
      .post('/api/posts')
      .set('Authorization', \`Bearer \${token}\`)
      .send({ title: 'Mi primer post', content: 'Contenido de prueba' })
      .expect(201);

    expect(res.body.data.title).toBe('Mi primer post');
    expect(res.body.data.authorId).toBe(userId);
  });

  it('5. Reject access without token', async () => {
    await request(app)
      .get('/api/users/me')
      .expect(401);
  });
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Helpers para tests</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Centraliza la conexión y limpieza de la BD de tests en un helper reutilizable.
          <code className="text-primary">clearDB()</code> borra todos los documentos de todas las colecciones
          sin destruir la estructura. <code className="text-primary">disconnectDB()</code> elimina la BD completa
          al terminar — así no acumulas datos basura entre ejecuciones:
        </p>

        <CodeBlock language="typescript" filename="tests/helpers/db.ts" code={`import mongoose from 'mongoose';

const TEST_DB_URI = process.env.TEST_DATABASE_URL
  || 'mongodb://localhost:27017/mi-api-test';

export async function connectDB() {
  await mongoose.connect(TEST_DB_URI);
}

export async function disconnectDB() {
  await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
}

export async function clearDB() {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
}`} />

        <InfoBox type="warning" title="Cuántos tests E2E escribir">
          Sigue la <strong>pirámide de testing</strong>: muchos unit tests, algunos integration tests,
          y <strong>pocos E2E tests</strong> que cubran los flujos más críticos (registro, login, CRUD principal).
          Los E2E son lentos y caros de mantener — no intentes cubrir todo con ellos.
        </InfoBox>
      </section>
    </div>
  );
}
