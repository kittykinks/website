export default function ErrorScreen({ error }: { error?: string }) {
    return (
        <main className="h-screen flex flex-col items-center justify-center gap-2">
            <h1 className="text-4xl font-bold font-cherry">
                An Error Occurred!
            </h1>
            {error && <p>{error}</p>}
        </main>
    );
}
