import { webcrypto } from 'node:crypto';

// Node versions below 19 don't expose Web Crypto as a global, which TypeORM
// needs. Import this before AppModule so it's in place first.
if (!globalThis.crypto) {
  (globalThis as unknown as { crypto: Crypto }).crypto = webcrypto as Crypto;
}
