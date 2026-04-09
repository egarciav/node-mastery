import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NpmPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">NPM — Node Package Manager</h1>
      <p className="text-text-muted text-lg mb-8">El ecosistema de paquetes más grande del mundo</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es NPM?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          NPM es tres cosas: un <strong className="text-text">registro online</strong> de paquetes (npmjs.com),
          una <strong className="text-text">herramienta CLI</strong> para instalar y gestionar paquetes, y un
          <strong className="text-text"> estándar</strong> para organizar proyectos JavaScript/Node.js.
          Con más de 2 millones de paquetes, es el registro de software más grande del mundo.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Comandos esenciales</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Estos son los comandos que usarás diariamente. La diferencia entre <code className="text-primary">-D</code>
          (devDependency) y sin flag (dependency) es crucial: las devDependencies no se instalan en producción.
          <code className="text-primary">npm audit</code> escanea vulnerabilidades conocidas en tus dependencias:
        </p>

        <CodeBlock language="bash" filename="Comandos npm más usados" code={`# Inicializar proyecto (crea package.json)
npm init -y

# Instalar dependencia de producción
npm install express         # o: npm i express
npm install mongoose dotenv # Múltiples a la vez

# Instalar dependencia de desarrollo
npm install -D nodemon eslint prettier
npm install --save-dev jest

# Instalar globalmente (disponible en toda la máquina)
npm install -g typescript ts-node

# Desinstalar paquete
npm uninstall express       # o: npm rm express

# Instalar todas las dependencias de package.json
npm install                 # o: npm i

# Actualizar paquetes
npm update                  # Actualizar dentro de rangos semver
npm outdated                # Ver paquetes desactualizados

# Ver paquetes instalados
npm list                    # Árbol completo
npm list --depth=0          # Solo nivel raíz

# Info de un paquete
npm info express            # Detalles del paquete
npm view express versions   # Todas las versiones disponibles

# Buscar vulnerabilidades
npm audit
npm audit fix               # Intentar arreglar automáticamente`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Dependencias vs DevDependencies</h2>
        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">dependencies</h3>
            <p className="text-text-muted text-sm">
              Paquetes necesarios para que la aplicación <strong className="text-text">funcione en producción</strong>.
              Se instalan con <code className="text-primary">npm install paquete</code>.
              Ejemplos: express, mongoose, jsonwebtoken, bcrypt.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-2">devDependencies</h3>
            <p className="text-text-muted text-sm">
              Paquetes solo necesarios para <strong className="text-text">desarrollo y testing</strong>.
              Se instalan con <code className="text-primary">npm install -D paquete</code>.
              No se incluyen en producción. Ejemplos: jest, eslint, prettier, nodemon, typescript.
            </p>
          </div>
        </div>

        <CodeBlock language="bash" filename="Instalar solo producción (deploy)" code={`# En producción, instala solo dependencies (no devDependencies)
npm install --production
# o con variable de entorno
NODE_ENV=production npm install`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Semver — Versionado Semántico</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Todos los paquetes npm usan <strong className="text-text">Semver</strong> (Semantic Versioning): <code className="text-primary">MAJOR.MINOR.PATCH</code>
        </p>

        <CodeBlock language="bash" filename="Entender versiones" code={`# Formato: MAJOR.MINOR.PATCH
# Ejemplo: 4.18.2

# MAJOR (4) — Cambios INCOMPATIBLES (breaking changes)
# MINOR (18) — Nueva funcionalidad, compatible hacia atrás
# PATCH (2) — Corrección de bugs, compatible hacia atrás

# Rangos en package.json:
"express": "^4.18.2"   # ^ = Permite MINOR y PATCH (4.x.x)
"express": "~4.18.2"   # ~ = Solo permite PATCH (4.18.x)
"express": "4.18.2"    # Exactamente esta versión
"express": ">=4.18.0"  # 4.18.0 o superior
"express": "*"          # Cualquier versión (NO recomendado)`} />

        <InfoBox type="tip" title="Recomendación">
          Usa <code>^</code> (caret, el default) para la mayoría de paquetes. Permite actualizaciones
          menores y parches automáticamente. Usa versiones exactas solo si un paquete tiene historial
          de breaking changes en minor versions.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">package-lock.json</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El <code className="text-primary">package-lock.json</code> es generado automáticamente y registra las
          <strong className="text-text"> versiones exactas</strong> de cada dependencia y sus sub-dependencias. Garantiza
          que todos los desarrolladores y el servidor de producción instalen exactamente las mismas versiones.
        </p>

        <InfoBox type="warning" title="Reglas del lock file">
          <strong>SIEMPRE</strong> commitea <code>package-lock.json</code> a Git.
          <strong> NUNCA</strong> lo edites manualmente. Si hay conflictos de merge, borra el lock file
          y ejecuta <code>npm install</code> para regenerarlo.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Alternativas a npm</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-text-muted">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-4 text-text">Gestor</th>
                <th className="text-left py-3 px-4">Velocidad</th>
                <th className="text-left py-3 px-4">Espacio disco</th>
                <th className="text-left py-3 px-4">Notas</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50"><td className="py-3 px-4 font-semibold text-node">npm</td><td className="py-3 px-4">Normal</td><td className="py-3 px-4">Normal</td><td className="py-3 px-4">Viene con Node.js. El estándar.</td></tr>
              <tr className="border-b border-border/50"><td className="py-3 px-4 font-semibold text-accent">yarn</td><td className="py-3 px-4">Rápido</td><td className="py-3 px-4">Normal</td><td className="py-3 px-4">Plug'n'Play en v3+. Workspaces.</td></tr>
              <tr><td className="py-3 px-4 font-semibold text-warning">pnpm</td><td className="py-3 px-4">Muy rápido</td><td className="py-3 px-4">Mínimo</td><td className="py-3 px-4">Content-addressable store. Ahorra disco.</td></tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
