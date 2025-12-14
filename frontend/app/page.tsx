'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { initClient } from '@ts-rest/core';
import { bffFrontendContract } from '@acme/contracts';

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: any };
type AuthState =
  | { status: 'idle' | 'pending' }
  | { status: 'authenticated'; token: string }
  | { status: 'error'; message: string };

const AUTH_COOKIE_NAME = 'auth_token';

function getCookie(name: string) {
  const match = document.cookie
    .split(';')
    .map((part) => part.trim())
    .find((row) => row.startsWith(`${name}=`));
  return match ? decodeURIComponent(match.split('=')[1]) : '';
}

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3000';

  const client = useMemo(() => {
    return initClient(bffFrontendContract, { baseUrl, credentials: 'include' });
  }, [baseUrl]);

  const [userId, setUserId] = useState('');
  const [itemId, setItemId] = useState('');
  const [email, setEmail] = useState('new@example.com');
  const [name, setName] = useState('New User');

  const [authState, setAuthState] = useState<AuthState>({ status: 'idle' });
  const [log, setLog] = useState<any>(null);

  useEffect(() => {
    const existingToken = getCookie(AUTH_COOKIE_NAME);
    if (existingToken) {
      setAuthState({ status: 'authenticated', token: existingToken });
    }
    void authorize();
  }, [client]);

  async function authorize() {
    setAuthState({ status: 'pending' });
    const res = await client.login({ body: { login: 'test', password: 'test' } });
    if (res.status === 200) {
      document.cookie = `${AUTH_COOKIE_NAME}=${encodeURIComponent(res.body.token)}; path=/`;
      setAuthState({ status: 'authenticated', token: res.body.token });
    } else {
      setAuthState({ status: 'error', message: res.body?.message ?? 'Auth failed' });
    }
  }

  async function fetchUser() {
    if (authState.status !== 'authenticated') {
      setLog({ status: 401, body: { message: 'Authenticate first' } });
      return;
    }
    setLog({ loading: true });
    const res = await client.getUser({ params: { id: userId } });
    setLog(res);
  }

  async function createUser() {
    if (authState.status !== 'authenticated') {
      setLog({ status: 401, body: { message: 'Authenticate first' } });
      return;
    }
    setLog({ loading: true });
    const res = await client.createUser({ body: { email, name } });
    setLog(res);
  }

  async function fetchItem() {
    if (authState.status !== 'authenticated') {
      setLog({ status: 401, body: { message: 'Authenticate first' } });
      return;
    }
    setLog({ loading: true });
    const res = await client.getItem({ params: { id: itemId } });
    setLog(res);
  }

  return (
    <main style={{ maxWidth: 900 }}>
      <h1>Contracts demo (Next.js → BFF → Manager/Repo)</h1>

      <p>
        Start services:
        <code style={{ display: 'block', marginTop: 8, padding: 12, background: '#f6f6f6' }}>
          auth: http://localhost:3004/docs{"\n"}
          manager: http://localhost:3001/docs{"\n"}
          repo: http://localhost:3002/docs{"\n"}
          bff: http://localhost:3000/docs{"\n"}
          frontend: http://localhost:3003
        </code>
      </p>

      <section style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8, marginBottom: 16 }}>
        <h2>Auth</h2>
        <p style={{ margin: '8px 0' }}>
          Status:{" "}
          {authState.status === 'authenticated'
            ? `authenticated (token ${authState.token.slice(0, 8)}...)`
            : authState.status === 'pending'
            ? 'authenticating...'
            : authState.status === 'error'
            ? `failed: ${authState.message}`
            : 'idle'}
        </p>
        <button onClick={authorize} disabled={authState.status === 'pending'} style={{ padding: 10 }}>
          Re-authenticate (login: test / password: test)
        </button>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>GET /v1/users/:id</h2>
          <input
            placeholder="UUID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
          <button onClick={fetchUser} style={{ marginTop: 8, padding: 10 }}>
            Fetch user
          </button>
          <p style={{ color: '#666' }}>Tip: use the seeded UUID from Manager Swagger “Try it out”.</p>
        </div>

        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>POST /v1/users</h2>
          <input
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 8, marginBottom: 8 }}
          />
          <input
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
          <button onClick={createUser} style={{ marginTop: 8, padding: 10 }}>
            Create user
          </button>
        </div>

        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>GET /v1/items/:id</h2>
          <input
            placeholder="UUID"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={{ width: '100%', padding: 8 }}
          />
          <button onClick={fetchItem} style={{ marginTop: 8, padding: 10 }}>
            Fetch item
          </button>
          <p style={{ color: '#666' }}>Tip: use the seeded UUID from Repo Swagger “Try it out”.</p>
        </div>

        <div style={{ padding: 16, border: '1px solid #ddd', borderRadius: 8 }}>
          <h2>Swagger links</h2>
          <ul>
            <li><a href="http://localhost:3000/docs" target="_blank">BFF Swagger</a></li>
            <li><a href="http://localhost:3004/docs" target="_blank">Auth Swagger</a></li>
            <li><a href="http://localhost:3001/docs" target="_blank">Manager Swagger</a></li>
            <li><a href="http://localhost:3002/docs" target="_blank">Repo Swagger</a></li>
          </ul>
        </div>
      </section>

      <h2 style={{ marginTop: 24 }}>Latest response</h2>
      <pre style={{ padding: 16, background: '#111', color: '#eee', borderRadius: 8, overflowX: 'auto' }}>
{JSON.stringify(log, null, 2)}
      </pre>
    </main>
  );
}
