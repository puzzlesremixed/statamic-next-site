export default function Layout({ data }) {
    const { title, content } = data;

    return (
        <div className="container mx-auto p-4">
            <h1>layout template</h1>
            <h1 className="text-5xl font-bold mb-4">{title}</h1>
            <div
                className="prose lg:prose-xl max-w-none"
                dangerouslySetInnerHTML={{ __html: content }}
            />
        </div>
    );
}
