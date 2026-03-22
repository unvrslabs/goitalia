import { LRUCache } from "lru-cache";

type RateLimitOptions = {
  windowMs: number;
  max: number;
};

export function createRateLimiter(options: RateLimitOptions) {
  const cache = new LRUCache<string, number[]>({
    max: 10000,
    ttl: options.windowMs,
  });

  return function check(key: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const windowStart = now - options.windowMs;
    const requests = (cache.get(key) ?? []).filter((t) => t > windowStart);

    if (requests.length >= options.max) {
      return { allowed: false, remaining: 0 };
    }

    requests.push(now);
    cache.set(key, requests);
    return { allowed: true, remaining: options.max - requests.length };
  };
}

export const signinLimiter = createRateLimiter({ windowMs: 60_000, max: 5 });
export const passwordResetLimiter = createRateLimiter({ windowMs: 3_600_000, max: 3 });
export const resendVerifyLimiter = createRateLimiter({ windowMs: 3_600_000, max: 3 });
