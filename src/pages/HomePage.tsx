import { Server, BookOpen, Rocket, Flame } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-3 mb-4">
          <span className="text-5xl">&#9881;</span>
          <div>
            <h1 className="text-4xl font-bold text-node">Node.js Mastery</h1>
            <p className="text-text-muted text-lg">Guía Completa Backend 2026 — De cero a arquitecto</p>
          </div>
        </div>
        <p className="text-text-muted leading-relaxed mt-4 text-lg">
          Bienvenido a tu guía definitiva para dominar <strong className="text-text">Node.js</strong> y todo su ecosistema backend.
          Desde los fundamentos del runtime hasta <strong className="text-express">Express</strong>, bases de datos,
          autenticación, testing, arquitectura, DevOps y <strong className="text-nest">NestJS</strong>. Todo explicado
          con código real, definiciones claras y ejemplos prácticos.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 mb-12">
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <Server size={24} className="text-node mb-3" />
          <h3 className="font-semibold text-text mb-2">Node.js Core</h3>
          <p className="text-text-muted text-sm">
            Event loop, módulos, async/await, streams, buffers, file system, EventEmitter,
            process y todo lo que necesitas entender del runtime a fondo.
          </p>
        </div>
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <Flame size={24} className="text-express mb-3" />
          <h3 className="font-semibold text-text mb-2">Express + APIs REST</h3>
          <p className="text-text-muted text-sm">
            Routing, middleware, validación, JWT, roles, upload de archivos,
            paginación, rate limiting. APIs profesionales de producción.
          </p>
        </div>
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <BookOpen size={24} className="text-accent mb-3" />
          <h3 className="font-semibold text-text mb-2">Arquitectura y Patrones</h3>
          <p className="text-text-muted text-sm">
            MVC, Clean Architecture, Repository/Service pattern, SOLID, TypeScript,
            testing con Jest/Vitest, Docker, CI/CD y más.
          </p>
        </div>
        <div className="bg-surface-light border border-border rounded-xl p-6">
          <Rocket size={24} className="text-nest mb-3" />
          <h3 className="font-semibold text-text mb-2">NestJS + Node Moderno</h3>
          <p className="text-text-muted text-sm">
            NestJS como framework enterprise, Node 22+ features, permission model,
            test runner nativo. El futuro del backend con JavaScript.
          </p>
        </div>
      </div>

      <div className="bg-surface-light border border-border rounded-xl p-6 mb-8">
        <h2 className="text-xl font-bold text-text mb-4">Ruta de Aprendizaje Recomendada</h2>
        <div className="space-y-3">
          <RoadmapItem number={1} title="Fundamentos de Node.js" desc="Event loop, módulos, async/await, streams, file system, EventEmitter" link="/introduccion" />
          <RoadmapItem number={2} title="NPM y Ecosistema" desc="package.json, scripts, workspaces, gestión de dependencias" link="/npm" />
          <RoadmapItem number={3} title="Express.js" desc="Routing, middleware, request/response, manejo de errores" link="/express-intro" />
          <RoadmapItem number={4} title="APIs REST Profesionales" desc="CRUD, validación, JWT, roles, uploads, paginación, seguridad" link="/rest-diseno" />
          <RoadmapItem number={5} title="Bases de Datos" desc="MongoDB + Mongoose, PostgreSQL + Prisma, Redis" link="/mongodb" />
          <RoadmapItem number={6} title="TypeScript + Node" desc="Setup, tipos para Express, patrones tipados" link="/ts-node-setup" />
          <RoadmapItem number={7} title="Testing" desc="Jest, Vitest, Supertest, mocking, E2E" link="/testing-intro" />
          <RoadmapItem number={8} title="Arquitectura y Patrones" desc="MVC, Clean Architecture, Repository, Service, SOLID" link="/mvc" />
          <RoadmapItem number={9} title="Node.js Avanzado" desc="Worker threads, cluster, performance, caching" link="/worker-threads" />
          <RoadmapItem number={10} title="WebSockets y Seguridad" desc="Socket.io, OWASP, helmet, CORS, XSS, CSRF" link="/websockets" />
          <RoadmapItem number={11} title="DevOps y Deploy" desc="Docker, env variables, PM2, logging, CI/CD" link="/docker" />
          <RoadmapItem number={12} title="NestJS" desc="Controllers, services, modules, pipes, guards, testing" link="/nest-intro" />
          <RoadmapItem number={13} title="Node Moderno 2026" desc="Node 22+, test runner nativo, permission model" link="/node-moderno" />
        </div>
      </div>

      <div className="bg-primary/10 border border-primary/30 rounded-xl p-6">
        <h3 className="text-primary font-semibold mb-2">Esta guía es para ti si...</h3>
        <ul className="text-text-muted text-sm leading-relaxed space-y-1">
          <li>• Quieres aprender Node.js desde cero sin depender de otra fuente</li>
          <li>• Ya sabes algo de JavaScript y quieres dominar el backend</li>
          <li>• Necesitas construir APIs REST profesionales para producción</li>
          <li>• Quieres entender arquitectura, patrones y buenas prácticas</li>
          <li>• Buscas prepararte para entrevistas técnicas de backend</li>
        </ul>
      </div>
    </div>
  );
}

function RoadmapItem({ number, title, desc, link }: { number: number; title: string; desc: string; link: string }) {
  return (
    <Link to={link} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-lighter/30 transition-colors group">
      <span className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary font-bold text-sm flex items-center justify-center">
        {number}
      </span>
      <div>
        <h4 className="font-medium text-text group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-text-muted text-sm">{desc}</p>
      </div>
    </Link>
  );
}
