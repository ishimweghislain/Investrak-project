
import { NextRequest, NextResponse } from 'next/server';
import { verifyAuth } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(req: NextRequest) {
    const auth = await verifyAuth(req);
    if (!auth || auth.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await req.formData();
        const file = formData.get('file') as File;

        if (!file) {
            return NextResponse.json({ message: 'No file uploaded' }, { status: 400 });
        }

        // Limit file size to 2MB for Base64 storage
        if (file.size > 2 * 1024 * 1024) {
            return NextResponse.json({ message: 'File too large (max 2MB)' }, { status: 400 });
        }

        const buffer = await file.arrayBuffer();
        const base64 = Buffer.from(buffer).toString('base64');
        const dataUrl = `data:${file.type};base64,${base64}`;

        // Return the Data URL which can be stored directly in the database
        return NextResponse.json({ url: dataUrl });
    } catch (e: any) {
        console.error('Upload Error:', e);
        return NextResponse.json({ message: 'Upload failed', error: e.message }, { status: 500 });
    }
}
