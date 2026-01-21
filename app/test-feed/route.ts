import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
    console.log('[Test Feed] Hit!');
    return new NextResponse('Hello World', { status: 200 });
}
