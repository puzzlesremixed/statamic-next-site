'use client';
import {useRouter} from "next/navigation";
import {useEffect} from "react";
import {Button} from "@/components/ui/button";
import {ScanEye} from "lucide-react";
import Link from 'next/link';
import {Card} from "@/components/ui/card";

export default function LivePreview() {
    const router = useRouter();

    useEffect(() => {
        const handleMessage = (event) => {
            if (event.data.name === 'statamic.preview.updated') {
                router.refresh();
            }
        };

        window.addEventListener('message', handleMessage);
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, [router]);
    return (
        <Card className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[9999] w-[90%] max-w-2xl
                flex flex-row items-center justify-between border px-4 py-3 rounded-2xl shadow-lg bg-cyan-200">
            <div className="flex items-center gap-2">
                <ScanEye className="w-5 h-5 text-gray-800"/>
                <p className="font-medium text-sm">
                    Currently viewing <span className="font-semibold">unpublished content</span>.
                </p>
            </div>

            <Button
                asChild
                size="sm"
                className="cursor-pointer"
            >
                <Link href="/api/exit-preview">Quit Preview Mode</Link>
            </Button>
        </Card>
    );
}