import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
    const { isAuthenticated } = useAuth();

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
                <div className="p-6 w-64 flex flex-col gap-4">
                    <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mb-2">메뉴</h2>
                    <Link to="/v1/lps" className="text-zinc-300 hover:text-emerald-400 transition-colors py-2 font-medium" onClick={onClose}>
                        LP 목록
                    </Link>
                    <Link to="/v1/lps?sort=latest" className="text-zinc-300 hover:text-emerald-400 transition-colors py-2 font-medium" onClick={onClose}>
                        최신 LP
                    </Link>
                    {isAuthenticated && (
                        <>
                            <h2 className="text-zinc-500 text-xs font-bold uppercase tracking-wider mt-4 mb-2">개인</h2>
                            <Link to="/mypage" className="text-zinc-300 hover:text-emerald-400 transition-colors py-2 font-medium" onClick={onClose}>
                                마이페이지
                            </Link>
                        </>
                    )}
                    {/* Additional placeholder links if needed */}
                </div>
            </aside>
        </>
    );
}
