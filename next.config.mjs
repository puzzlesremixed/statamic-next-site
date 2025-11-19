/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
        return [
            {
                source: "/sitemap_:locale.xml",
                destination: "/sitemap/:locale",
            },
        ];
    },
};

export default nextConfig;
