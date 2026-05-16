export default function HomePage() {
    return (
        <div className="flex flex-col h-[80vh] items-center justify-center text-center px-6">
            <div className="w-fit">
                <h1 className="text-5xl md:text-7xl font-black tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(201,162,39,0.25)]">
                    LPWORLD
                </h1>
                <div className="mt-4 h-0.5 w-full rounded-full bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
            </div>
        </div>
    );
}
