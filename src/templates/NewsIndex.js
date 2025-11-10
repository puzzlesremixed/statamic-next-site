import SearchBar from "@/components/Search";
import NewsPagination from "@/components/NewsPagination";
import {getCollectionEntries} from "@/lib/api";
import NewsCard from "@/components/NewsCard";

export default async function NewsIndex({data, params, searchParams}) {
    const collectionToFetch = data.source_collection.handle;
    if (!collectionToFetch) {
        throw 500;
    }
    const {page, search} = searchParams;
    const {data: entries, meta} = await getCollectionEntries(
        collectionToFetch,
        parseInt(page, 10) || 1,
        search || '',
        params.locale,
        params.token
    );

    return (
        <div className="container mx-auto p-4">
            <h1>{data.title || 'News'}</h1>
            <div
                className="prose lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{__html: data.content}}
            />
            <SearchBar/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.length
                    ? entries.map((article) => (
                        <NewsCard key={article.id} article={article} locale={params.locale}/>
                    ))
                    : 'No articles found.'
                }
            </div>
            <NewsPagination meta={meta}/>
        </div>
    );
}
