import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import IntroduccionPage from './pages/IntroduccionPage';
import InstalacionPage from './pages/InstalacionPage';
import ModulosPage from './pages/ModulosPage';
import EventLoopPage from './pages/EventLoopPage';
import AsyncPage from './pages/AsyncPage';
import BuffersStreamsPage from './pages/BuffersStreamsPage';
import FileSystemPage from './pages/FileSystemPage';
import PathOsPage from './pages/PathOsPage';
import EventEmitterPage from './pages/EventEmitterPage';
import ProcessTimersPage from './pages/ProcessTimersPage';
import NpmPage from './pages/NpmPage';
import PackageJsonPage from './pages/PackageJsonPage';
import NpmScriptsPage from './pages/NpmScriptsPage';
import ExpressIntroPage from './pages/ExpressIntroPage';
import ExpressRoutingPage from './pages/RoutingPage';
import ExpressMiddlewarePage from './pages/MiddlewarePage';
import ExpressReqResPage from './pages/ReqResPage';
import ExpressErroresPage from './pages/ErroresExpressPage';
import ExpressEstaticosPage from './pages/EstaticosPage';
import RestDisenoPage from './pages/DisenoApiPage';
import RestCrudPage from './pages/CrudPage';
import RestValidacionPage from './pages/ValidacionPage';
import RestAuthPage from './pages/AuthPage';
import RestAutorizacionPage from './pages/AutorizacionPage';
import RestArchivosPage from './pages/ArchivosPage';
import RestPaginacionPage from './pages/PaginacionPage';
import RestSeguridadPage from './pages/SeguridadApiPage';
import MongoDbPage from './pages/MongoDBPage';
import PostgresqlPage from './pages/PostgreSQLPage';
import RelacionesPage from './pages/RelacionesPage';
import MigracionesPage from './pages/MigracionesPage';
import RedisPage from './pages/RedisPage';
import TsNodeSetupPage from './pages/TsNodePage';
import TsExpressPage from './pages/TiposPage';
import TsPatronesPage from './pages/TsAvanzadoPage';
import TestingIntroPage from './pages/TestingIntroPage';
import UnitTestPage from './pages/UnitTestPage';
import TestingApiPage from './pages/IntegrationTestPage';
import TestingMockPage from './pages/MocksSpiesPage';
import TestingE2ePage from './pages/TestingE2ePage';
import MvcPage from './pages/EstructuraProyectoPage';
import CleanArchPage from './pages/CleanArchPage';
import PatronesPage from './pages/PatronesPage';
import SolidPage from './pages/SolidPage';
import WorkerThreadsPage from './pages/WorkerThreadsPage';
import ChildProcessPage from './pages/ChildProcessPage';
import ClusterPage from './pages/ClusterPage';
import PerformancePage from './pages/PerformancePage';
import CachingPage from './pages/CachingPage';
import WebSocketsPage from './pages/WebSocketsPage';
import SeguridadPage from './pages/SeguridadPage';
import DockerPage from './pages/DockerPage';
import EnvVariablesPage from './pages/EnvConfigPage';
import Pm2Page from './pages/Pm2Page';
import LoggingPage from './pages/LoggingPage';
import CiCdPage from './pages/CiCdPage';
import NestIntroPage from './pages/NestIntroPage';
import NestControllersPage from './pages/NestControllersPage';
import NestServicesPage from './pages/NestServicesPage';
import NestModulesPage from './pages/NestModulesPage';
import NestPipesGuardsPage from './pages/NestPipesGuardsPage';
import NestTestingPage from './pages/NestTestingPage';
import NodeModernoPage from './pages/NodeModernoPage';
import BuiltInTestPage from './pages/BuiltInTestPage';
import PermissionModelPage from './pages/PermissionModelPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          {/* Fundamentos de Node.js */}
          <Route path="/introduccion" element={<IntroduccionPage />} />
          <Route path="/instalacion" element={<InstalacionPage />} />
          <Route path="/modulos" element={<ModulosPage />} />
          <Route path="/event-loop" element={<EventLoopPage />} />
          <Route path="/async" element={<AsyncPage />} />
          <Route path="/buffers-streams" element={<BuffersStreamsPage />} />
          <Route path="/file-system" element={<FileSystemPage />} />
          <Route path="/path-os" element={<PathOsPage />} />
          <Route path="/event-emitter" element={<EventEmitterPage />} />
          <Route path="/process-timers" element={<ProcessTimersPage />} />
          {/* NPM y Ecosistema */}
          <Route path="/npm" element={<NpmPage />} />
          <Route path="/package-json" element={<PackageJsonPage />} />
          <Route path="/npm-scripts" element={<NpmScriptsPage />} />
          {/* Express.js */}
          <Route path="/express-intro" element={<ExpressIntroPage />} />
          <Route path="/express-routing" element={<ExpressRoutingPage />} />
          <Route path="/express-middleware" element={<ExpressMiddlewarePage />} />
          <Route path="/express-req-res" element={<ExpressReqResPage />} />
          <Route path="/express-errores" element={<ExpressErroresPage />} />
          <Route path="/express-estaticos" element={<ExpressEstaticosPage />} />
          {/* APIs REST */}
          <Route path="/rest-diseno" element={<RestDisenoPage />} />
          <Route path="/rest-crud" element={<RestCrudPage />} />
          <Route path="/rest-validacion" element={<RestValidacionPage />} />
          <Route path="/rest-auth" element={<RestAuthPage />} />
          <Route path="/rest-autorizacion" element={<RestAutorizacionPage />} />
          <Route path="/rest-archivos" element={<RestArchivosPage />} />
          <Route path="/rest-paginacion" element={<RestPaginacionPage />} />
          <Route path="/rest-seguridad" element={<RestSeguridadPage />} />
          {/* Bases de Datos */}
          <Route path="/mongodb" element={<MongoDbPage />} />
          <Route path="/postgresql" element={<PostgresqlPage />} />
          <Route path="/relaciones" element={<RelacionesPage />} />
          <Route path="/migraciones" element={<MigracionesPage />} />
          <Route path="/redis" element={<RedisPage />} />
          {/* TypeScript + Node */}
          <Route path="/ts-node-setup" element={<TsNodeSetupPage />} />
          <Route path="/ts-express" element={<TsExpressPage />} />
          <Route path="/ts-patrones" element={<TsPatronesPage />} />
          {/* Testing */}
          <Route path="/testing-intro" element={<TestingIntroPage />} />
          <Route path="/testing-unit" element={<UnitTestPage />} />
          <Route path="/testing-api" element={<TestingApiPage />} />
          <Route path="/testing-mock" element={<TestingMockPage />} />
          <Route path="/testing-e2e" element={<TestingE2ePage />} />
          {/* Arquitectura */}
          <Route path="/mvc" element={<MvcPage />} />
          <Route path="/clean-architecture" element={<CleanArchPage />} />
          <Route path="/patrones" element={<PatronesPage />} />
          <Route path="/solid" element={<SolidPage />} />
          {/* Node.js Avanzado */}
          <Route path="/worker-threads" element={<WorkerThreadsPage />} />
          <Route path="/child-process" element={<ChildProcessPage />} />
          <Route path="/cluster" element={<ClusterPage />} />
          <Route path="/performance" element={<PerformancePage />} />
          <Route path="/caching" element={<CachingPage />} />
          {/* WebSockets y Seguridad */}
          <Route path="/websockets" element={<WebSocketsPage />} />
          <Route path="/seguridad" element={<SeguridadPage />} />
          {/* DevOps */}
          <Route path="/docker" element={<DockerPage />} />
          <Route path="/env-variables" element={<EnvVariablesPage />} />
          <Route path="/pm2" element={<Pm2Page />} />
          <Route path="/logging" element={<LoggingPage />} />
          <Route path="/ci-cd" element={<CiCdPage />} />
          {/* NestJS */}
          <Route path="/nest-intro" element={<NestIntroPage />} />
          <Route path="/nest-controllers" element={<NestControllersPage />} />
          <Route path="/nest-services" element={<NestServicesPage />} />
          <Route path="/nest-modules" element={<NestModulesPage />} />
          <Route path="/nest-pipes-guards" element={<NestPipesGuardsPage />} />
          <Route path="/nest-testing" element={<NestTestingPage />} />
          {/* Node Moderno */}
          <Route path="/node-moderno" element={<NodeModernoPage />} />
          <Route path="/built-in-test" element={<BuiltInTestPage />} />
          <Route path="/permission-model" element={<PermissionModelPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
