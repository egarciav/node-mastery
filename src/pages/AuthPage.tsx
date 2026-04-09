import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function AuthPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Autenticación con JWT</h1>
      <p className="text-text-muted text-lg mb-8">JSON Web Tokens, bcrypt, login, registro y protección de rutas</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es JWT?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          JWT (JSON Web Token) es un <strong className="text-text">estándar abierto</strong> para transmitir información
          de forma segura entre partes como un objeto JSON firmado. El servidor genera un token al hacer login,
          y el cliente lo envía en cada petición posterior para demostrar su identidad.
        </p>

        <CodeBlock language="bash" filename="Estructura de un JWT" code={`# Un JWT tiene 3 partes separadas por puntos:
# HEADER.PAYLOAD.SIGNATURE

# Header: Algoritmo y tipo
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
# → { "alg": "HS256", "typ": "JWT" }

# Payload: Datos del usuario (claims)
eyJ1c2VySWQiOiIxMjMiLCJyb2xlIjoiYWRtaW4ifQ
# → { "userId": "123", "role": "admin", "iat": 1700000000, "exp": 1700086400 }

# Signature: Firma con clave secreta
# HMACSHA256(header + "." + payload, SECRET_KEY)`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Implementación completa</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          La autenticación tiene dos flujos: <strong className="text-text">registro</strong> (hashear password con bcrypt,
          crear usuario, generar token) y <strong className="text-text">login</strong> (buscar usuario, comparar password
          hasheado, generar token). La función <code className="text-primary">generateToken</code> centraliza
          la creación del JWT con el payload y la expiración:
        </p>

        <CodeBlock language="bash" code={`npm install jsonwebtoken bcrypt dotenv`} />

        <CodeBlock language="javascript" filename="controllers/authController.js" code={`import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AppError } from '../utils/AppError.js';

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

function generateToken(user) {
  return jwt.sign(
    { userId: user._id, role: user.role },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

// POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el email ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new AppError('El email ya está registrado', 409);
  }

  // Hash de la contraseña (bcrypt agrega salt automáticamente)
  const hashedPassword = await bcrypt.hash(password, 12);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  const token = generateToken(user);

  res.status(201).json({
    status: 'success',
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }
  });
});

// POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Buscar usuario (incluir password que normalmente se excluye)
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  // Comparar contraseña
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const token = generateToken(user);

  res.json({
    status: 'success',
    data: {
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role }
    }
  });
});`} />

        <p className="text-text-muted leading-relaxed mb-4">
          El middleware de autenticación verifica el token en cada petición protegida.
          Extrae el token del header <code className="text-primary">Authorization: Bearer &lt;token&gt;</code>,
          lo verifica, y guarda el payload decodificado en <code className="text-primary">req.user</code>
          para que los controllers puedan saber quién es el usuario:
        </p>

        <CodeBlock language="javascript" filename="middlewares/auth.js" code={`import jwt from 'jsonwebtoken';
import { UnauthorizedError } from '../utils/AppError.js';

export function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('Token de acceso requerido');
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { userId, role, iat, exp }
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      throw new UnauthorizedError('Token expirado');
    }
    throw new UnauthorizedError('Token inválido');
  }
}`} />

        <InfoBox type="warning" title="Seguridad JWT">
          <strong>Nunca</strong> guardes datos sensibles en el payload del JWT (contraseñas, tarjetas).
          El payload es <strong>visible</strong> (base64, no encriptado). Solo la firma previene modificación.
          Usa una clave secreta larga y aleatoria. Rota las claves periódicamente.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Enviar el token desde el cliente</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Desde el frontend, guardas el token después del login y lo envías en el header
          <code className="text-primary"> Authorization</code> de cada petición a rutas protegidas.
          Sin este header, el middleware de autenticación rechaza la petición con 401:
        </p>

        <CodeBlock language="javascript" filename="Cliente (fetch)" code={`// Login
const response = await fetch('/api/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'user@mail.com', password: '123456' })
});
const { data } = await response.json();
const token = data.token;

// Usar el token en peticiones protegidas
const users = await fetch('/api/users', {
  headers: {
    'Authorization': \`Bearer \${token}\`,
    'Content-Type': 'application/json'
  }
});`} />
      </section>
    </div>
  );
}
