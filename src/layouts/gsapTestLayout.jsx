"use client";

import {forwardRef} from "react";
import GsapTestingPage from "@/components/GsapTestComponent";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Avatar} from "@/components/ui/avatar";

const GsapTestingLayout = forwardRef(({children}, ref) => {
    const featured = {
        title: "Rising Tides: Coastal Cities Plan New Defenses",
        excerpt: "City governments worldwide are accelerating plans to protect critical infrastructure as sea levels continue to rise.",
        author: "A. Reporter",
        time: "2 hours ago",
        image: "https://placehold.co/1000x600?text=Featured+Article",
    };


    const sideArticles = [{id: 1, title: "Market Snapshot: Stocks Close Higher", time: "1h"}, {
        id: 2, title: "Tech: New Battery Breakthrough", time: "3h"
    }, {id: 3, title: "Culture: City Festival Returns", time: "5h"},];
    return <div>
        <header className="w-full">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <article className="lg:col-span-2">
                        <Card className="overflow-visible pt-0">
                            <div className="relative h-64 sm:h-80 md:h-96">
                                <img
                                    src={featured.image}
                                    alt={featured.title}
                                    className="w-full h-full object-cover rounded-t-md"
                                />
                            </div>

                            <CardContent className="">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-2xl font-bold leading-tight">
                                        {featured.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-sm">
                                        {featured.excerpt}
                                    </CardDescription>
                                </CardHeader>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full">
                        {featured.author}
                      </span>
                                        </Avatar>
                                        <div className="text-sm">
                                            <div className="font-medium">{featured.author}</div>
                                            <div className="text-xs">{featured.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost">Save</Button>
                                        <Button>Read</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </article>

                    <aside>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">Latest</h2>
                                <a href="#" className="text-sm">
                                    See all
                                </a>
                            </div>

                            <div className="space-y-3">
                                {sideArticles.map((a) => (<Card key={a.id} className="p-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{a.title}</h3>
                                            <div className="text-xs mt-1">{a.time}</div>
                                        </div>
                                        <div className="w-20 h-12 shrink-0">
                                            <img
                                                src={`https://placehold.co/160x96?text=Img+${a.id}`}
                                                alt={a.title}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    </div>
                                </Card>))}
                            </div>

                            <div>
                                <Card className="p-4">
                                    <h4 className="text-sm font-semibold">Editor's Picks</h4>
                                    <p className="text-xs mt-2">Curated reads chosen by our editors.</p>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm">View Picks</Button>
                                        <Button size="sm" variant="ghost">
                                            Browse Topics
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </header>
        <GsapTestingPage ref={ref}>{children}</GsapTestingPage>
        <header className="w-full">
            <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <article className="lg:col-span-2">
                        <Card className="overflow-visible pt-0">
                            <div className="relative h-64 sm:h-80 md:h-96">
                                <img
                                    src={featured.image}
                                    alt={featured.title}
                                    className="w-full h-full object-cover rounded-t-md"
                                />
                            </div>

                            <CardContent className="">
                                <CardHeader className="p-0">
                                    <CardTitle className="text-2xl font-bold leading-tight">
                                        {featured.title}
                                    </CardTitle>
                                    <CardDescription className="mt-2 text-sm">
                                        {featured.excerpt}
                                    </CardDescription>
                                </CardHeader>

                                <div className="mt-4 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <Avatar>
                      <span className="inline-flex items-center justify-center h-8 w-8 rounded-full">
                        {featured.author}
                      </span>
                                        </Avatar>
                                        <div className="text-sm">
                                            <div className="font-medium">{featured.author}</div>
                                            <div className="text-xs">{featured.time}</div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <Button variant="ghost">Save</Button>
                                        <Button>Read</Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </article>

                    <aside>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-base font-semibold">Latest</h2>
                                <a href="#" className="text-sm">
                                    See all
                                </a>
                            </div>

                            <div className="space-y-3">
                                {sideArticles.map((a) => (<Card key={a.id} className="p-3">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-1">
                                            <h3 className="text-sm font-medium">{a.title}</h3>
                                            <div className="text-xs mt-1">{a.time}</div>
                                        </div>
                                        <div className="w-20 h-12 shrink-0">
                                            <img
                                                src={`https://placehold.co/160x96?text=Img+${a.id}`}
                                                alt={a.title}
                                                className="w-full h-full object-cover rounded"
                                            />
                                        </div>
                                    </div>
                                </Card>))}
                            </div>

                            <div>
                                <Card className="p-4">
                                    <h4 className="text-sm font-semibold">Editor's Picks</h4>
                                    <p className="text-xs mt-2">Curated reads chosen by our editors.</p>
                                    <div className="mt-3 flex gap-2">
                                        <Button size="sm">View Picks</Button>
                                        <Button size="sm" variant="ghost">
                                            Browse Topics
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </header>
    </div>;
});

export default GsapTestingLayout;
