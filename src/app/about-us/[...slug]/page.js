import {getEntryByUri} from "@/lib/api";
import { notFound } from 'next/navigation';

export default async function AboutSubPage({ params }) {
    const fullUri = `about-us/${(await params).slug.join('/')}`;
    const data = await getEntryByUri({ collection: 'pages', uri: fullUri });
    
    if (!data) {
        notFound();
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
            <div
                className="prose lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: data.content }}
            />
        </div>
    );
}