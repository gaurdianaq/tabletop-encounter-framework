import type { AppRouter } from 'beyond-cyberpunk-red-trpc/dist/client.mjs';
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';

export default function Home() {
  return <main className="flex min-h-screen flex-col items-center justify-between p-24"></main>;
}
