import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function TestingIntroPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Introducción al Testing</h1>
      <p className="text-text-muted text-lg mb-8">Tipos de tests, herramientas y estrategia de testing en Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué testear?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los tests son <strong className="text-text">la red de seguridad de tu código</strong>. Previenen regresiones,
          documentan el comportamiento esperado, dan confianza para refactorizar, y atrapan bugs antes de que
          lleguen a producción. En proyectos profesionales, no hay excusa para no testear.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Pirámide de testing</h2>
        <div className="space-y-3 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-1">Unit Tests (base — muchos)</h3>
            <p className="text-text-muted text-sm">Prueban funciones individuales aisladas. Rápidos, baratos, sin dependencias externas. Ejemplo: validar que una función de hash funciona correctamente.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-1">Integration Tests (medio)</h3>
            <p className="text-text-muted text-sm">Prueban cómo interactúan varios componentes. Incluyen BD real o mock. Ejemplo: testear un endpoint completo con controller + service + BD.</p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-error mb-1">E2E Tests (tope — pocos)</h3>
            <p className="text-text-muted text-sm">Prueban el sistema completo de principio a fin. Lentos y frágiles. Ejemplo: crear usuario, hacer login, crear post, verificar que aparece.</p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Herramientas en 2026</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-muted">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text">Herramienta</th>
                <th className="text-left py-3 px-4">Uso</th>
                <th className="text-left py-3 px-4">Notas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-2 px-4 font-semibold text-node">Vitest</td><td className="py-2 px-4">Test runner + assertions</td><td className="py-2 px-4">Rápido, compatible con Jest API, ESM nativo. Recomendado.</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 font-semibold text-accent">Jest</td><td className="py-2 px-4">Test runner + assertions</td><td className="py-2 px-4">El más popular, pero más lento y problemas con ESM.</td></tr>
              <tr className="border-b border-border/50"><td className="py-2 px-4 font-semibold text-warning">Supertest</td><td className="py-2 px-4">HTTP testing</td><td className="py-2 px-4">Testear endpoints Express sin levantar servidor.</td></tr>
              <tr><td className="py-2 px-4 font-semibold text-ts">node:test</td><td className="py-2 px-4">Test runner nativo</td><td className="py-2 px-4">Built-in en Node.js 20+. Sin dependencias externas.</td></tr>
            </tbody>
          </table>
        </div>

        <CodeBlock language="bash" filename="Instalación" code={`# Vitest (recomendado)
npm install -D vitest

# Con supertest para tests de API
npm install -D supertest @types/supertest`} />

        <InfoBox type="tip" title="Vitest vs Jest">
          Vitest es más rápido que Jest, soporta ESM sin configuración, tiene HMR para tests,
          y es API-compatible con Jest (mismo describe/it/expect). Si empiezas un proyecto nuevo, usa Vitest.
        </InfoBox>
      </section>
    </div>
  );
}
