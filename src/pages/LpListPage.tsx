import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import apiClient from '../api/axios';
import type { LpItem } from '../types/lp';

export default function LpListPage() {
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
    const navigate = useNavigate();
    const { ref, inView } = useInView();

    const {
        data,
        isPending,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['lps', sort],
        queryFn: async ({ pageParam = 1 }) => {
            const order = sort === 'latest' ? 'desc' : 'asc';
            const response = await apiClient.get('/lps', { params: { order, page: pageParam, limit: 10 } });
            const resultData = response.data?.data;
            const lpArray = resultData?.data || resultData || [];

            return {
                items: lpArray as LpItem[],
                nextPage: lpArray.length > 0 ? pageParam + 1 : undefined,
                isLast: lpArray.length === 0 || lpArray.length < 10
            };
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.isLast) return undefined;
            return lastPage.nextPage;
        },
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    useEffect(() => {
        if (inView && hasNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, fetchNextPage]);

    const allLps = data?.pages.flatMap(page => page.items) || [];

    return (
        <div className="min-h-screen bg-slate-900 px-6 py-12 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                        LP 목록
                    </h1>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSort('latest')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sort === 'latest'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => setSort('oldest')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sort === 'oldest'
                                ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            오래된순
                        </button>
                    </div>
                </header>

                {isError ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-slate-800/50 rounded-2xl border border-rose-500/20">
                        <div className="text-rose-400 text-xl font-medium mb-6 text-center">
                            데이터를 불러오는 데 실패했습니다.<br />서버를 확인해주세요.
                        </div>
                        <button
                            onClick={() => refetch()}
                            className="px-6 py-3 bg-rose-500 hover:bg-rose-400 text-white font-bold rounded-xl shadow-lg shadow-rose-500/20 transition-all"
                        >
                            다시 시도
                        </button>
                    </div>
                ) : isPending ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <div key={i} className="aspect-[2/3] bg-slate-800 animate-pulse rounded-xl" />
                        ))}
                    </div>
                ) : allLps.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                            {allLps.map((lp) => (
                                <div
                                    key={lp.id}
                                    onClick={() => navigate(`/lp/${lp.id}`)}
                                    className="group relative aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-emerald-500/20"
                                >
                                    {lp.thumbnail ? (
                                        <img 
                                            src={lp.thumbnail} 
                                            alt={lp.title} 
                                            className="w-full h-full object-cover" 
                                            onError={(e) => {
                                                const target = e.target as HTMLImageElement;
                                                if (!target.src.includes('picsum.photos')) {
                                                    target.src = `https://picsum.photos/seed/${lp.id}/400/600`;
                                                }
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-slate-700 text-slate-500">
                                            No Image
                                        </div>
                                    )}

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <h3 className="text-white font-bold text-lg leading-tight mb-2 line-clamp-2">{lp.title}</h3>
                                        <div className="flex items-center justify-between text-xs font-medium">
                                            <span className="text-slate-300">{lp.createdAt?.split('T')[0] || 'Unknown Date'}</span>
                                            <span className="flex items-center gap-1 text-rose-400">
                                                ❤️ {lp.likes?.length || 0}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Trigger Element for Infinite Scroll */}
                        <div ref={ref} className="h-20 flex items-center justify-center mt-10">
                            {isFetchingNextPage && (
                                <div className="w-8 h-8 border-4 border-slate-600 border-t-emerald-500 rounded-full animate-spin"></div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        등록된 LP가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
