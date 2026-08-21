import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json([
    {
      type: 'video',
      src: '/media/videos/megal.mp4',
    },
  ], {
    headers: {
      'Cache-Control': 'no-store, max-age=0',
    },
  })
}
