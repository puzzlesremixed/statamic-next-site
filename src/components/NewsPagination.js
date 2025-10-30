'use client';
import {useSearchParams} from 'next/navigation';
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink, PaginationNext,
    PaginationPrevious
} from "@/components/ui/pagination";

export default function NewsPagination({meta}) {
    const searchParams = useSearchParams();
    const {current_page, last_page, links} = meta || {};
    const createPageURL = (pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `/news?${params.toString()}`;
    };
    if (last_page > 1) {
        return (
            <Pagination>
                <PaginationContent>
                    {links.map((link, index) => {
                        // Handle Previous
                        if (link.label.includes("Previous")) {
                            return (
                                link.url && (
                                    <PaginationItem key={`prev-${index}`}>
                                        <PaginationPrevious href={createPageURL(link.page)}/>
                                    </PaginationItem>
                                )
                            );
                        }

                        if (link.label.includes("Next")) {
                            return (
                                link.url && (
                                    <PaginationItem key={`next-${index}`}>
                                        <PaginationNext href={createPageURL(link.page)}/>
                                    </PaginationItem>
                                )
                            );
                        }

                        // if (index > 5 && last_page > 5) {
                        //     return (<PaginationItem key={`page-${index}`}><PaginationEllipsis/></PaginationItem>)
                        // }

                        return (
                            <PaginationItem key={`page-${index}`}>
                                <PaginationLink
                                    href={createPageURL(link.page)}
                                    isActive={link.active}
                                >
                                    {link.label}
                                </PaginationLink>
                            </PaginationItem>
                        );
                    })}
                </PaginationContent>
            </Pagination>
        )
    }
}