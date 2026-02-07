// src/lib/keys.ts

// 1. The Sensor's Secret (Private Key)
// This is a valid P-256 Elliptic Curve Key.
export const SENSOR_PRIVATE_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: 'MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4',
  y: '4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM',
  d: '870MB6gfuTJ4HtUnUvYMyJpr5eUZNP4Bk43bVdj3eAE', // <--- This is the secret
  use: 'sig',
  alg: 'ES256',
};

// 2. The Cloud's Verification Key (Public Key)
// This must match the X and Y from above, but WITHOUT the 'd' (private) part.
export const CLOUD_PUBLIC_JWK = {
  kty: 'EC',
  crv: 'P-256',
  x: 'MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4',
  y: '4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM',
  use: 'sig',
  alg: 'ES256',
};
