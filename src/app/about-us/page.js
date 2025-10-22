import {getEntryBySlug} from "@/lib/api";

export default async function Home() {
    const data = await getEntryBySlug({ collection: 'pages', slug: 'about-us' });

    if (!data) {
        return <div>Not found</div>;
    }

    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-5xl font-bold mb-4">{data.title}</h1>
                <div
                    className="prose lg:prose-xl max-w-none"
                    dangerouslySetInnerHTML={{ __html: data.content }}
                />
            </div>
        </>
    );
}