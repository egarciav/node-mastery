import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestServicesPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Services e Inyección de Dependencias</h1>
      <p className="text-text-muted text-lg mb-8">Lógica de negocio con providers y DI automática</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Service con Prisma</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En NestJS, los <strong className="text-text">Services</strong> contienen toda la lógica de negocio.
          El controller solo recibe la petición y delega al service. Esto separa responsabilidades:
          si cambias de Prisma a Mongoose, solo tocas el service, no el controller.
          El decorador <code className="text-primary">@Injectable()</code> permite que NestJS inyecte este
          service automáticamente donde se necesite. Nota cómo se usan excepciones de NestJS
          (<code className="text-primary">NotFoundException</code>, <code className="text-primary">ConflictException</code>)
          en vez de manejar códigos HTTP manualmente:
        </p>

        <CodeBlock language="typescript" filename="users/users.service.ts" code={`import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll(page: number, limit: number) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip, take: limit,
        select: { id: true, name: true, email: true, role: true },
      }),
      this.prisma.user.count(),
    ]);
    return { data: users, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuario no encontrado');
    return user;
  }

  async create(dto: CreateUserDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email ya registrado');

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    return this.prisma.user.create({
      data: { ...dto, password: hashedPassword },
    });
  }

  async update(id: string, dto: UpdateUserDto) {
    await this.findOne(id);
    return this.prisma.user.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    await this.prisma.user.delete({ where: { id } });
  }
}`} />

        <InfoBox type="tip" title="@Injectable()">
          El decorador <code>@Injectable()</code> marca la clase como un provider que puede ser
          inyectado por el contenedor de DI de NestJS. El constructor declara las dependencias
          y NestJS las resuelve automáticamente.
        </InfoBox>
      </section>
    </div>
  );
}
