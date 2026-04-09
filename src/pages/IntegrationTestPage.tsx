import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function IntegrationTestPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Integration Testing</h1>
      <p className="text-text-muted text-lg mb-8">Testear endpoints HTTP con Supertest y bases de datos de prueba</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Tests de API con Supertest</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          A diferencia de los unit tests que testean funciones aisladas, los <strong className="text-text">integration tests</strong>
          verifican que múltiples partes funcionan juntas: rutas, middlewares, validación, controladores y servicios.
          <code className="text-primary">Supertest</code> simula peticiones HTTP a tu app Express sin levantar un servidor real
          (importas <code className="text-primary">app</code>, no haces <code className="text-primary">.listen()</code>).
          Este ejemplo testea todo el flujo de autenticación, paginación, validación de datos y permisos:
        </p>

        <CodeBlock language="typescript" filename="tests/api/users.test.ts" code={`import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import request from 'supertest';
import app from '../../src/app'; // Importar app SIN iniciar servidor

describe('Users API', () => {
  let authToken: string;

  beforeAll(async () => {
    // Setup: crear usuario admin para tests
    await request(app)
      .post('/api/auth/register')
      .send({ name: 'Admin', email: 'admin@test.com', password: 'Admin123!' });

    const loginRes = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@test.com', password: 'Admin123!' });

    authToken = loginRes.body.data.token;
  });

  describe('GET /api/users', () => {
    it('should return list of users', async () => {
      const res = await request(app)
        .get('/api/users')
        .expect(200);

      expect(res.body.status).toBe('success');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.meta).toHaveProperty('total');
      expect(res.body.meta).toHaveProperty('page');
    });

    it('should support pagination', async () => {
      const res = await request(app)
        .get('/api/users?page=1&limit=5')
        .expect(200);

      expect(res.body.data.length).toBeLessThanOrEqual(5);
      expect(res.body.meta.limit).toBe(5);
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with valid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send({
          name: 'Test User',
          email: 'testuser@test.com',
          password: 'Test1234!',
        })
        .expect(201);

      expect(res.body.status).toBe('success');
      expect(res.body.data).toHaveProperty('id');
      expect(res.body.data.name).toBe('Test User');
      expect(res.body.data).not.toHaveProperty('password');
    });

    it('should return 422 for invalid data', async () => {
      const res = await request(app)
        .post('/api/users')
        .set('Authorization', \`Bearer \${authToken}\`)
        .send({ name: '', email: 'invalid' })
        .expect(422);

      expect(res.body.status).toBe('error');
      expect(res.body.errors).toBeDefined();
    });

    it('should return 401 without auth token', async () => {
      await request(app)
        .post('/api/users')
        .send({ name: 'Test', email: 'test@test.com', password: 'Pass1234!' })
        .expect(401);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return 404 for non-existent user', async () => {
      await request(app)
        .get('/api/users/nonexistent-id')
        .expect(404);
    });
  });
});`} />

        <InfoBox type="warning" title="Base de datos para tests">
          Usa una <strong>base de datos separada</strong> para tests. Nunca ejecutes tests contra la BD de
          desarrollo o producción. Limpia la BD antes de cada suite con <code>beforeEach</code> o
          <code> beforeAll</code>. Puedes usar Docker para levantar una BD temporal.
        </InfoBox>
      </section>
    </div>
  );
}
