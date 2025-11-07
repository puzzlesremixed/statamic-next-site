import DefaultLocalePage from "@/app/[...slug]/page";
export default async function Home(props) {
    const mergedProps = {
        ...props,
        params: { slug: [] },
        searchParams: props.searchParams || {},
    };

    return <DefaultLocalePage {...mergedProps} />;
}
