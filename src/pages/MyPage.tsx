import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function MyPage() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        alert('로그아웃 되었습니다.');
        navigate('/');
    };

    return (
        <div className="max-w-4xl mx-auto px-6 py-12 text-white">
            <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                마이페이지
            </h1>

            <div className="bg-slate-800/80 p-8 rounded-3xl border border-slate-700/50 shadow-2xl backdrop-blur-xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-cyan-500"></div>

                <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="w-24 h-24 rounded-full bg-slate-700 flex items-center justify-center text-4xl shadow-inner border-2 border-slate-600">
                        👤
                    </div>

                    <div className="flex-1 space-y-4 text-center md:text-left">
                        <div>
                            <p className="text-sm text-slate-400 font-semibold mb-1">이메일</p>
                            <p className="text-lg font-medium text-slate-200">
                                {user?.email || '이메일 정보 없음'}
                            </p>
                        </div>
                        <div>
                            <p className="text-sm text-slate-400 font-semibold mb-1">닉네임</p>
                            <p className="text-lg font-medium text-slate-200">
                                {user?.nickname || '닉네임 정보 없음'}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="mt-10 pt-8 border-t border-slate-700/50 flex justify-end gap-4">
                    <button
                        className="px-6 py-3 rounded-xl bg-slate-700/50 text-slate-300 font-semibold transition-all hover:bg-slate-700 hover:text-white"
                    >
                        정보 수정
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 rounded-xl bg-red-500/10 text-red-400 font-semibold border border-red-500/20 transition-all hover:bg-red-500 hover:text-white hover:shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                        로그아웃
                    </button>
                </div>
            </div>
        </div>
    );
}
