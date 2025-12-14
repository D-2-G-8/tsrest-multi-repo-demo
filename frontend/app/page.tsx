'use client';

import React, { useMemo, useState } from 'react';
import { initClient } from '@ts-rest/core';
import { bffFrontendContract } from '@acme/contracts';

type ApiResponse<T> = { ok: true; data: T } | { ok: false; error: any };

export default function Page() {
  const baseUrl = process.env.NEXT_PUBLIC_BFF_URL || 'http://localhost:3000';

  const client = useMemo(() => {
    return initClient(bffFrontendContract, { baseUrl });
  }, [baseUrl]);

  const [userId, setUserId] = useState('');
  const [itemId, setItemId] = useState('');
  const [email, setEmail] = useState('new@example.com');
  const [name, setName] = useState('New User');

  const [log, setLog] = useState<any>(null);

  async function fetchUser() {
    setLog({ loading: true });
    const res = await client.getUser({ params: { id: userId } });
    setLog(res);
  }

  async function createUser() {
    setLog({ loading: true });
    const res = await client.createUser({ body: { email, name } });
    setLog(res);
  }

  async function fetchItem() {
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
          manager: http://localhost:3001/docs{"\n"}
          repo: http://localhost:3002/docs{"\n"}
          bff: http://localhost:3000/docs{"\n"}
          frontend: http://localhost:3003
        </code>
      </p>

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
