"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export default function LanguageSwitcher({ sites, currentLocale }) {
    const router = useRouter();
    const pathname = usePathname();

    const [translationUrls, setTranslationUrls] = useState({});
    const [isLoading, setIsLoading] = useState(true);

    const currentSite = sites.find((site) => site.short_locale === currentLocale);

    useEffect(() => {
        if (!pathname || !currentLocale) return;
        setIsLoading(true);

        fetch("/api/translations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ pathname, currentLocale }),
        })
            .then((res) => (res.ok ? res.json() : Promise.reject(res)))
            .then((data) => setTranslationUrls(data))
            .catch(() => {
                const fallbackUrls = {};
                sites.forEach((site) => {
                    fallbackUrls[site.short_locale] = `/${site.short_locale}`;
                });
                setTranslationUrls(fallbackUrls);
            })
            .finally(() => setIsLoading(false));
    }, [pathname, sites, currentLocale]);

    const handleLocaleChange = (newLocale) => {
        // Redirect to the default locale URL without the prefix
        if (newLocale === process.env.NEXT_PUBLIC_DEFAULT_LOCALE) {
            router.push(translationUrls[newLocale] || '/');
            return;
        }
        const newPath = translationUrls[newLocale] || `/${newLocale}`;
        router.push(newPath);
    };

    return (
        <div className="language-switcher w-40">
            <Select
                value={currentLocale || ""}
                onValueChange={handleLocaleChange}
                disabled={isLoading}
            >
                <SelectTrigger
                    className="w-full border-gray-300 focus:border-yellow-400 focus:ring-yellow-400 text-sm">
                    <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                    {sites.map((site) => (
                        <SelectItem
                            key={site.handle}
                            value={site.short_locale}
                            disabled={!isLoading && !translationUrls[site.short_locale]}
                        >
                            {site.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}