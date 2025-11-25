/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/sitemap.xml",
                destination: "/sitemap",
            },
            {
                source: "/sitemap-:collection.xml",
                destination: "/sitemap/:collection",
            },
        ];
    }
};

export default nextConfig;
