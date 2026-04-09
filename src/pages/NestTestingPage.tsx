import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestTestingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Testing en NestJS</h1>
      <p className="text-text-muted text-lg mb-8">Tests unitarios e integración con el Testing Module de Nest</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Unit Test de un Service</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          NestJS proporciona <code className="text-primary">Test.createTestingModule()</code> para crear un módulo
          aislado de testing. La clave: en vez de inyectar el <code className="text-primary">PrismaService</code> real
          (que necesitaría una BD), le pasas un <strong className="text-text">mock</strong> con las mismas funciones
          pero controladas por ti. Así testeas la lógica del service sin dependencias externas:
        </p>

        <CodeBlock language="typescript" filename="users/users.service.spec.ts" code={`import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: {
            user: {
              findUnique: jest.fn(),
              findMany: jest.fn(),
              create: jest.fn(),
              update: jest.fn(),
              delete: jest.fn(),
              count: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const mockUser = { id: '1', name: 'Carlos', email: 'c@mail.com' };
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(mockUser as any);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">E2E Test de un Controller</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los tests E2E importan el <code className="text-primary">AppModule</code> completo y levantan una instancia
          real de la app NestJS. Con <code className="text-primary">supertest</code> haces peticiones HTTP reales
          y verificas respuestas. Estos tests validan que controllers, services, pipes y guards
          funcionan juntos correctamente — como lo haría un usuario real:
        </p>

        <CodeBlock language="typescript" filename="test/users.e2e-spec.ts" code={`import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('UsersController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('GET /users should return array', () => {
    return request(app.getHttpServer())
      .get('/api/users')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body.data)).toBe(true);
      });
  });

  it('POST /users with invalid data should return 400', () => {
    return request(app.getHttpServer())
      .post('/api/users')
      .send({ name: '' })
      .expect(400);
  });
});`} />

        <InfoBox type="nest" title="Testing Module">
          NestJS proporciona <code>Test.createTestingModule()</code> que crea un módulo aislado
          donde puedes reemplazar providers con mocks. Esto hace que los unit tests sean rápidos
          y no necesiten una BD real.
        </InfoBox>
      </section>
    </div>
  );
}
