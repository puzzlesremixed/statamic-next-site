import Link from "next/link";
import {Button} from "@/components/ui/button";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function Layout({sites, currentLocale, children}) {
    return (
        <div className="flex flex-col min-h-screen bg-white text-gray-900">
            <header className="border-b border-gray-200 bg-white sticky top-0 z-50">
                <div className="container mx-auto flex items-center justify-between px-4 py-3">

                    <Link href="/" className="text-xl font-semibold tracking-tight">
                        Site
                    </Link>

                    <nav className="hidden md:flex items-center gap-6">
                        <Link href="/news" className="hover:text-yellow-600 transition">
                            News
                        </Link>
                        <Link href="/categories" className="hover:text-yellow-600 transition">
                            Categories
                        </Link>
                        <Link href="/about" className="hover:text-yellow-600 transition">
                            About
                        </Link>
                        <LanguageSwitcher sites={sites} currentLocale={currentLocale}/>
                    </nav>
                </div>
            </header>

            <main className="flex-1 container mx-auto px-4 py-6 min-h-screen">{children}</main>

            <footer className="border-t border-gray-200 bg-gray-50 text-gray-700 py-6 mt-auto">
                <div
                    className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-2 text-sm">
                    <p>&copy; {new Date().getFullYear()} Site. All rights reserved.</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-yellow-600">
                            Privacy
                        </Link>
                        <Link href="/terms" className="hover:text-yellow-600">
                            Terms
                        </Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
