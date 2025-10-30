import {getEntryBySlug} from "@/lib/api";
import {notFound} from 'next/navigation';
import {templates} from "@/app/data";

export default async function Page({params, searchParams}) {
    const {slug} = await params
    const {token, preview} = await searchParams
    const data = await getEntryBySlug({collection: 'pages', slug: slug.pop(), token: token, preview});

    if (!data) {
        notFound();
    } else {
        const Template = templates[(data.next_template.value || "default").toLowerCase()] || templates.default;
        return <Template data={data}/>;
    }
}