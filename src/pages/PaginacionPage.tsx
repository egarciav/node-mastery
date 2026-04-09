import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function PaginacionPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-node mb-2">Paginación, Filtros y Ordenamiento</h1>
      <p className="text-text-muted text-lg mb-8">Manejar grandes cantidades de datos eficientemente</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Paginación offset-based</h2>

        <CodeBlock language="javascript" filename="Implementación completa" code={`// GET /api/products?page=2&limit=10&sort=-price&category=electronics&minPrice=100

export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 10,
    sort = '-createdAt',
    category,
    minPrice,
    maxPrice,
    search
  } = req.query;

  // Construir filtros dinámicamente
  const filter = {};
  if (category) filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.min(100, Math.max(1, Number(limit)));
  const skip = (pageNum - 1) * limitNum;

  // Ejecutar query y count en paralelo
  const [products, total] = await Promise.all([
    Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limitNum);

  res.json({
    status: 'success',
    data: products,
    meta: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages,
      hasNextPage: pageNum < totalPages,
      hasPrevPage: pageNum > 1
    }
  });
});`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Paginación cursor-based</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Para datasets muy grandes o datos que cambian frecuentemente, la paginación por cursor
          es más eficiente y consistente que offset-based:
        </p>

        <CodeBlock language="javascript" filename="Cursor pagination" code={`// GET /api/feed?cursor=507f1f77bcf86cd799439011&limit=20

export const getFeed = asyncHandler(async (req, res) => {
  const { cursor, limit = 20 } = req.query;
  const limitNum = Math.min(100, Number(limit));

  const filter = cursor
    ? { _id: { $lt: cursor } }  // Elementos después del cursor
    : {};

  const items = await Post.find(filter)
    .sort({ _id: -1 })
    .limit(limitNum + 1)  // +1 para saber si hay más
    .lean();

  const hasMore = items.length > limitNum;
  if (hasMore) items.pop(); // Quitar el extra

  const nextCursor = items.length > 0
    ? items[items.length - 1]._id
    : null;

  res.json({
    status: 'success',
    data: items,
    meta: {
      nextCursor,
      hasMore
    }
  });
});`} />

        <InfoBox type="info" title="¿Cuándo usar cada tipo?">
          <strong>Offset-based:</strong> Cuando necesitas saltar a una página específica (página 5 de 20).
          Simple y familiar. Malo para datasets enormes (skip es lento en Mongo).
          <br/><br/>
          <strong>Cursor-based:</strong> Para feeds infinitos, datos en tiempo real, o datasets enormes.
          Más eficiente, pero no puedes saltar a una página específica.
        </InfoBox>
      </section>
    </div>
  );
}
