import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth-server';
import { isAppError } from '@/lib/errors';
import { imageService } from '@/services/image.service';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (session.role !== 'seller' && session.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }
    if (session.role === 'seller' && !session.approved) {
      return NextResponse.json({ error: 'Seller account is not approved yet' }, { status: 403 });
    }

    const formData = await request.formData();
    const files = formData
      .getAll('images')
      .filter((entry): entry is File => entry instanceof File && entry.size > 0);

    if (!files.length) {
      return NextResponse.json({ error: 'Add at least one image' }, { status: 400 });
    }

    const urls: string[] = [];
    for (const file of files) {
      const url = await imageService.upload(file, `properties/${session.id}`);
      urls.push(url);
    }

    return NextResponse.json({ urls });
  } catch (error) {
    if (isAppError(error)) {
      return NextResponse.json({ error: error.message }, { status: error.status });
    }
    console.error('Property image upload failed:', error);
    return NextResponse.json({ error: 'Image upload failed' }, { status: 500 });
  }
}
