import {Inter} from "next/font/google";
import LivePreview from "@/components/LivePreview";
import Layout from "@/layouts/default";
import {getAllSites} from "@/lib/api";
import "../globals.css";

const inter = Inter({subsets: ["latin"]});

export default async function LocaleLayout({children, params}) {
    const sites = await getAllSites();

    return (
        <html lang={params.locale}>
        <body className={inter.className}>
        <Layout sites={sites} currentLocale={params.locale}>
            {children}
            <LivePreview/>
        </Layout>
        </body>
        </html>
    );
}