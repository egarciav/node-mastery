import CodeBlock from '../components/CodeBlock';
import InfoBox from '../components/InfoBox';

export default function NestPipesGuardsPage() {
  return (
    <div>
      <h1 className="text-4xl font-bold text-nest mb-2">Pipes, Guards e Interceptors</h1>
      <p className="text-text-muted text-lg mb-8">Middleware avanzado para validación, autenticación y transformación</p>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Guards — Autenticación y autorización</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Un <strong className="text-text">Guard</strong> decide si una petición puede continuar o no. Implementa
          <code className="text-primary">CanActivate</code> y retorna <code className="text-primary">true</code> (permitir)
          o lanza una excepción (bloquear). Es el lugar perfecto para verificar JWTs: extraes el token
          del header, lo verificas, y guardas el payload en <code className="text-primary">request.user</code>
          para que los controllers puedan usarlo después:
        </p>

        <CodeBlock language="typescript" filename="auth/guards/jwt-auth.guard.ts" code={`import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) throw new UnauthorizedException('Token requerido');

    try {
      const payload = await this.jwtService.verifyAsync(token);
      request.user = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Token inválido');
    }
  }
}

// Uso en controller:
// @UseGuards(JwtAuthGuard)
// @Get('profile')
// getProfile(@Req() req) { return req.user; }`} />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-text mb-4">Guard de Roles</h2>
        <p className="text-text-muted leading-relaxed mb-4">
          Después de autenticar al usuario, necesitas <strong className="text-text">autorizar</strong>: ¿tiene permiso
          para esta acción? Este guard usa <code className="text-primary">Reflector</code> para leer metadata
          de los decoradores personalizados. Tú decoras el endpoint con <code className="text-primary">@Roles('admin')</code>
          y el guard verifica si <code className="text-primary">user.role</code> está en la lista permitida:
        </p>

        <CodeBlock language="typescript" filename="auth/guards/roles.guard.ts" code={`import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SetMetadata } from '@nestjs/common';

// Decorador personalizado
export const Roles = (...roles: string[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>('roles', context.getHandler());
    if (!requiredRoles) return true;

    const { user } = context.switchToHttp().getRequest();
    return requiredRoles.includes(user.role);
  }
}

// Uso:
// @UseGuards(JwtAuthGuard, RolesGuard)
// @Roles('admin')
// @Delete(':id')
// remove(@Param('id') id: string) { ... }`} />

        <InfoBox type="nest" title="Orden de ejecución">
          <strong>Middleware → Guards → Interceptors (pre) → Pipes → Handler → Interceptors (post) → Exception Filters.</strong>
          Los Guards deciden si la request continúa. Los Pipes transforman/validan datos.
          Los Interceptors envuelven la ejecución (logging, caching, transformación de respuesta).
        </InfoBox>
      </section>
    </div>
  );
}
