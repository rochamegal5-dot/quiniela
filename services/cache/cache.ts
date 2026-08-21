type Item<T> = {
  value: T;
  expires: number;
};

const cache = new Map<string, Item<any>>();

export function get<T>(key: string): T | null {

  const item = cache.get(key);

  if (!item) return null;

  if (Date.now() > item.expires) {

    cache.delete(key);

    return null;

  }

  return item.value;

}

export function put<T>(
  key: string,
  value: T,
  ttl = 60000
) {

  cache.set(key, {

    value,

    expires: Date.now() + ttl,

  });

}
