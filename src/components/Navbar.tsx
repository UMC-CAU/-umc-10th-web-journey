import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useLocalStorage } from '../hooks/useLocalStorage';

const LINKS = [
    { to: '/', label: '홈' },
    { to: '/movies/popular', label: '인기 영화' },
    { to: '/movies/now_playing', label: '상영 중' },
    { to: '/movies/top_rated', label: '평점 높은' },
    { to: '/movies/upcoming', label: '개봉 예정' },
];

export default function Navbar() {
    const [token, , removeToken] = useLocalStorage<string | null>('accessToken', null);
    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    return (
        <nav className="sticky top-0 z-50 backdrop-blur-lg bg-slate-900/80 border-b border-slate-800/50 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link to="/" className="text-2xl font-extrabold bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent hover:opacity-80 transition-opacity">
                    CineScope
                </Link>
                <div className="flex items-center gap-6">
                    <div className="flex gap-4 md:gap-6">
                        {LINKS.map(({ to, label }) => (
                            <NavLink
                                key={to}
                                to={to}
                                className={({ isActive }) =>
                                    `relative px-2 py-1 text-sm md:text-base font-semibold transition-all duration-300 hover:text-emerald-400 ${
                                        isActive ? 'text-emerald-400 after:absolute after:bottom-[-6px] after:left-0 after:w-full after:h-0.5 after:bg-emerald-400 after:rounded-full after:shadow-[0_0_8px_rgba(52,211,153,0.8)]' : 'text-slate-300'
                                    }`
                                }
                            >
                                {label}
                            </NavLink>
                        ))}
                    </div>
                    <div className="flex items-center gap-2 ml-2">
                        {token ? (
                            <button
                                onClick={handleLogout}
                                className="px-5 py-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-300 font-semibold text-sm transition-all duration-300 hover:bg-slate-700 hover:text-white"
                            >
                                로그아웃
                            </button>
                        ) : (
                            <>
                                <Link to="/login" className="px-4 py-2 rounded-xl border border-emerald-500/50 text-emerald-400 font-semibold text-sm transition-all duration-300 hover:bg-emerald-500 hover:text-white hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
                                    로그인
                                </Link>
                                <Link to="/signup" className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-semibold text-sm transition-all duration-300 hover:from-emerald-400 hover:to-cyan-400 hover:shadow-[0_0_15px_rgba(52,211,153,0.4)]">
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