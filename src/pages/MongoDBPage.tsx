import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function MongoDBPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">MongoDB y Mongoose</h1>
      <p className="text-text-muted text-lg mb-8">Base de datos NoSQL documental con ODM Mongoose</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">¿Qué es MongoDB?</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          MongoDB es una base de datos <strong className="text-text">NoSQL documental</strong>. En vez de tablas y filas
          (como SQL), almacena datos como <strong className="text-text">documentos JSON</strong> (internamente BSON) en colecciones.
          Es flexible, escalable y muy popular en el ecosistema Node.js.
        </p>

        <CodeBlock language="bash" filename="Instalación" code={`npm install mongoose dotenv`} />

        <CodeBlock language="javascript" filename="config/database.js — Conexión" code={`import mongoose from 'mongoose';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(\`MongoDB conectado: \${conn.connection.host}\`);
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message);
    process.exit(1);
  }
}

// .env:
// MONGODB_URI=mongodb://localhost:27017/mi-api
// MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/mi-api`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Schema y Model</h2>

        <CodeBlock language="javascript" filename="models/User.js" code={`import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'El nombre es requerido'],
    trim: true,
    minlength: [2, 'Mínimo 2 caracteres'],
    maxlength: [50, 'Máximo 50 caracteres'],
  },
  email: {
    type: String,
    required: [true, 'El email es requerido'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, // No incluir en queries por defecto
  },
  role: {
    type: String,
    enum: ['user', 'admin', 'moderator'],
    default: 'user',
  },
  avatar: String,
  isActive: { type: Boolean, default: true },
}, {
  timestamps: true, // Agrega createdAt y updatedAt automáticamente
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Índice compuesto
userSchema.index({ email: 1 });
userSchema.index({ name: 'text' }); // Búsqueda full-text

// Virtual (campo calculado, no se guarda en BD)
userSchema.virtual('profileUrl').get(function() {
  return \`/users/\${this._id}\`;
});

// Middleware pre-save
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const bcrypt = await import('bcrypt');
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Método de instancia
userSchema.methods.comparePassword = async function(candidatePassword) {
  const bcrypt = await import('bcrypt');
  return bcrypt.compare(candidatePassword, this.password);
};

// Método estático
userSchema.statics.findByEmail = function(email) {
  return this.findOne({ email });
};

const User = mongoose.model('User', userSchema);
export default User;`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Operaciones CRUD con Mongoose</h2>

        <CodeBlock language="javascript" filename="Operaciones comunes" code={`// CREAR
const user = await User.create({ name: 'Carlos', email: 'c@mail.com', password: '12345678' });
const user2 = new User({ name: 'Ana' });
await user2.save();

// LEER
const users = await User.find();                          // Todos
const user = await User.findById('64a...');               // Por ID
const user = await User.findOne({ email: 'c@mail.com' }); // Por campo
const users = await User.find({ role: 'admin' })          // Con filtro
  .sort('-createdAt')                                      // Ordenar
  .skip(0).limit(10)                                       // Paginar
  .select('name email role')                               // Solo estos campos
  .lean();                                                 // Retornar objeto plano (más rápido)

// ACTUALIZAR
const user = await User.findByIdAndUpdate(
  '64a...',
  { name: 'Carlos Updated' },
  { new: true, runValidators: true }
);

// ELIMINAR
await User.findByIdAndDelete('64a...');
await User.deleteMany({ isActive: false }); // Eliminar muchos`} />

        <InfoBox type="tip" title=".lean()">
          Usa <code>.lean()</code> en queries de solo lectura. Retorna objetos JavaScript planos en vez de
          documentos Mongoose, lo que es <strong>3-5x más rápido</strong> y usa menos memoria.
        </InfoBox>
      </section>
    </div>
  );
}
