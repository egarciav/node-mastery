import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function EventEmitterPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">EventEmitter</h1>
      <p className="text-text-muted text-lg mb-8">El patrón de eventos que está en el corazón de Node.js</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es EventEmitter?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          EventEmitter es una <strong className="text-text">clase</strong> del módulo <code className="text-primary">events</code> que implementa
          el patrón <strong className="text-text">Observer/Pub-Sub</strong>. Permite que objetos emitan eventos y que otros objetos escuchen y
          reaccionen a esos eventos. Es la base de muchas APIs de Node.js: HTTP servers, streams, child processes, etc.
        </p>

        <CodeBlock language="javascript" filename="EventEmitter básico" code={`import { EventEmitter } from 'events';

const emitter = new EventEmitter();

// Registrar listener (suscribirse a un evento)
emitter.on('saludo', (nombre) => {
  console.log(\`¡Hola, \${nombre}!\`);
});

// Emitir evento
emitter.emit('saludo', 'Carlos');  // ¡Hola, Carlos!
emitter.emit('saludo', 'María');   // ¡Hola, María!

// Listener que se ejecuta solo UNA vez
emitter.once('conexion', (ip) => {
  console.log(\`Primera conexión desde \${ip}\`);
});

emitter.emit('conexion', '192.168.1.1'); // Se ejecuta
emitter.emit('conexion', '10.0.0.1');    // NO se ejecuta (once)

// Remover listener
const handler = (data) => console.log(data);
emitter.on('datos', handler);
emitter.off('datos', handler); // Remover`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Caso práctico: Crear tu propio EventEmitter</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          La forma más común de usar EventEmitter es extenderlo en tus propias clases.
          Aquí un <code className="text-primary">OrderService</code> emite eventos cuando se crea o cancela
          una orden. Otros módulos (email, inventario, reembolso) escuchan y reaccionan
          sin que el service los conozca — <strong className="text-text">desacoplamiento total</strong>:
        </p>

        <CodeBlock language="javascript" filename="Servicio con eventos" code={`import { EventEmitter } from 'events';

class OrderService extends EventEmitter {
  async createOrder(orderData) {
    // Lógica de negocio
    const order = { id: Date.now(), ...orderData, status: 'created' };

    // Emitir eventos para que otros servicios reaccionen
    this.emit('order:created', order);
    return order;
  }

  async cancelOrder(orderId) {
    const order = { id: orderId, status: 'cancelled' };
    this.emit('order:cancelled', order);
    return order;
  }
}

const orderService = new OrderService();

// Diferentes módulos escuchan los eventos
orderService.on('order:created', (order) => {
  console.log(\`[Email] Enviando confirmación para orden #\${order.id}\`);
});

orderService.on('order:created', (order) => {
  console.log(\`[Inventario] Reservando stock para orden #\${order.id}\`);
});

orderService.on('order:cancelled', (order) => {
  console.log(\`[Reembolso] Procesando reembolso para orden #\${order.id}\`);
});

// Usar el servicio
await orderService.createOrder({ product: 'Laptop', qty: 1 });
// [Email] Enviando confirmación para orden #1234567890
// [Inventario] Reservando stock para orden #1234567890`} />

        <InfoBox type="tip" title="Cuándo usar EventEmitter">
          Usa EventEmitter cuando quieras <strong>desacoplar</strong> componentes. El emisor no necesita saber
          quién escucha. Es perfecto para: logging, notificaciones, auditoría, workflows,
          y cualquier caso donde múltiples módulos deben reaccionar a un mismo evento.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Manejo de errores en eventos</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          El evento <code className="text-primary">'error'</code> es especial en Node.js: si se emite y <strong className="text-text">no
          hay listener</strong>, Node.js lanza una excepción no capturada y el proceso muere.
          Siempre registra un listener para <code className="text-primary">'error'</code> en cada EventEmitter:
        </p>

        <CodeBlock language="javascript" filename="Error handling" code={`const emitter = new EventEmitter();

// IMPORTANTE: Si emites 'error' y NO hay listener, Node.js crashea
// Siempre registra un listener para 'error'
emitter.on('error', (err) => {
  console.error('Error capturado:', err.message);
});

emitter.emit('error', new Error('Algo salió mal'));
// Error capturado: Algo salió mal (no crashea)

// Listeners asíncronos con manejo de errores
emitter.on('proceso', async (data) => {
  try {
    await procesarDatos(data);
  } catch (err) {
    emitter.emit('error', err); // Re-emitir como error
  }
});`} />

        <InfoBox type="warning" title="Regla crítica">
          <strong>Siempre</strong> agrega un listener para el evento <code>'error'</code> en cualquier EventEmitter.
          Si se emite un error sin listener, Node.js lanza una excepción no capturada y termina el proceso.
        </InfoBox>
      </section>
    </div>
  );
}
