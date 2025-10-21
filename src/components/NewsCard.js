import Link from 'next/link';
import {Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";

export default function NewsCard({article}) {
    return (
        <Link href={`/news/${article.slug}`}>
            <Card>
                <CardHeader>
                    <CardTitle>{article.title}</CardTitle>
                    {/*<CardDescription>{article.summary}</CardDescription>*/}
                </CardHeader>
                <CardFooter>
                    <CardDescription>{article.collection.title}</CardDescription>
                </CardFooter>
            </Card>
        </Link>

    );
}