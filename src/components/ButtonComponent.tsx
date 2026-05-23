import React from 'react';

interface PaginationProps {
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
}

export default function ButtonComponent({ page, totalPages, setPage }: PaginationProps) {
    return (
        <div className="flex items-center justify-center gap-3 md:gap-4 pb-10 mt-16">
            <button
                onClick={() => setPage(1)}
                disabled={page === 1}
                className="px-4 py-3 rounded-xl font-semibold text-slate-900 bg-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed hover:bg-amber-300 hover:-translate-y-1 active:translate-y-0"
            >
                맨 앞
            </button>

            <button
                onClick={() => setPage((prev) => prev - 1)}
                disabled={page === 1}
                className="px-5 py-3 rounded-xl font-semibold text-slate-900 bg-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed hover:bg-amber-300 hover:-translate-y-1 active:translate-y-0"
            >
                이전
            </button>

            <div className="flex flex-col items-center justify-center h-[50px] rounded-full bg-slate-800 border border-slate-700 shadow-inner px-6 mx-2">
                <span className="font-bold text-lg text-amber-400 leading-none">
                    {page} <span className="text-slate-500 font-normal">/ {totalPages}</span>
                </span>
            </div>

            <button
                onClick={() => setPage((prev) => prev + 1)}
                disabled={page >= totalPages}
                className="px-5 py-3 rounded-xl font-semibold text-slate-900 bg-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed hover:bg-amber-300 hover:-translate-y-1 active:translate-y-0"
            >
                다음
            </button>

            <button
                onClick={() => setPage(totalPages)}
                disabled={page >= totalPages}
                className="px-4 py-3 rounded-xl font-semibold text-slate-900 bg-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.3)] transition-all duration-300 disabled:bg-slate-700 disabled:text-slate-500 disabled:shadow-none disabled:cursor-not-allowed hover:bg-amber-300 hover:-translate-y-1 active:translate-y-0"
            >
                맨 뒤
            </button>
        </div>
    );
}
