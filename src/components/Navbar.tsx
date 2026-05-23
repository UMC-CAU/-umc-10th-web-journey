import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { useAuth } from '../context/AuthContext';
import useDebounce from '../hooks/useDebounce';

interface NavbarProps {
    onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
    const { isAuthenticated, logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);
    const skipNextEffect = useRef(true);

    const debouncedQuery = useDebounce(searchInput, 300);

    // URL에 q 파라미터가 있으면 검색창 초기화
    useEffect(() => {
        const q = new URLSearchParams(location.search).get('q') ?? '';
        if (q) {
            setSearchInput(q);
            setIsSearchOpen(true);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 디바운스된 값이 바뀌면 URL 업데이트
    useEffect(() => {
        if (skipNextEffect.current) {
            skipNextEffect.current = false;
            return;
        }
        const trimmed = debouncedQuery.trim();
        const isOnLpPage = window.location.pathname === '/v1/lps';

        if (isOnLpPage) {
            const search = trimmed ? `?q=${encodeURIComponent(trimmed)}` : '';
            navigate(`/v1/lps${search}`, { replace: true });
        } else if (trimmed) {
            navigate(`/v1/lps?q=${encodeURIComponent(trimmed)}`);
        }
    }, [debouncedQuery, navigate]);

    const handleOpen = () => {
        setIsSearchOpen(true);
        setTimeout(() => inputRef.current?.focus(), 50);
    };

    const handleClose = () => {
        setIsSearchOpen(false);
        setSearchInput('');
        if (window.location.pathname === '/v1/lps') {
            navigate('/v1/lps', { replace: true });
        }
    };

    const logoutMutation = useMutation({
        mutationFn: async () => {
            try {
                await apiClient.post('/auth/signout');
            } catch {
                /* ignore */
            }
        },
        onSuccess: () => {
            logout();
            alert('로그아웃 되었습니다.');
            navigate('/');
        },
    });

    return (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black border-b border-zinc-800 shadow-md h-[72px]">
            <div className="w-full h-full px-6 flex items-center justify-between">

                {/* 왼쪽: 햄버거 + 로고 + 검색 */}
                <div className="flex items-center gap-3">
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
                        className="text-2xl font-black tracking-[0.2em] bg-gradient-to-r from-amber-200 via-amber-400 to-amber-600 bg-clip-text text-transparent hover:from-amber-100 hover:to-amber-500 transition-all shrink-0"
                    >
                        LPWORLD
                    </Link>

                    {/* 돋보기 + 펼쳐지는 입력창 */}
                    <div className="flex items-center gap-1">
                        <button
                            onClick={isSearchOpen ? handleClose : handleOpen}
                            className={`p-2 rounded-lg transition-colors ${
                                isSearchOpen
                                    ? 'text-amber-400 bg-zinc-800'
                                    : 'text-zinc-300 hover:text-amber-400 hover:bg-zinc-800'
                            }`}
                            aria-label="검색"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                        </button>

                        {/* 슬라이드 입력창 */}
                        <div
                            className={`flex items-center overflow-hidden transition-all duration-300 ease-in-out ${
                                isSearchOpen ? 'w-52 opacity-100' : 'w-0 opacity-0'
                            }`}
                        >
                            <div className="relative w-full">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchInput}
                                    onChange={(e) => setSearchInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Escape' && handleClose()}
                                    placeholder="LP 검색..."
                                    className="w-full px-3 py-1.5 pr-7 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm placeholder-zinc-400 focus:outline-none focus:border-amber-500 transition-colors"
                                />
                                {searchInput && (
                                    <button
                                        onClick={() => setSearchInput('')}
                                        className="absolute right-2 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-white transition-colors"
                                        aria-label="검색어 지우기"
                                    >
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                            <line x1="18" y1="6" x2="6" y2="18" />
                                            <line x1="6" y1="6" x2="18" y2="18" />
                                        </svg>
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 사용자 정보 + 로그인/로그아웃 */}
                <div className="flex items-center gap-3">
                    {isAuthenticated ? (
                        <>
                            <span className="text-zinc-300 font-medium text-sm hidden sm:block">
                                <strong className="text-white">{user?.name || '사용자'}</strong>님 반갑습니다.
                            </span>
                            <button
                                onClick={() => logoutMutation.mutate()}
                                disabled={logoutMutation.isPending}
                                className="px-4 py-2 rounded-xl bg-zinc-800 border border-zinc-700 text-zinc-300 font-semibold text-sm transition-all duration-300 hover:bg-zinc-700 hover:text-white disabled:opacity-50"
                            >
                                {logoutMutation.isPending ? '로그아웃 중...' : '로그아웃'}
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="px-4 py-2 rounded-xl border border-amber-500/50 text-amber-400 font-semibold text-sm transition-all duration-300 hover:bg-amber-500 hover:text-white hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]"
                            >
                                로그인
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold text-sm transition-all duration-300 hover:from-amber-400 hover:to-amber-300 hover:shadow-[0_0_15px_rgba(201,162,39,0.4)]"
                            >
                                회원가입
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    );
}
