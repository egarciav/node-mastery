import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function MocksSpiesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Mocks, Spies y Stubs</h1>
      <p className="text-text-muted text-lg mb-8">Controlar dependencias y verificar comportamiento en tests</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Conceptos clave</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Mock</h3>
            <p className="text-text-muted text-sm">Reemplazo completo de un módulo o función. Controlas qué retorna y verificas cómo se llamó.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-1">Spy</h3>
            <p className="text-text-muted text-sm">Envuelve una función real. La función se ejecuta normalmente pero puedes ver cómo se llamó.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-accent mb-1">Stub</h3>
            <p className="text-text-muted text-sm">Reemplazo que retorna un valor predefinido. No verifica llamadas, solo controla el output.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Mocks en Vitest</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un mock reemplaza una función con una versión controlada. Con <code className="text-primary">vi.fn()</code>
          creas funciones que puedes programar para retornar lo que quieras (valores síncronos, promesas,
          errores) y después verificar cómo fueron llamadas. Es la base del testing unitario:
        </p>

        <CodeBlock language="typescript" filename="Mockear funciones" code={`import { describe, it, expect, vi } from 'vitest';

// Crear una función mock
const mockFn = vi.fn();

// Mock que retorna un valor
const mockGetUser = vi.fn().mockReturnValue({ id: 1, name: 'Carlos' });

// Mock async
const mockFetch = vi.fn().mockResolvedValue({ data: [1, 2, 3] });

// Mock que lanza error
const mockError = vi.fn().mockRejectedValue(new Error('DB error'));

// Verificar llamadas
mockGetUser('123');
expect(mockGetUser).toHaveBeenCalled();
expect(mockGetUser).toHaveBeenCalledWith('123');
expect(mockGetUser).toHaveBeenCalledTimes(1);`} />

        <p className="text-text-muted leading-relaxed mb-4">
          <code className="text-primary">vi.mock()</code> reemplaza un módulo completo a nivel de import.
          Esto es crucial cuando tu código usa un servicio de email, una API externa, etc.
          El mock intercepta el import y retorna tu versión fake. Así puedes verificar que tu
          lógica de registro llama correctamente al servicio de email sin enviar emails reales:
        </p>

        <CodeBlock language="typescript" filename="Mockear módulos completos" code={`import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock del módulo de email
vi.mock('../services/emailService', () => ({
  sendEmail: vi.fn().mockResolvedValue({ success: true }),
  sendWelcomeEmail: vi.fn().mockResolvedValue(true),
}));

import { sendEmail, sendWelcomeEmail } from '../services/emailService';
import { registerUser } from '../services/authService';

describe('registerUser', () => {
  beforeEach(() => vi.clearAllMocks());

  it('should send welcome email after registration', async () => {
    const user = await registerUser({
      name: 'Ana',
      email: 'ana@test.com',
      password: 'Pass1234!',
    });

    // Verificar que se envió el email de bienvenida
    expect(sendWelcomeEmail).toHaveBeenCalledWith('ana@test.com', 'Ana');
    expect(sendWelcomeEmail).toHaveBeenCalledTimes(1);
  });
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Spies</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          A diferencia de un mock que reemplaza la función, un <strong className="text-text">spy</strong> la envuelve:
          la función real se ejecuta normalmente, pero puedes ver cómo fue llamada.
          También puedes opcionalmente override el valor de retorno. Útil cuando quieres verificar
          interacciones sin romper el comportamiento original:
        </p>

        <CodeBlock language="typescript" filename="Espiar funciones reales" code={`import { describe, it, expect, vi } from 'vitest';

const calculator = {
  add: (a: number, b: number) => a + b,
  multiply: (a: number, b: number) => a * b,
};

describe('Spies', () => {
  it('should spy on method without changing behavior', () => {
    const spy = vi.spyOn(calculator, 'add');

    const result = calculator.add(2, 3);

    expect(result).toBe(5);  // Función real se ejecutó
    expect(spy).toHaveBeenCalledWith(2, 3);  // Pero podemos verificar
    expect(spy).toHaveBeenCalledTimes(1);

    spy.mockRestore(); // Restaurar la función original
  });

  it('should spy and override return value', () => {
    const spy = vi.spyOn(calculator, 'multiply').mockReturnValue(999);

    const result = calculator.multiply(2, 3);

    expect(result).toBe(999);  // Valor override
    expect(spy).toHaveBeenCalledWith(2, 3);

    spy.mockRestore();
  });
});`} />

        <InfoBox type="tip" title="Regla de oro del mocking">
          <strong>Mockea lo que no controlas</strong> (BD, APIs externas, emails, sistema de archivos).
          <strong> No mockees lo que estás testeando</strong>. Si tienes que mockear demasiado, tu código
          probablemente tiene acoplamiento excesivo — es hora de refactorizar.
        </InfoBox>
      </section>
    </div>
  );
}
