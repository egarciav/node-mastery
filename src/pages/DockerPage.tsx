import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function DockerPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-docker mb-2">Docker para Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Containerizar tu aplicación para desarrollo y producción</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Dockerfile optimizado</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Este Dockerfile usa <strong className="text-text">multi-stage builds</strong>: la primera etapa instala todo
          y compila TypeScript; la segunda etapa solo copia el código compilado y las dependencias de producción.
          Resultado: imagen final de ~150MB en vez de ~1GB. Además incluye un <strong className="text-text">usuario no-root</strong>
          por seguridad y un <strong className="text-text">healthcheck</strong> para que Docker sepa si tu app está viva:
        </p>

        <CodeBlock language="dockerfile" filename="Dockerfile" code={`# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Production
FROM node:20-alpine AS production
WORKDIR /app

# Usuario no-root por seguridad
RUN addgroup -g 1001 -S nodejs && \\
    adduser -S nodejs -u 1001

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY --from=builder /app/dist ./dist

USER nodejs

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s \\
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/health || exit 1

CMD ["node", "dist/server.js"]`} />

        <CodeBlock language="bash" filename=".dockerignore" code={`node_modules
dist
.env
.git
*.md
.vscode`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Docker Compose para desarrollo</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Docker Compose levanta <strong className="text-text">múltiples servicios</strong> con un solo comando.
          En desarrollo, tu API, MongoDB y Redis corren juntos con redes internas automáticas.
          El volumen <code className="text-primary">.:/app</code> sincroniza tus archivos locales con el container
          para hot-reload. El truco <code className="text-primary">/app/node_modules</code> evita pisar los
          node_modules del container con los de tu máquina:
        </p>

        <CodeBlock language="yaml" filename="docker-compose.yml" code={`version: '3.8'

services:
  api:
    build: .
    ports:
      - '3000:3000'
    environment:
      - NODE_ENV=development
      - DATABASE_URL=mongodb://mongo:27017/mi-api
      - REDIS_HOST=redis
    volumes:
      - .:/app
      - /app/node_modules
    depends_on:
      - mongo
      - redis
    command: npm run dev

  mongo:
    image: mongo:7
    ports:
      - '27017:27017'
    volumes:
      - mongo_data:/data/db

  redis:
    image: redis:7-alpine
    ports:
      - '6379:6379'

volumes:
  mongo_data:`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Los comandos esenciales que usarás a diario con Docker Compose:
        </p>

        <CodeBlock language="bash" filename="Comandos Docker" code={`# Levantar todo
docker compose up -d

# Ver logs
docker compose logs -f api

# Rebuild
docker compose up --build

# Detener
docker compose down`} />

        <InfoBox type="tip" title="Multi-stage builds">
          El Dockerfile usa <strong>multi-stage builds</strong>: la imagen final solo tiene el código
          compilado y las dependencias de producción. Esto reduce el tamaño de imagen de ~1GB a ~150MB.
        </InfoBox>
      </section>
    </div>
  );
}
