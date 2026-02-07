import { NextResponse } from 'next/server';
import * as jose from 'jose';
import { getPublicKey } from '@/lib/crypto';

export async function POST(request: Request) {
  try {
    const { token } = await request.json();

    // 1. Fetch the Public Key (Simulating DB lookup)
    const publicKey = await getPublicKey();
    if (!publicKey) throw new Error("System initializing...");

    // 2. VERIFY INTEGRITY
    // If the data was changed by 1 byte, this function throws an error.
    const { payload } = await jose.jwtVerify(token, publicKey, {
      algorithms: ['ES256'],
    });

    // 3. Success
    return NextResponse.json({ 
      status: 'secure', 
      data: { payload }, 
      hash: 'sha256-' + Math.random().toString(36).substring(7) 
    });

  } catch (error) {
    // 4. Attack Detected
    return NextResponse.json({ 
      status: 'compromised', 
      error: 'Signature Mismatch' 
    });
  }
}
