import {getEntryBySlug} from '@/lib/api';
import {Fragment} from "react";
import Link from 'next/link';
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {CalendarDays, ArrowLeft} from "lucide-react";
import {Separator} from "@/components/ui/separator";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {draftMode} from "next/headers";
import LivePreview from "@/components/LivePreview";

export default async function NewsPage({params}) {
    const {slug} = await params
    const article = await getEntryBySlug({collection: 'news', slug: slug});
    const { isEnabled } = draftMode()
    if (!article) {
        return <div>Not found</div>;
    }

    return (
        <Fragment>
            {isEnabled && <LivePreview />}
        <div className="container mx-0 px-5">
            <div className="mb-6 flex items-center justify-between">
                <Link href="/news">
                    <Button variant="ghost" className="flex items-center gap-2">
                        <ArrowLeft className="h-4 w-4"/> Back
                    </Button>
                </Link>
                {article.category && <Badge className="capitalize">{article.category}</Badge>}
            </div>
            <div className="overflow-hidden">
                {article.image && (
                    <div className="relative h-80 w-full overflow-hidden">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="h-full w-full object-cover hover:scale-105 transition-transform duration-500"
                        />
                    </div>
                )}


                <CardHeader className="p-6">
                    <CardTitle className="text-3xl font-bold mb-2 leading-tight">{article.title}</CardTitle>
                    <div className="flex items-center gap-4 py-4">
                        <Avatar>
                            <AvatarImage src={article.author?.avatar} alt={article.author?.name}/>
                            <AvatarFallback>{article.author?.name?.[0] || '?'}</AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{article.author?.name}</p>
                            <p className="text-sm text-gray-500">Author</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 text-gray-500 text-sm">
                        <CalendarDays className="h-4 w-4"/>
                        <span>Last updated : {new Date(article.last_modified).toLocaleDateString()}</span> |
                        <span>{article.collection.title}</span>
                    </div>
                </CardHeader>
                <Separator/>
                <CardContent className="prose max-w-none p-6">
                    <div
                        dangerouslySetInnerHTML={{__html: article.content}}
                        className="text-gray-700 leading-relaxed"
                    />
                </CardContent>
            </div>
        </div>
        </Fragment>
    );
}