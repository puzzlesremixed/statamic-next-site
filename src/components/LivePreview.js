'use client';
import {useRouter} from "next/navigation";
import {useEffect} from "react";
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
    
    return null;
}