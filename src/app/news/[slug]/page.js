import {getEntryBySlug} from '@/lib/api';

export default async function NewsPage({params}) {
    const {slug} = await params
    const article = await getEntryBySlug({collection:'news', slug: slug});

    if (!article) {
        return <div>Not found</div>;
    }

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-5xl font-bold mb-4">{article.title}</h1>
            <div
                className="prose lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{__html: article.content}}
            />
        </div>
    );
}