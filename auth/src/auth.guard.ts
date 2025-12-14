import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { isTokenValid } from './state';

function parseCookies(headerValue?: string) {
  if (!headerValue) return {};
  return headerValue.split(';').reduce<Record<string, string>>((acc, pair) => {
    const [key, ...rest] = pair.trim().split('=');
    if (!key) return acc;
    acc[key] = decodeURIComponent(rest.join('='));
    return acc;
  }, {});
}

function getBearer(headerValue?: string) {
  if (!headerValue) return '';
  const [scheme, token] = headerValue.split(' ');
  return scheme?.toLowerCase() === 'bearer' ? token : '';
}

export function resolveToken(headers?: Record<string, string | undefined>) {
  const cookies = parseCookies(headers?.cookie);
  const bearer = getBearer(headers?.authorization);
  return bearer || cookies['auth_token'] || '';
}

@Injectable()
export class AuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<{
      path?: string;
      url?: string;
      method?: string;
      headers?: Record<string, string | undefined>;
    }>();

    if (req.method === 'OPTIONS') return true;
    const path = req.path || req.url || '';
    if (path.startsWith('/internal/v1/auth/login') || path.startsWith('/internal/v1/auth/validate')) {
      return true;
    }

    const token = resolveToken(req.headers);
    if (!token) throw new UnauthorizedException('Missing auth token');
    if (!isTokenValid(token)) throw new UnauthorizedException('Invalid auth token');

    if (req.headers && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${token}`;
    }

    return true;
  }
}
