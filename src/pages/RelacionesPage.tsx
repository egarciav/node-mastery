import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function RelacionesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Relaciones y Populate</h1>
      <p className="text-text-muted text-lg mb-8">Relaciones entre documentos en MongoDB y tablas en PostgreSQL</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Relaciones en MongoDB (Mongoose)</h2>

        <CodeBlock language="javascript" filename="Referencia (populate)" code={`// models/Post.js
const postSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  // Referencia al usuario
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment',
  }],
});

// Consultar con populate (JOIN)
const post = await Post.findById(postId)
  .populate('author', 'name email avatar')  // Solo traer estos campos
  .populate({
    path: 'comments',
    populate: { path: 'author', select: 'name avatar' }, // Populate anidado
    options: { sort: { createdAt: -1 }, limit: 20 },
  });

// Resultado:
// {
//   title: "Mi post",
//   author: { _id: "...", name: "Carlos", email: "c@mail.com", avatar: "..." },
//   comments: [
//     { text: "...", author: { name: "Ana", avatar: "..." } },
//   ]
// }`} />

        <CodeBlock language="javascript" filename="Embedding (subdocumentos)" code={`// Para datos que siempre se acceden juntos
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered'] },
  // Items embebidos — NO son documentos separados
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,      // Desnormalizado para performance
    price: Number,
    quantity: Number,
  }],
  total: Number,
  shippingAddress: {   // Subdocumento embebido
    street: String,
    city: String,
    country: String,
    zipCode: String,
  },
});`} />

        <InfoBox type="info" title="¿Referencia o embedding?">
          <strong>Referencia (populate):</strong> Cuando los datos se acceden independientemente, cuando
          el subdocumento puede crecer mucho, o cuando se actualiza frecuentemente.<br/><br/>
          <strong>Embedding:</strong> Cuando los datos siempre se leen juntos, cuando el subdocumento es
          pequeño y no cambia mucho. Más rápido porque evita JOINs.
        </InfoBox>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Relaciones en Prisma (PostgreSQL)</h2>

        <CodeBlock language="javascript" filename="Tipos de relaciones" code={`// 1:1 — Un usuario tiene un perfil
model User {
  id      Int      @id @default(autoincrement())
  profile Profile?
}
model Profile {
  id     Int  @id @default(autoincrement())
  user   User @relation(fields: [userId], references: [id])
  userId Int  @unique  // @unique lo hace 1:1
}

// 1:N — Un usuario tiene muchos posts
model User {
  id    Int    @id @default(autoincrement())
  posts Post[]
}
model Post {
  id       Int  @id @default(autoincrement())
  author   User @relation(fields: [authorId], references: [id])
  authorId Int
}

// N:M — Posts tienen muchos tags y viceversa
model Post {
  id   Int   @id @default(autoincrement())
  tags Tag[]  // Prisma crea la tabla intermedia automáticamente
}
model Tag {
  id    Int    @id @default(autoincrement())
  posts Post[]
}

// Consultar con include
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    posts: {
      where: { published: true },
      include: { tags: true },
    },
    profile: true,
  },
});`} />
      </section>
    </div>
  );
}
