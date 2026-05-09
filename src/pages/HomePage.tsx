export default function HomePage() {
    return (
        <div className="flex flex-col h-[80vh] items-center justify-center text-center gap-6">
            <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight drop-shadow-md">
                당신만의 플레이리스트, <span className="text-emerald-400">돌려돌려LP판</span>
            </h1>
            <p className="text-xl text-zinc-400 font-medium mt-2">
                세상의 모든 LP를 만나보세요 🎧
            </p>
        </div>
    );
}