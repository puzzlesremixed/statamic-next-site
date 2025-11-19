import DynamicPage from "@/app/[locale]/[[...slug]]/page";

export default async function Home(props) {
    const mergedProps = {
        ...props,
        params: { slug: [] },
        searchParams: props.searchParams || {},
    };
    
    return <DynamicPage {...mergedProps} />;
}
