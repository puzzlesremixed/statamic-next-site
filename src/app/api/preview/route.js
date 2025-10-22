import {draftMode} from 'next/headers'
import {cookies} from 'next/headers'
import {redirect} from 'next/navigation'

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const token = searchParams.get('token')
    const redirectUrl = searchParams.get('redirect')
    const slug = searchParams.get('slug')
    const collection = searchParams.get('collection')

    if (!token) {
        return new Response('Missing preview token', {status: 401})
    }

    draftMode().enable()
    cookies().set('statamicToken', token)
    // if (collection) {
    //     redirect(`${collection}/${slug}`)
    // }
    redirect(slug)
}