import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function CiCdPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">CI/CD para Node.js</h1>
      <p className="text-text-muted text-lg mb-8">Automatizar tests, builds y deploys con GitHub Actions</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Pipeline CI/CD con GitHub Actions</h2>

        <CodeBlock language="yaml" filename=".github/workflows/ci.yml" code={`name: CI/CD Pipeline

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      mongo:
        image: mongo:7
        ports:
          - 27017:27017

    steps:
      - uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Type check
        run: npm run typecheck

      - name: Run tests
        run: npm test
        env:
          DATABASE_URL: mongodb://localhost:27017/test
          JWT_SECRET: test-secret-key-for-ci-pipeline

      - name: Build
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v4

      - name: Deploy to Railway
        uses: bervProject/railway-deploy@main
        with:
          railway_token: \${{ secrets.RAILWAY_TOKEN }}
          service: mi-api`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Scripts necesarios en package.json</h2>

        <CodeBlock language="json" filename="package.json (scripts)" code={`{
  "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}`} />

        <InfoBox type="tip" title="El flujo ideal">
          <strong>1.</strong> Push a PR → CI ejecuta lint + typecheck + tests.
          <strong> 2.</strong> Si pasa, merge a main.
          <strong> 3.</strong> Push a main → CI ejecuta tests + build + deploy automático.
          Todo fallo bloquea el deploy. Nunca se despliega código que no pasa los tests.
        </InfoBox>
      </section>
    </div>
  );
}
