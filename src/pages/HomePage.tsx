export default function HomePage() {
    return (
        <div className="flex flex-col h-[80vh] items-center justify-center text-center gap-6 px-6">
            <h1 className="text-5xl md:text-7xl font-black tracking-[0.15em] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-[0_0_25px_rgba(201,162,39,0.25)]">
                LPWORLD
            </h1>
            <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide">
                당신만의 플레이리스트를 돌려보세요
            </p>
            <div className="mt-2 h-px w-40 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
        </div>
    );
}
