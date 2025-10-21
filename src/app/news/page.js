import {getCollectionEntries} from '@/lib/api';
import NewsCard from '@/components/NewsCard';
import SearchBar from '@/components/Search';
import NewsPagination from "@/components/NewsPagination";


export default async function NewsIndex({searchParams}) {
    const {page, search} = await searchParams;
    const {data: news, meta} = await getCollectionEntries('news',parseInt(page, 10) || 1, search);
    return (
        <div className="container mx-auto p-4">
            <SearchBar/>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {news.length ?
                    news.map((article) => (
                        <NewsCard key={article.id} article={article}/>
                    )) : 'No articles found.'
                }
            </div>
            <NewsPagination meta={meta}/>
        </div>
    );
}