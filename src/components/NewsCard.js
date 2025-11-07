import Link from 'next/link';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function NewsCard({article, locale}) {
    const articleUrl = `/${locale}/${article.collection.handle}/${article.slug}`;

    return (
        <Link href={articleUrl}>
            <Card>
                <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                </CardHeader>
                <CardFooter>
                    <CardDescription>{article.collection.title}</CardDescription>
                </CardFooter>
            </Card>
        </Link>
    );
}
