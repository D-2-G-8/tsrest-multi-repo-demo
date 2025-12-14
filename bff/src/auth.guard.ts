import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { initClient } from '@ts-rest/core';
import { authContract } from '@acme/contracts';

const authClient = initClient(authContract, {
  baseUrl: process.env.AUTH_URL || 'http://localhost:3004',
  baseHeaders: {},
});

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
    if (path.startsWith('/v1/auth/login')) return true;

    const token = resolveToken(req.headers);

    if (!token) throw new UnauthorizedException('Missing auth token');

    try {
      const result = await authClient.validate({ body: { token } });
      if (result.status === 200 && result.body.valid) return true;
      if (req.headers && !req.headers.authorization) {
        req.headers.authorization = `Bearer ${token}`;
      }
    } catch (error) {
      // fall through to UnauthorizedException below
    }

    throw new UnauthorizedException('Invalid auth token');
  }
}
