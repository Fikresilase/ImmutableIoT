import { NextRequest, NextResponse } from 'next/server';
import { verifyPayload } from '@/lib/crypto';

export async function POST(req: NextRequest) {
  try {
    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    const { valid, payload, error } = await verifyPayload(token);

    if (valid) {
      return NextResponse.json({ 
        status: 'secure', 
        data: payload,
        hash: token.substring(token.length - 12) 
      });
    } else {
      return NextResponse.json({ 
        status: 'compromised', 
        error: error?.toString(),
        hash: 'VERIFY_FAILED'
      });
    }
  } catch (error) {
    return NextResponse.json({ 
      status: 'error', 
      message: 'Internal server error' 
    }, { status: 500 });
  }
}
