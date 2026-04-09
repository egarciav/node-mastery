import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function InstalacionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Instalación y Setup</h1>
      <p className="text-text-muted text-lg mb-8">Cómo instalar Node.js correctamente y configurar tu entorno de desarrollo</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Opciones de instalación</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Hay varias formas de instalar Node.js. La <strong className="text-text">recomendada</strong> es usar un
          <strong className="text-text"> version manager</strong> (nvm) porque te permite tener múltiples versiones
          instaladas y cambiar entre ellas fácilmente.
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Opción 1: nvm (Recomendada)</h3>
            <p className="text-text-muted text-sm">
              <strong className="text-text">nvm</strong> (Node Version Manager) te permite instalar y cambiar entre
              múltiples versiones de Node.js. Ideal para desarrollo profesional donde diferentes proyectos pueden
              requerir diferentes versiones.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Opción 2: Instalador oficial</h3>
            <p className="text-text-muted text-sm">
              Descarga desde <strong className="text-text">nodejs.org</strong>. Simple pero solo permite una versión
              a la vez. Adecuado si estás empezando.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-node mb-2">Opción 3: fnm (Fast Node Manager)</h3>
            <p className="text-text-muted text-sm">
              Alternativa más rápida a nvm, escrita en Rust. Compatible multiplataforma y muy veloz.
            </p>
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Instalar con nvm</h2>

        <CodeBlock language="bash" filename="Linux / macOS" code={`# Instalar nvm
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.0/install.sh | bash

# Reiniciar terminal o cargar nvm
source ~/.bashrc   # o ~/.zshrc si usas zsh

# Verificar instalación
nvm --version

# Instalar la última versión LTS de Node.js
nvm install --lts

# Instalar una versión específica
nvm install 22

# Ver versiones instaladas
nvm ls

# Cambiar a una versión específica
nvm use 22

# Establecer versión por defecto
nvm alias default 22`} />

        <CodeBlock language="bash" filename="Windows (nvm-windows)" code={`# Descargar nvm-windows desde:
# https://github.com/coreybutler/nvm-windows/releases

# Después de instalar, abrir PowerShell como admin:

# Instalar la última versión LTS
nvm install lts

# Instalar versión específica
nvm install 22.0.0

# Listar versiones instaladas
nvm list

# Usar una versión específica
nvm use 22.0.0`} />

        <InfoBox type="tip" title="fnm como alternativa">
          Si prefieres algo más rápido: <code>winget install Schniz.fnm</code> (Windows) o
          <code> brew install fnm</code> (macOS). fnm es compatible con archivos <code>.nvmrc</code> y
          <code> .node-version</code>.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Verificar la instalación</h2>

        <CodeBlock language="bash" filename="Verificar Node.js y npm" code={`# Versión de Node.js
node --version
# v22.x.x

# Versión de npm (viene incluido con Node.js)
npm --version
# 10.x.x

# Ejecutar JavaScript directamente
node -e "console.log('Node.js funciona!')"

# Abrir REPL interactivo (Read-Eval-Print Loop)
node
# > 2 + 2
# 4
# > 'Hola'.toUpperCase()
# 'HOLA'
# > .exit`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Versiones LTS vs Current</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Node.js tiene dos líneas de versiones simultáneas:
        </p>

        <div className="space-y-4 mb-6">
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-success mb-2">LTS (Long Term Support)</h3>
            <p className="text-text-muted text-sm">
              Versiones <strong className="text-text">pares</strong> (20, 22, 24...). Reciben soporte y parches de
              seguridad por <strong className="text-text">30 meses</strong>. Usa estas en producción.
              En 2026: <strong className="text-text">Node 22 LTS</strong> es la versión recomendada.
            </p>
          </div>
          <div className="bg-surface-light border border-border rounded-xl p-4">
            <h3 className="font-semibold text-warning mb-2">Current</h3>
            <p className="text-text-muted text-sm">
              Versiones <strong className="text-text">impares</strong> (21, 23...). Tienen las últimas features
              pero solo 6 meses de soporte. Úsalas para experimentar, no en producción.
            </p>
          </div>
        </div>

        <CodeBlock language="bash" filename="Ciclo de versiones" code={`# Esquema de release de Node.js:
# Abril: Sale nueva versión Current (impar, ej: 23)
# Octubre: La versión par anterior pasa a LTS (ej: 22 → LTS)

# En 2026:
# Node 22 → LTS (recomendada para producción)
# Node 23 → Current (features nuevas, experimental)
# Node 24 → Próximo LTS (sale Oct 2025)

# Archivo .nvmrc para fijar versión en tu proyecto
echo "22" > .nvmrc
# Ahora 'nvm use' en este directorio usa Node 22 automáticamente`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Estructura de un proyecto Node.js</h2>

        <CodeBlock language="bash" filename="Crear tu primer proyecto" code={`# Crear directorio del proyecto
mkdir mi-proyecto
cd mi-proyecto

# Inicializar proyecto (crea package.json)
npm init -y

# Esto crea:
# mi-proyecto/
# └── package.json`} />

        <CodeBlock language="json" filename="package.json generado" code={`{
  "name": "mi-proyecto",
  "version": "1.0.0",
  "description": "",
  "main": "index.js",
  "scripts": {
    "test": "echo \\"Error: no test specified\\" && exit 1",
    "start": "node index.js",
    "dev": "node --watch index.js"
  },
  "keywords": [],
  "author": "",
  "license": "ISC"
}`} />

        <CodeBlock language="javascript" filename="index.js" code={`// Tu punto de entrada
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('¡Hola desde Node.js!');
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(\`Servidor corriendo en http://localhost:\${PORT}\`);
});`} />

        <CodeBlock language="bash" filename="Ejecutar" code={`# Ejecutar el servidor
node index.js
# Servidor corriendo en http://localhost:3000

# Con --watch (Node 18+): reinicia automáticamente al guardar cambios
node --watch index.js`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">IDEs y herramientas recomendadas</h2>
        <div className="bg-surface-light border border-border rounded-xl p-4 mb-4">
          <ul className="space-y-3 text-text-muted text-sm">
            <li>• <strong className="text-text">VS Code</strong> — El IDE más popular para Node.js. Extensiones recomendadas: ESLint, Prettier, Thunder Client, REST Client, GitLens.</li>
            <li>• <strong className="text-text">WebStorm</strong> — IDE de JetBrains con soporte nativo para Node.js, debugging, y testing integrado.</li>
            <li>• <strong className="text-text">Postman / Insomnia / Thunder Client</strong> — Para probar APIs REST.</li>
            <li>• <strong className="text-text">MongoDB Compass</strong> — GUI para MongoDB.</li>
            <li>• <strong className="text-text">pgAdmin / DBeaver</strong> — GUIs para PostgreSQL.</li>
            <li>• <strong className="text-text">Docker Desktop</strong> — Para contenedores (bases de datos, servicios).</li>
          </ul>
        </div>

        <InfoBox type="info" title="Extensiones VS Code esenciales para Node.js">
          <strong>ESLint</strong> (linter), <strong>Prettier</strong> (formatter),
          <strong> Error Lens</strong> (errores inline), <strong>REST Client</strong> (probar APIs desde VS Code),
          <strong> dotenv</strong> (syntax highlight .env), <strong>Prisma</strong> (si usas Prisma ORM).
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Configuración recomendada del proyecto</h2>

        <CodeBlock language="bash" filename="Setup profesional desde cero" code={`# 1. Crear proyecto
mkdir mi-api && cd mi-api
npm init -y

# 2. Instalar dependencias esenciales
npm install express dotenv

# 3. Instalar dependencias de desarrollo
npm install -D nodemon eslint prettier

# 4. Crear estructura de carpetas
mkdir src src/routes src/controllers src/middlewares src/models src/config

# 5. Crear archivos base
touch src/app.js src/server.js .env .gitignore .eslintrc.json .prettierrc`} />

        <CodeBlock language="bash" filename=".gitignore" code={`node_modules/
.env
dist/
*.log
.DS_Store
coverage/`} />

        <InfoBox type="warning" title="NUNCA subas node_modules a Git">
          La carpeta <code>node_modules</code> puede tener miles de archivos y pesar cientos de MB.
          Siempre incluye <code>node_modules/</code> en tu <code>.gitignore</code>. Otros desarrolladores
          ejecutan <code>npm install</code> para instalar las dependencias desde <code>package.json</code>.
        </InfoBox>
      </section>
    </div>
  );
}
