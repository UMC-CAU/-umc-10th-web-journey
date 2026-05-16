import { Link, useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();

    const logoutMutation = useMutation({
        mutationFn: async () => {
            // Best-effort server signout; the client session is cleared regardless.
            try {
                await apiClient.post('/auth/signout');
            } catch {
                /* ignore — proceed with local logout */
            }
        },
        onSuccess: () => {
            logout();
            alert('로그아웃 되었습니다.');
            navigate('/');
        },
    });

    const handleLogout = () => {
        logoutMutation.mutate();
    };

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-800 shadow-md h-[72px]">
            <div className="w-full h-full px-6 flex items-center justify-between">
                <div className="flex items-center gap-4">
                    {/* Burger Button */}
                    <button
                        onClick={onMenuClick}
                        className="p-2 -ml-2 text-zinc-300 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                        aria-label="메뉴 열기"
                    >
                        <svg width="24" height="24" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                            <path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M7.95 11.95h32m-32 12h32m-32 12h32" />
                        </svg>
                    </button>

                    <Link
                        to="/"
                        className="text-2xl font-black tracking-[0.2em] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent hover:from-amber-100 hover:to-amber-500 transition-all"
                    >
                        LPWORLD
                    </Link>
                </div>

                <div className="flex items-center gap-6">
                    {/* Search Icon */}
                    <button className="text-zinc-300 hover:text-amber-400 transition-colors p-2" aria-label="검색">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="11" cy="11" r="8"></circle>
                            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                        </svg>
                    </button>

                    <div className="flex items-center gap-3">
                        {isAuthenticated ? (
                            <>
                                <span className="text-zinc-300 font-medium text-sm hidden sm:block">
                                    <strong className="text-white">{user?.name || '사용자'}</strong>님 반갑습니다.
                                </span>
                                <button
                                    onClick={handleLogout}
                                    disabled={logoutMutation.isPending}
                                    className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm transition-all duration-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                                >
                                    {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 rounded-xl border border-amber-500/50 text-amber-400 font-semibold text-sm transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]">
                                    로그인
                                </Link>
                                <Link to="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm transition-all duration-300 hover:from-amber-400 hover:to-amber-300 hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]">
                                    회원가입
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}