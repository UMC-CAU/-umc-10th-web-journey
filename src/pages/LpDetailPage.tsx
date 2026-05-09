import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/axios';
import type { LpItem } from '../types/lp';

export default function LpDetailPage() {
    const { lpid } = useParams<{ lpid: string }>();
    const navigate = useNavigate();

    const { data: lp, isPending, isError, refetch } = useQuery({
        queryKey: ['lp', lpid],
        queryFn: async () => {
            const response = await apiClient.get(`/lps/${lpid}`);
            return (response.data?.data || response.data) as LpItem;
        },
        enabled: !!lpid,
    });

    if (isError) {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-black px-6 py-12 md:px-12 lg:px-20 flex items-center justify-center">
                <div className="w-full max-w-7xl flex flex-col items-center justify-center py-20 bg-zinc-900/50 rounded-2xl border border-rose-500/20">
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
            </div>
        );
    }

    if (isPending || !lp) {
        return (
            <div className="min-h-[calc(100vh-72px)] bg-black px-6 py-12 md:px-12 lg:px-20 flex items-center justify-center">
                <div className="w-full max-w-7xl py-20">
                    <div className="flex justify-center">
                        <div className="w-16 h-16 border-4 border-zinc-800 border-t-emerald-500 rounded-full animate-spin"></div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-[calc(100vh-72px)] bg-black px-4 py-8 flex justify-center">
            {/* Card Container similar to the image */}
            <div className="w-full max-w-3xl bg-[#232428] rounded-[2rem] p-8 md:p-12 shadow-2xl">

                {/* Header: User Profile and Date */}
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-emerald-500 flex items-center justify-center overflow-hidden">
                            <span className="text-white text-xs font-bold">LP</span>
                        </div>
                        <span className="text-zinc-200 font-bold text-lg">익명 사용자</span>
                    </div>
                    <span className="text-zinc-400 font-medium text-sm">
                        {lp.uploadDate?.split('T')[0] || 'Unknown Date'}
                    </span>
                </div>

                {/* Title and Actions */}
                <div className="flex items-start justify-between mb-12">
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white tracking-tight">
                        {lp.title}
                    </h1>
                    <div className="flex items-center gap-4 text-zinc-400 shrink-0 mt-1">
                        <button className="hover:text-emerald-400 transition-colors" aria-label="수정">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path></svg>
                        </button>
                        <button className="hover:text-rose-400 transition-colors" aria-label="삭제">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Spinning Vinyl Record Player */}
                <div className="flex justify-center mb-12">
                    <div className="w-64 h-64 md:w-80 md:h-80 bg-zinc-900 rounded-full shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden flex items-center justify-center animate-[spin_5s_linear_infinite]">
                        {lp.thumbnail ? (
                            <img src={lp.thumbnail} alt={lp.title} className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-zinc-800 to-zinc-700 flex items-center justify-center text-zinc-500 font-bold">
                                NO IMAGE
                            </div>
                        )}
                        {/* Vinyl Grooves Overlay */}
                        <div className="absolute inset-0 rounded-full border-[20px] border-black/30 pointer-events-none"></div>
                        <div className="absolute inset-0 rounded-full border-[40px] border-black/20 pointer-events-none"></div>

                        {/* Center Hole */}
                        <div className="relative w-16 h-16 bg-[#232428] rounded-full shadow-inner border-2 border-zinc-900/50 z-10 flex items-center justify-center">
                            <div className="w-3 h-3 bg-black rounded-full"></div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="text-zinc-300 text-lg leading-relaxed mb-10 text-center max-w-2xl mx-auto font-medium">
                    {lp.content || '내용이 없습니다.'}
                </div>

                {/* Tags Placeholder */}
                <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
                    {['#LP', '#음악', '#턴테이블', '#감성'].map((tag, idx) => (
                        <span key={idx} className="px-4 py-1.5 bg-zinc-800 text-zinc-400 rounded-full text-sm font-semibold">
                            {tag}
                        </span>
                    ))}
                </div>

                {/* Likes at the bottom */}
                <div className="flex justify-center border-t border-zinc-800 pt-8">
                    <button className="flex items-center gap-3 text-3xl font-bold text-zinc-400 hover:text-rose-500 transition-colors group">
                        <svg className="w-10 h-10 text-rose-500 group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {lp.likes || 0}
                    </button>
                </div>

            </div>
        </div>
    );
}
