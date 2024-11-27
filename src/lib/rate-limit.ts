import { LRUCache } from 'lru-cache';
import { NextRequest } from 'next/server';

export interface RateLimitOptions {
  interval: number;
  uniqueTokenPerInterval: number;
}

export function rateLimit(options: RateLimitOptions) {
  const tokenCache = new LRUCache({
    max: options.uniqueTokenPerInterval || 500,
    ttl: options.interval || 60000,
  });

  return {
    check: async (request: NextRequest, limit: number) => {
      const ip = request.headers.get('x-forwarded-for') || 'anonymous';
      const tokenCount = (tokenCache.get(ip) as number[]) || [0];
      
      if (tokenCount[0] === 0) {
        tokenCache.set(ip, [1]);
        return Promise.resolve();
      }
      
      if (tokenCount[0] >= limit) {
        return Promise.reject(new Error('Rate limit exceeded'));
      }

      tokenCount[0] += 1;
      tokenCache.set(ip, tokenCount);
      return Promise.resolve();
    },
  };
} 