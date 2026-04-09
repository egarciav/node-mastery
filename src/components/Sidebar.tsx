import { NavLink } from 'react-router-dom';
import {
  Home, Code2, Database, Zap, FileText, Shield, Layers,
  GitBranch, AlertCircle, Puzzle, Rocket,
  X, Menu, Server, Lock, TestTube,
  Settings, Binary, Clock, FolderOpen, Workflow,
  Boxes, Cpu, Globe, FileCode,
  Wrench, Cog, PackageCheck, MonitorCheck,
  Terminal, Package, Cable, RefreshCw,
  ArrowRightLeft, HardDrive, Container,
  Network, Activity, Eye,
  Gauge, MemoryStick, CloudUpload, Play,
  Milestone, Unplug, KeyRound, Upload,
  Filter, ShieldCheck, FileJson, Blocks,
  Radio, LayoutDashboard, Plug,
  Microscope, Bug, CircuitBoard, Flame, FlaskConical
} from 'lucide-react';
import { useState } from 'react';

const sections = [
  {
    title: 'Inicio',
    items: [
      { path: '/', label: 'Bienvenida', icon: Home },
    ],
  },
  {
    title: 'Fundamentos de Node.js',
    items: [
      { path: '/introduccion', label: 'Introducción a Node.js', icon: Rocket },
      { path: '/instalacion', label: 'Instalación y Setup', icon: Terminal },
      { path: '/modulos', label: 'Módulos (CJS vs ESM)', icon: Package },
      { path: '/event-loop', label: 'Event Loop', icon: RefreshCw },
      { path: '/async', label: 'Async: Callbacks → Await', icon: Cable },
      { path: '/buffers-streams', label: 'Buffers y Streams', icon: Activity },
      { path: '/file-system', label: 'File System (fs)', icon: FolderOpen },
      { path: '/path-os', label: 'Módulos path, os, url', icon: HardDrive },
      { path: '/event-emitter', label: 'EventEmitter', icon: Radio },
      { path: '/process-timers', label: 'Process y Timers', icon: Clock },
    ],
  },
  {
    title: 'NPM y Ecosistema',
    items: [
      { path: '/npm', label: 'NPM en Profundidad', icon: Boxes },
      { path: '/package-json', label: 'package.json Detallado', icon: FileJson },
      { path: '/npm-scripts', label: 'Scripts y Workspaces', icon: Play },
    ],
  },
  {
    title: 'Express.js',
    items: [
      { path: '/express-intro', label: 'Introducción a Express', icon: Globe },
      { path: '/express-routing', label: 'Routing', icon: GitBranch },
      { path: '/express-middleware', label: 'Middleware', icon: Layers },
      { path: '/express-req-res', label: 'Request y Response', icon: ArrowRightLeft },
      { path: '/express-errores', label: 'Manejo de Errores', icon: AlertCircle },
      { path: '/express-estaticos', label: 'Archivos Estáticos', icon: FileText },
    ],
  },
  {
    title: 'APIs REST Profesionales',
    items: [
      { path: '/rest-diseno', label: 'Diseño REST', icon: LayoutDashboard },
      { path: '/rest-crud', label: 'CRUD Completo', icon: Database },
      { path: '/rest-validacion', label: 'Validación (Zod/Joi)', icon: ShieldCheck },
      { path: '/rest-auth', label: 'Autenticación (JWT)', icon: KeyRound },
      { path: '/rest-autorizacion', label: 'Autorización y Roles', icon: Lock },
      { path: '/rest-archivos', label: 'Upload de Archivos', icon: Upload },
      { path: '/rest-paginacion', label: 'Paginación y Filtros', icon: Filter },
      { path: '/rest-seguridad', label: 'Rate Limit y Seguridad', icon: Shield },
    ],
  },
  {
    title: 'Bases de Datos',
    items: [
      { path: '/mongodb', label: 'MongoDB + Mongoose', icon: Database },
      { path: '/postgresql', label: 'PostgreSQL + Prisma', icon: Server },
      { path: '/relaciones', label: 'Relaciones y Joins', icon: Network },
      { path: '/migraciones', label: 'Migraciones y Seeds', icon: Milestone },
      { path: '/redis', label: 'Redis (Cache)', icon: Zap },
    ],
  },
  {
    title: 'TypeScript + Node',
    items: [
      { path: '/ts-node-setup', label: 'Setup TS + Node', icon: Settings },
      { path: '/ts-express', label: 'Tipos para Express', icon: Code2 },
      { path: '/ts-patrones', label: 'Patrones con TS', icon: Puzzle },
    ],
  },
  {
    title: 'Testing',
    items: [
      { path: '/testing-intro', label: 'Introducción al Testing', icon: TestTube },
      { path: '/testing-unit', label: 'Unit Testing (Vitest)', icon: FlaskConical },
      { path: '/testing-api', label: 'Testing de APIs', icon: MonitorCheck },
      { path: '/testing-mock', label: 'Mocking y Stubs', icon: Blocks },
      { path: '/testing-e2e', label: 'Testing E2E', icon: Microscope },
    ],
  },
  {
    title: 'Arquitectura y Patrones',
    items: [
      { path: '/mvc', label: 'Patrón MVC', icon: LayoutDashboard },
      { path: '/clean-architecture', label: 'Clean Architecture', icon: CircuitBoard },
      { path: '/patrones', label: 'Repository y Service', icon: Workflow },
      { path: '/solid', label: 'SOLID en Node', icon: Wrench },
    ],
  },
  {
    title: 'Node.js Avanzado',
    items: [
      { path: '/worker-threads', label: 'Worker Threads', icon: Cpu },
      { path: '/child-process', label: 'Child Processes', icon: Binary },
      { path: '/cluster', label: 'Cluster', icon: Boxes },
      { path: '/performance', label: 'Performance y Profiling', icon: Gauge },
      { path: '/caching', label: 'Estrategias de Caching', icon: MemoryStick },
    ],
  },
  {
    title: 'WebSockets y Real-time',
    items: [
      { path: '/websockets', label: 'Socket.io y WebSockets', icon: Unplug },
    ],
  },
  {
    title: 'Seguridad',
    items: [
      { path: '/seguridad', label: 'Seguridad Integral', icon: ShieldCheck },
    ],
  },
  {
    title: 'DevOps y Deploy',
    items: [
      { path: '/docker', label: 'Docker para Node', icon: Container },
      { path: '/env-variables', label: 'Variables de Entorno', icon: Eye },
      { path: '/pm2', label: 'PM2 y Process Manager', icon: Cog },
      { path: '/logging', label: 'Logging (Winston/Pino)', icon: FileCode },
      { path: '/ci-cd', label: 'CI/CD Pipelines', icon: CloudUpload },
    ],
  },
  {
    title: 'NestJS',
    items: [
      { path: '/nest-intro', label: 'Introducción a NestJS', icon: Flame },
      { path: '/nest-controllers', label: 'Controllers', icon: Globe },
      { path: '/nest-services', label: 'Services y Providers', icon: Plug },
      { path: '/nest-modules', label: 'Modules', icon: PackageCheck },
      { path: '/nest-pipes-guards', label: 'Pipes, Guards, Interceptors', icon: Shield },
      { path: '/nest-testing', label: 'Testing en NestJS', icon: Bug },
    ],
  },
  {
    title: 'Node Moderno 2026',
    items: [
      { path: '/node-moderno', label: 'Node 22+ Features', icon: Rocket },
      { path: '/built-in-test', label: 'Test Runner Nativo', icon: TestTube },
      { path: '/permission-model', label: 'Permission Model', icon: Lock },
    ],
  },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden bg-surface-light border border-border rounded-lg p-2 text-text hover:bg-surface-lighter transition-colors cursor-pointer"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-light border-r border-border z-40 overflow-y-auto transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 lg:static lg:z-0`}
      >
        <div className="p-6 border-b border-border">
          <h1 className="text-lg font-bold text-node flex items-center gap-2">
            <span className="text-2xl">&#9881;</span> Node.js Mastery
          </h1>
          <p className="text-xs text-text-muted mt-1">Guía Completa Backend 2026</p>
        </div>

        <nav className="p-4">
          {sections.map((section) => (
            <div key={section.title} className="mb-4">
              <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2 px-3">
                {section.title}
              </h3>
              {section.items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 mb-0.5 ${
                        isActive
                          ? 'bg-primary/15 text-primary font-medium'
                          : 'text-text-muted hover:bg-surface-lighter/50 hover:text-text'
                      }`
                    }
                    end={item.path === '/'}
                  >
                    <Icon size={16} />
                    {item.label}
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
