import {getEntry} from "@/lib/api";
import {templates} from "@/app/data";

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
    const data = await getEntry(params.slug || [], params.locale);
    const Template =
        templates[data.next_template?.value || "default"] || templates.default;

    return (
        <>
            <Template data={data} params={params} searchParams={searchParams}/>
        </>
    );
}