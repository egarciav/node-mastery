import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function BuiltInTestPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Node.js Test Runner Nativo</h1>
      <p className="text-text-muted text-lg mb-8">Testear sin dependencias externas usando node:test</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">node:test — Built-in desde Node 20</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js incluye un test runner nativo en el módulo <code>node:test</code>. No necesitas instalar
          Jest, Vitest ni ningún otro framework. Ideal para librerías o proyectos donde quieres cero dependencias de testing.
        </p>

        <p className="text-text-muted leading-relaxed mb-4">
          La API es similar a Vitest/Jest: <code className="text-primary">describe</code> para agrupar,
          <code className="text-primary"> it</code> para cada caso, pero usa <code className="text-primary">node:assert</code>
          en vez de <code className="text-primary">expect</code>. La ventaja: al ser built-in, no hay dependencias
          que instalar, no hay versiones que mantener, y se ejecuta instantáneamente:
        </p>

        <CodeBlock language="typescript" filename="math.test.ts" code={`import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { sum, multiply } from './math.js';

describe('Math utils', () => {
  it('should add two numbers', () => {
    assert.strictEqual(sum(2, 3), 5);
  });

  it('should multiply two numbers', () => {
    assert.strictEqual(multiply(3, 4), 12);
  });

  it('should handle negative numbers', () => {
    assert.strictEqual(sum(-1, -2), -3);
  });
});

// Async test
describe('Async operations', () => {
  it('should fetch data', async () => {
    const response = await fetch('https://jsonplaceholder.typicode.com/todos/1');
    const data = await response.json();
    assert.ok(data.id);
    assert.strictEqual(data.id, 1);
  });
});`} />

        <CodeBlock language="bash" filename="Ejecutar tests" code={`# Ejecutar un archivo
node --test math.test.ts

# Ejecutar todos los tests (glob pattern)
node --test **/*.test.ts

# Con watch mode
node --test --watch

# Con reporte TAP
node --test --test-reporter tap`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Mocking nativo</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El test runner nativo también incluye <strong className="text-text">mocking</strong> sin librerías externas.
          <code className="text-primary">mock.fn()</code> crea funciones espiás que registran llamadas y argumentos.
          <code className="text-primary"> mock.timers</code> controla setTimeout/setInterval para tests predecibles
          sin esperar tiempo real:
        </p>

        <CodeBlock language="typescript" filename="Mocks con node:test" code={`import { describe, it, mock } from 'node:test';
import assert from 'node:assert/strict';

describe('Mocking', () => {
  it('should mock a function', () => {
    const fn = mock.fn((a: number, b: number) => a + b);

    assert.strictEqual(fn(2, 3), 5);
    assert.strictEqual(fn.mock.callCount(), 1);
    assert.deepStrictEqual(fn.mock.calls[0].arguments, [2, 3]);
  });

  it('should mock timers', () => {
    mock.timers.enable({ apis: ['setTimeout'] });

    let called = false;
    setTimeout(() => { called = true; }, 1000);

    mock.timers.tick(1000);
    assert.strictEqual(called, true);

    mock.timers.reset();
  });
});`} />

        <InfoBox type="tip" title="¿node:test o Vitest?">
          <strong>node:test</strong>: cero dependencias, ideal para librerías y scripts simples.
          <strong> Vitest</strong>: más features (snapshots, coverage, UI), mejor DX, ideal para aplicaciones.
          Ambos son opciones válidas — elige según tu caso de uso.
        </InfoBox>
      </section>
    </div>
  );
}
