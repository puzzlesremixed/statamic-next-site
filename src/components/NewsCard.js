import Link from 'next/link';
import {Card, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function NewsCard({article, locale}) {

    return (
        <Link href={article.url}>
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
