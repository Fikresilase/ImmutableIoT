// src/lib/crypto.ts
import * as jose from 'jose';
import { SENSOR_PRIVATE_JWK, CLOUD_PUBLIC_JWK } from './keys';

// 1. SIGN (Used by Sensor / Browser)
export async function signPayload(payload: any) {
  // Import the static private key
  const privateKey = await jose.importJWK(SENSOR_PRIVATE_JWK, 'ES256');

  const jwt = await new jose.SignJWT(payload)
    .setProtectedHeader({ alg: 'ES256' })
    .setIssuedAt()
    .setIssuer('urn:sensor:sn-8392-ax')
    .sign(privateKey);
    
  return jwt;
}

// 2. EXPORT PUBLIC KEY (Used by Server Route)
export async function getPublicKey() {
  // Import the static public key
  const publicKey = await jose.importJWK(CLOUD_PUBLIC_JWK, 'ES256');
  return publicKey;
}
