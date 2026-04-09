import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function LoggingPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Logging y Monitoreo</h1>
      <p className="text-text-muted text-lg mb-8">Logs estructurados con Winston y Pino para debugging y observabilidad</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Por qué no usar console.log?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          <code>console.log</code> no tiene niveles, no es estructurado, no se puede filtrar,
          y no rota archivos. En producción necesitas un logger profesional con: niveles (error, warn, info, debug),
          formato JSON para parsing, rotación de archivos, y contexto por request.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Pino — El logger más rápido</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Pino es el logger más rápido del ecosistema Node.js (hasta 5x más rápido que Winston).
          En desarrollo usa <code className="text-primary">pino-pretty</code> para logs coloridos y legibles.
          En producción emite JSON puro para que servicios como Datadog o Grafana los parseen automáticamente:
        </p>

        <CodeBlock language="bash" code={`npm install pino pino-pretty`} />

        <CodeBlock language="typescript" filename="utils/logger.ts" code={`import pino from 'pino';
import { env } from '../config/env.js';

export const logger = pino({
  level: env.NODE_ENV === 'production' ? 'info' : 'debug',
  transport: env.NODE_ENV !== 'production'
    ? { target: 'pino-pretty', options: { colorize: true } }
    : undefined, // JSON en producción
  base: { service: 'mi-api' },
});

// Uso:
// logger.info('Server started');
// logger.error({ err, userId }, 'Failed to create user');
// logger.debug({ query }, 'Database query');
// logger.warn({ ip }, 'Rate limit exceeded');`} />

        <p className="text-text-muted leading-relaxed mb-4">
          Este middleware asigna un <code className="text-primary">requestId</code> único a cada petición
          y registra método, URL, status code, duración e IP al finalizar la respuesta.
          El <code className="text-primary">requestId</code> permite rastrear una petición a través de todos
          los logs del sistema:
        </p>

        <CodeBlock language="typescript" filename="middlewares/requestLogger.ts" code={`import { randomUUID } from 'crypto';
import { logger } from '../utils/logger.js';

export function requestLogger(req, res, next) {
  const requestId = randomUUID();
  req.requestId = requestId;

  const start = Date.now();

  // Log al finalizar la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: \`\${duration}ms\`,
      userAgent: req.headers['user-agent'],
      ip: req.ip,
    };

    if (res.statusCode >= 400) {
      logger.error(logData, 'Request failed');
    } else {
      logger.info(logData, 'Request completed');
    }
  });

  next();
}`} />

        <InfoBox type="tip" title="Logs en producción">
          En producción, envía logs a un servicio centralizado como <strong>Datadog</strong>,
          <strong> Grafana Loki</strong>, o <strong>AWS CloudWatch</strong>. Los logs JSON son fáciles
          de parsear y buscar. Incluye siempre un <code>requestId</code> para rastrear peticiones
          a través de toda la cadena.
        </InfoBox>
      </section>
    </div>
  );
}
