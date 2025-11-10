import {redirect} from 'next/navigation'

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const token = searchParams.get('token')
    const url = searchParams.get('url')
    const preview = searchParams.get('preview')

    if (!token) {
        return new Response('Missing preview token', {status: 401})
    }
    const isPreview = preview == 'true' && Boolean(token)
    if (isPreview) {
        redirect(`${url}?token=${token}&preview=${preview}`)
    } else {
        redirect(url);
    }

}