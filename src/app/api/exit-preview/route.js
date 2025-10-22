import { draftMode } from 'next/headers';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function GET(request) {
    draftMode().disable();
    cookies().delete('statamicToken');
    const redirectPath = request.headers.get('referer') || '/';
    redirect(redirectPath);
}