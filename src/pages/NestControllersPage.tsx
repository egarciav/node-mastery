import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestControllersPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Controllers en NestJS</h1>
      <p className="text-text-muted text-lg mb-8">Manejar peticiones HTTP con decoradores y DTOs</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Controller CRUD</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          En NestJS, un controller es una clase decorada con <code className="text-primary">@Controller()</code>
          que define un prefijo de ruta. Cada método usa decoradores HTTP (<code className="text-primary">@Get</code>,
          <code className="text-primary"> @Post</code>, etc.) para mapear peticiones. A diferencia de Express donde
          todo es manual, NestJS extrae parámetros, body y query automáticamente con decoradores como
          <code className="text-primary">@Param</code>, <code className="text-primary">@Body</code> y <code className="text-primary">@Query</code>.
          El service se inyecta vía el constructor — NestJS resuelve la dependencia solo:
        </p>

        <CodeBlock language="typescript" filename="users/users.controller.ts" code={`import {
  Controller, Get, Post, Put, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.usersService.findAll(+page, +limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.usersService.update(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">DTOs con class-validator</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Los <strong className="text-text">DTOs</strong> (Data Transfer Objects) definen la forma exacta de los datos
          que entra a cada endpoint. Con <code className="text-primary">class-validator</code>, cada propiedad
          se decora con reglas de validación. NestJS valida automáticamente el body contra estas reglas
          antes de que tu código se ejecute. <code className="text-primary">PartialType</code> crea una versión
          con todos los campos opcionales — perfecta para updates:
        </p>

        <CodeBlock language="typescript" filename="users/dto/create-user.dto.ts" code={`import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;
}

// PartialType hace todos los campos opcionales
import { PartialType } from '@nestjs/mapped-types';

export class UpdateUserDto extends PartialType(CreateUserDto) {}`} />

        <InfoBox type="nest" title="Validación automática">
          Con <code>ValidationPipe</code> global activado en <code>main.ts</code>, NestJS valida
          automáticamente el body de cada request contra el DTO. Si falla, retorna 400 con errores detallados
          sin que escribas una línea de validación en el controller.
        </InfoBox>
      </section>
    </div>
  );
}
