import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function UnitTestPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Unit Testing con Vitest</h1>
      <p className="text-text-muted text-lg mb-8">Escribir tests unitarios profesionales para funciones y servicios</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Estructura básica de un test</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Primero necesitas código que testear. Estas son funciones puras — sin dependencias externas,
          sin estado compartido — que son las más fáciles de testear porque dado el mismo input
          siempre producen el mismo output:
        </p>

        <CodeBlock language="typescript" filename="utils/math.ts" code={`export function sum(a: number, b: number): number {
  return a + b;
}

export function isValidEmail(email: string): boolean {
  return /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\\w\\s-]/g, '')
    .replace(/[\\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Un test unitario verifica que <strong className="text-text">una función específica produce el resultado esperado</strong>.
          <code className="text-primary">describe</code> agrupa tests relacionados, <code className="text-primary">it</code> define
          un caso individual, y <code className="text-primary">expect</code> verifica el resultado.
          Nota cómo cada test cubre un escenario diferente: valores positivos, negativos, edge cases:
        </p>

        <CodeBlock language="typescript" filename="utils/__tests__/math.test.ts" code={`import { describe, it, expect } from 'vitest';
import { sum, isValidEmail, slugify } from '../math';

describe('sum', () => {
  it('should add two positive numbers', () => {
    expect(sum(2, 3)).toBe(5);
  });

  it('should handle negative numbers', () => {
    expect(sum(-1, -2)).toBe(-3);
  });

  it('should handle zero', () => {
    expect(sum(0, 5)).toBe(5);
  });
});

describe('isValidEmail', () => {
  it('should return true for valid emails', () => {
    expect(isValidEmail('user@example.com')).toBe(true);
    expect(isValidEmail('test.user@domain.co')).toBe(true);
  });

  it('should return false for invalid emails', () => {
    expect(isValidEmail('')).toBe(false);
    expect(isValidEmail('invalid')).toBe(false);
    expect(isValidEmail('@domain.com')).toBe(false);
    expect(isValidEmail('user@')).toBe(false);
  });
});

describe('slugify', () => {
  it('should convert text to slug', () => {
    expect(slugify('Hello World')).toBe('hello-world');
    expect(slugify('  Spaces  ')).toBe('spaces');
    expect(slugify('Special @#$ Chars')).toBe('special-chars');
  });
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Mocking</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Cuando tu código depende de una base de datos, <strong className="text-text">no quieres conectarte a una BD real</strong>
          en cada test. Los <strong className="text-text">mocks</strong> reemplazan esas dependencias con versiones
          controladas. <code className="text-primary">vi.mock()</code> intercepta el <code className="text-primary">import</code>
          de un módulo y lo reemplaza con tu versión fake. Así testeas la lógica de tu service sin BD:
        </p>

        <CodeBlock language="typescript" filename="Mocking de dependencias" code={`import { describe, it, expect, vi, beforeEach } from 'vitest';
import { UserService } from '../services/userService';

// Mock del módulo completo
vi.mock('../models/User', () => ({
  default: {
    findById: vi.fn(),
    create: vi.fn(),
    findByIdAndUpdate: vi.fn(),
  },
}));

import User from '../models/User';

describe('UserService', () => {
  const service = new UserService();

  beforeEach(() => {
    vi.clearAllMocks(); // Limpiar mocks entre tests
  });

  describe('findById', () => {
    it('should return user when found', async () => {
      const mockUser = { _id: '123', name: 'Carlos', email: 'c@mail.com' };
      vi.mocked(User.findById).mockResolvedValue(mockUser);

      const result = await service.findById('123');

      expect(User.findById).toHaveBeenCalledWith('123');
      expect(result).toEqual(mockUser);
    });

    it('should return null when user not found', async () => {
      vi.mocked(User.findById).mockResolvedValue(null);

      const result = await service.findById('999');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create and return new user', async () => {
      const input = { name: 'Ana', email: 'ana@mail.com', password: 'pass123' };
      const mockCreated = { _id: '456', ...input };
      vi.mocked(User.create).mockResolvedValue(mockCreated);

      const result = await service.create(input);

      expect(User.create).toHaveBeenCalledWith(input);
      expect(result).toEqual(mockCreated);
    });
  });
});`} />

        <InfoBox type="tip" title="¿Qué mockear?">
          Mockea <strong>dependencias externas</strong>: base de datos, APIs externas, servicios de email,
          el sistema de archivos. <strong>No mockees</strong> la lógica que estás testeando — eso anula el propósito del test.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Configuración y ejecución</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Vitest se configura en <code className="text-primary">vitest.config.ts</code>. Con <code className="text-primary">globals: true</code>
          no necesitas importar <code className="text-primary">describe/it/expect</code> en cada archivo.
          La cobertura (<code className="text-primary">coverage</code>) te dice qué porcentaje de tu código está cubierto por tests:
        </p>

        <CodeBlock language="typescript" filename="vitest.config.ts" code={`import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,           // describe, it, expect sin importar
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['node_modules/', 'dist/', '**/*.test.ts'],
    },
  },
});`} />

        <CodeBlock language="bash" filename="Ejecutar tests" code={`npx vitest              # Watch mode (re-ejecuta al cambiar)
npx vitest run          # Ejecutar una vez
npx vitest --coverage   # Con reporte de cobertura
npx vitest run math     # Solo tests que coincidan con "math"`} />
      </section>
    </div>
  );
}
