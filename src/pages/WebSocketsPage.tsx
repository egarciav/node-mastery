import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function WebSocketsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">WebSockets con Socket.IO</h1>
      <p className="text-text-muted text-lg mb-8">Comunicación bidireccional en tiempo real entre cliente y servidor</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué son los WebSockets?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          HTTP es <strong className="text-text">request-response</strong>: el cliente pregunta, el servidor responde.
          WebSockets abren una <strong className="text-text">conexión persistente bidireccional</strong>: ambos lados
          pueden enviar mensajes en cualquier momento. Ideal para chats, notificaciones en vivo, dashboards real-time.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Servidor con Socket.IO</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Socket.IO necesita montar sobre un servidor HTTP existente. El servidor escucha <strong className="text-text">eventos
          personalizados</strong> que tú defines (como <code className="text-primary">chat:message</code>). La clave
          es entender los diferentes métodos de emisión: a un cliente, a todos, a una sala específica.
          También puedes organizar usuarios en <strong className="text-text">salas (rooms)</strong> para chats grupales:
        </p>

        <CodeBlock language="bash" code={`npm install socket.io`} />

        <CodeBlock language="typescript" filename="server.ts" code={`import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: { origin: 'http://localhost:5173' },
});

io.on('connection', (socket) => {
  console.log(\`User connected: \${socket.id}\`);

  // Escuchar evento del cliente
  socket.on('chat:message', (data) => {
    console.log('Message received:', data);
    // Emitir a TODOS los conectados (incluido sender)
    io.emit('chat:message', {
      id: Date.now(),
      user: data.user,
      text: data.text,
      timestamp: new Date().toISOString(),
    });
  });

  // Unirse a una sala (room)
  socket.on('room:join', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('room:userJoined', socket.id);
  });

  // Emitir solo a una sala
  socket.on('room:message', ({ roomId, message }) => {
    io.to(roomId).emit('room:message', message);
  });

  socket.on('disconnect', () => {
    console.log(\`User disconnected: \${socket.id}\`);
  });
});

httpServer.listen(3000, () => console.log('Server running on port 3000'));`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Cliente</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Desde el frontend (o cualquier cliente), te conectas al servidor con <code className="text-primary">io()</code>
          y usas los mismos nombres de eventos para enviar (<code className="text-primary">emit</code>) y recibir
          (<code className="text-primary">on</code>) mensajes. Socket.IO maneja reconexiones automáticas si se pierde la conexión:
        </p>

        <CodeBlock language="typescript" filename="Cliente Socket.IO" code={`import { io } from 'socket.io-client';

const socket = io('http://localhost:3000');

socket.on('connect', () => {
  console.log('Connected:', socket.id);
});

// Enviar mensaje
socket.emit('chat:message', { user: 'Carlos', text: 'Hola!' });

// Recibir mensajes
socket.on('chat:message', (data) => {
  console.log('New message:', data);
});

// Unirse a sala
socket.emit('room:join', 'room-123');`} />

        <InfoBox type="tip" title="Patrones de emisión">
          <code>socket.emit()</code> — al cliente que envió.
          <code> socket.broadcast.emit()</code> — a todos excepto el sender.
          <code> io.emit()</code> — a todos los conectados.
          <code> io.to(room).emit()</code> — a todos en una sala.
        </InfoBox>
      </section>
    </div>
  );
}
