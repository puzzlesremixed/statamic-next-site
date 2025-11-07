import {draftMode} from 'next/headers'
import {redirect} from 'next/navigation'

export async function GET(request) {
    const {searchParams} = new URL(request.url)
    const token = searchParams.get('token')
    const slug = searchParams.get('slug')
    const preview = searchParams.get('preview')
    const locale = searchParams.get('locale')

    if (!token) {
        return new Response('Missing preview token', {status: 401})
    }

    draftMode().enable()
    // cookies().set('statamicToken', token)
    // if (collection) {
    //     redirect(`${collection}/${slug}`)
    // }
    if (locale != "default") {
        redirect(`/${slug}?token=${token}&preview=${preview}&handle=%${locale}`)
    } else {
        redirect(`${slug}?token=${token}&preview=${preview}`)

    }
}