import { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LpFormModal from '../components/LpFormModal';
import { useAuth } from '../context/AuthContext';

export default function RootLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 1024);
    const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsSidebarOpen(false);
            } else {
                setIsSidebarOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
    const closeSidebar = () => {
        if (window.innerWidth < 1024) {
            setIsSidebarOpen(false);
        }
    };

    const handleAddClick = () => {
        if (!isAuthenticated) {
            alert('로그인이 필요한 서비스입니다.');
            navigate('/login');
            return;
        }
        setIsWriteModalOpen(true);
    };

    return (
        <div className="flex flex-col min-h-screen bg-black">
            <Navbar onMenuClick={toggleSidebar} />
            <div className="flex flex-1 pt-[72px]">
                <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />
                <main className="flex-1 w-full overflow-x-hidden relative" onClick={closeSidebar}>
                    <Outlet />

                    {/* Floating Add Button */}
                    <button
                        onClick={handleAddClick}
                        className="fixed bottom-8 right-8 w-14 h-14 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/30 text-white text-3xl flex items-center justify-center hover:bg-emerald-400 hover:scale-110 transition-all z-40"
                    >
                        +
                    </button>
                </main>
            </div>

            {isWriteModalOpen && (
                <LpFormModal onClose={() => setIsWriteModalOpen(false)} />
            )}
        </div>
    );
}
