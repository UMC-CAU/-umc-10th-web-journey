import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useInView } from 'react-intersection-observer';
import apiClient from '../api/axios';
import useThrottle from '../hooks/useThrottle';
import type { LpItem } from '../types/lp';

const PAGE_SIZE = 10;

type PageData = {
    items: LpItem[];
    nextCursor: number | undefined;
    hasNext: boolean;
};

async function fetchLps({
    pageParam,
    order,
    search,
}: {
    pageParam: number;
    order: string;
    search?: string;
}): Promise<PageData> {
    const response = await apiClient.get('/lps', {
        params: {
            order,
            limit: PAGE_SIZE,
            ...(pageParam ? { cursor: pageParam } : {}),
            ...(search ? { search } : {}),
        },
    });
    const result = response.data?.data ?? {};
    const items = (result.data ?? result ?? []) as LpItem[];
    return {
        items,
        nextCursor: result.nextCursor as number | undefined,
        hasNext:
            typeof result.hasNext === 'boolean'
                ? result.hasNext
                : items.length === PAGE_SIZE,
    };
}

const LpCardSkeleton = () => (
    <div className="aspect-[2/3] bg-slate-800 animate-pulse rounded-xl" />
);

export default function LpListPage() {
    const [sort, setSort] = useState<'latest' | 'oldest'>('latest');
    const navigate = useNavigate();
    const { ref, inView } = useInView();
    const throttledInView = useThrottle(inView, 1000);

    // Navbar에서 URL에 기록한 검색어를 읽어옴 (이미 300ms 디바운스 적용된 값)
    const [searchParams] = useSearchParams();
    const debouncedQuery = searchParams.get('q') ?? '';
    const isSearchMode = debouncedQuery.trim().length > 0;

    // 전체 LP 목록 쿼리 (검색 없을 때)
    const allLpsQuery = useInfiniteQuery({
        queryKey: ['lps', sort] as const,
        queryFn: ({ pageParam }) =>
            fetchLps({ pageParam: pageParam as number, order: sort === 'latest' ? 'desc' : 'asc' }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: !isSearchMode,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
    });

    // 검색 쿼리 — 빈 문자열/공백이면 enabled: false로 요청 차단
    const searchQueryResult = useInfiniteQuery({
        queryKey: ['search', debouncedQuery] as const,
        queryFn: ({ pageParam }) =>
            fetchLps({
                pageParam: pageParam as number,
                order: 'desc',
                search: debouncedQuery.trim(),
            }),
        initialPageParam: 0,
        getNextPageParam: (lastPage) =>
            lastPage.hasNext ? lastPage.nextCursor : undefined,
        enabled: isSearchMode,
        staleTime: 1000 * 60 * 3,
        gcTime: 1000 * 60 * 5,
    });

    const {
        data,
        isPending,
        isFetching,
        isError,
        refetch,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = isSearchMode ? searchQueryResult : allLpsQuery;

    // enabled:false 일 때 isPending이 true가 되는 React Query 특성 보정
    const isLoading = isPending && isFetching;

    useEffect(() => {
        if (throttledInView && hasNextPage) {
            console.log('[useThrottle] fetchNextPage →', new Date().toLocaleTimeString());
            fetchNextPage();
        }
    // isFetchingNextPage를 deps에서 제외: fetch 완료 시 effect 재실행을 막아 throttle이 실제로 동작하게 함
    // React Query의 fetchNextPage는 fetch 중 중복 호출을 내부에서 무시하므로 안전
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [throttledInView, hasNextPage, fetchNextPage]);

    const allLps = useMemo(() => {
        const seen = new Set<number>();
        return (data?.pages.flatMap((page) => page.items) ?? []).filter((lp) => {
            if (seen.has(lp.id)) return false;
            seen.add(lp.id);
            return true;
        });
    }, [data]);

    return (
        <div className="min-h-screen bg-slate-900 px-6 py-12 md:px-12 lg:px-20">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md">
                            LP 목록
                        </h1>
                        {isSearchMode && (
                            <p className="mt-2 text-slate-400 text-sm">
                                "{debouncedQuery}" 검색 결과
                            </p>
                        )}
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setSort('latest')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sort === 'latest'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                                }`}
                        >
                            최신순
                        </button>
                        <button
                            onClick={() => setSort('oldest')}
                            className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${sort === 'oldest'
                                ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/30'
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
                ) : isLoading ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
                            <LpCardSkeleton key={`init-skel-${i}`} />
                        ))}
                    </div>
                ) : allLps.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                            {allLps.map((lp) => (
                                <div
                                    key={lp.id}
                                    onClick={() => navigate(`/lp/${lp.id}`)}
                                    className="group relative aspect-[2/3] bg-slate-800 rounded-xl overflow-hidden cursor-pointer transition-transform duration-300 hover:scale-105 hover:z-10 hover:shadow-2xl hover:shadow-amber-500/20"
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

                            {isFetchingNextPage &&
                                Array.from({ length: PAGE_SIZE }).map((_, i) => (
                                    <LpCardSkeleton key={`next-skel-${i}`} />
                                ))}
                        </div>

                        <div ref={ref} className="h-10 w-full mt-10" />
                    </>
                ) : isSearchMode ? (
                    <div className="text-center py-20 text-slate-400">
                        "{debouncedQuery}"에 대한 검색 결과가 없습니다.
                    </div>
                ) : (
                    <div className="text-center py-20 text-slate-400">
                        등록된 LP가 없습니다.
                    </div>
                )}
            </div>
        </div>
    );
}
