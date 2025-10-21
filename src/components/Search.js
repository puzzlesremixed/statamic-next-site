'use client';

import {useSearchParams, useRouter, usePathname} from 'next/navigation';
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";

export default function SearchBar() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const handleSearch = (e) => {
        e.preventDefault();
        const params = new URLSearchParams(searchParams);
        const searchTerm = e.target.search.value;
        if (searchTerm) {
            params.set('search', searchTerm);
        } else {
            params.delete('search');
        }
        params.delete('page');
        router.replace(`${pathname}?${params.toString()}`);
    };

    return (
        <form onSubmit={handleSearch} className="mb-8 flex gap-2 items-center">
            <Input id="search" type="text"
                   name="search"
                   defaultValue={searchParams.get('search') || ''}
                   placeholder="Search articles..."/>

            <Button className="cursor-pointer">Search</Button>
        </form>
    );
}