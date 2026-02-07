import { SignJWT, jwtVerify, importJWK } from 'jose';

// In a real app, these would be managed securely.
// For this demo, we use a fixed key pair to simulate the device and cloud relationship.
const privateKeyJwk = {
  kty: 'EC',
  x: 'we7jO-m_3EPH7jHpqT5mR6vjM3f2T-j7p7XmYVz-E_s',
  y: '9-z5-S_s-z-j-S_s-z-j-S_s-z-j-S_s-z-j-S_s-z-k', // Placeholder, using actual generated keys is better
  crv: 'P-256',
  d: 'test-private-key-d', // Placeholder
};

const publicKeyJwk = {
  kty: 'EC',
  x: 'we7jO-m_3EPH7jHpqT5mR6vjM3f2T-j7p7XmYVz-E_s',
  y: '9-z5-S_s-z-j-S_s-z-j-S_s-z-j-S_s-z-j-S_s-z-k',
  crv: 'P-256',
};

// For the demo, we'll generate a fresh key pair or use a secret string for simplicity if JWK is overkill
// Actually, let's use a simple secret for the demo to avoid complex ECC key generation steps, 
// but well-documented as "Device Private Key".
const SECRET = new TextEncoder().encode('hydro-guard-device-secret-key-12345');

export async function signPayload(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('2h')
    .sign(SECRET);
}

export async function verifyPayload(token: string) {
  try {
    const { payload } = await jwtVerify(token, SECRET, {
      algorithms: ['HS256'],
    });
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, error };
  }
}
