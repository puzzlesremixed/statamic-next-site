import {getEntry} from "@/lib/api";
import {templates} from "@/app/data";
import LivePreview from "@/components/LivePreview";

export async function generateMetadata({params}) {
    const data = await getEntry(params.slug || [], params.locale);

    const title = data.meta_title || data.title;
    const description = data.meta_description || "Default description";

    return {
        title: title,
        description: description,
    };
}

export default async function DynamicPage({params, searchParams}) {
    const isPreview = searchParams.preview == 'true' && Boolean(searchParams.token)
    const data = await getEntry(params.slug || [], params.locale, searchParams.token);
    const Template =
        templates[data.next_template?.value || "default"] || templates.default;

    return (
        <>
            <Template data={data} params={params} searchParams={searchParams}/>
            {isPreview && <LivePreview/>}
        </>
    );
}