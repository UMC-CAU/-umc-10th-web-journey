import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { isAuthenticated, logout } = useAuth();
    const navigate = useNavigate();
    const [showConfirm, setShowConfirm] = useState(false);

    const withdrawMutation = useMutation({
        mutationFn: async () => {
            await apiClient.delete('/users');
        },
        onSuccess: () => {
            logout();
            setShowConfirm(false);
            alert('회원 탈퇴가 완료되었습니다.');
            navigate('/login', { replace: true });
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || '회원 탈퇴에 실패했습니다.');
        },
    });

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed top-[72px] inset-x-0 bottom-0 bg-black/50 z-30 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed lg:sticky top-[72px] left-0 bottom-0 h-[calc(100vh-72px)] bg-[#121212] border-r border-zinc-800 z-40 transition-all duration-300 ease-in-out overflow-y-auto overflow-x-hidden shrink-0
                ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full lg:w-0 lg:translate-x-0 lg:border-none'}`}
            >
                <div className="p-6 w-64 flex flex-col gap-4 h-full">
                    <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">메뉴</h2>
                    <Link to="/v1/lps" className="text-zinc-300 hover:text-amber-400 transition-colors py-2 font-medium" onClick={onClose}>
                        LP 목록
                    </Link>
                    <Link to="/v1/lps?sort=latest" className="text-zinc-300 hover:text-amber-400 transition-colors py-2 font-medium" onClick={onClose}>
                        최신 LP
                    </Link>
                    {isAuthenticated && (
                        <>
                            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">개인</h2>
                            <Link to="/mypage" className="text-zinc-300 hover:text-amber-400 transition-colors py-2 font-medium" onClick={onClose}>
                                마이페이지
                            </Link>

                            <button
                                onClick={() => setShowConfirm(true)}
                                className="mt-auto text-left text-rose-400 hover:text-rose-300 transition-colors py-2 font-medium"
                            >
                                탈퇴하기
                            </button>
                        </>
                    )}
                </div>
            </aside>

            {/* Withdraw confirmation modal */}
            {showConfirm && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
                    onClick={() => setShowConfirm(false)}
                >
                    <div
                        className="w-full max-w-sm bg-zinc-900 rounded-3xl p-8 shadow-2xl text-center"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-xl font-bold text-white mb-3">정말 탈퇴하시겠습니까?</h3>
                        <p className="text-zinc-400 text-sm mb-8">
                            탈퇴 시 계정 정보가 삭제되며 복구할 수 없습니다.
                        </p>
                        <div className="flex gap-3">
                            <button
                                disabled={withdrawMutation.isPending}
                                onClick={() => withdrawMutation.mutate()}
                                className="flex-1 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold transition-colors"
                            >
                                {withdrawMutation.isPending ? '처리 중...' : '예'}
                            </button>
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="flex-1 py-3 rounded-xl bg-zinc-800 text-zinc-300 font-semibold hover:bg-zinc-700 transition-colors"
                            >
                                아니오
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
