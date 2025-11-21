/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/sitemap.xml",
                destination: "/sitemap",
            },
            {
                source: "/sitemap_:lang-:page.xml",
                destination: "/sitemap/:lang/:page",
            },
            {
                source: "/sitemap_:lang.xml",
                destination: "/sitemap/:lang",
            },
        ];
    }
};

export default nextConfig;
