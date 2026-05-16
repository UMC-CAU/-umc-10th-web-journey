import { useState } from 'react';
import axios from 'axios';
import { useMutation } from '@tanstack/react-query';
import { useNavigate, useLocation } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BackButton from '../components/BackButton';
import { loginSchema, type LoginFormValues } from '../types/authSchema';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [apiError, setApiError] = useState<string | null>(location.state?.error || null);
    const { login } = useAuth();

    const handleGoogleLogin = () => {
        window.location.href = 'http://localhost:8000/v1/auth/google/login';
    };

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: { email: '', password: '' }
    });

    const loginMutation = useMutation({
        mutationFn: async (formValues: LoginFormValues) => {
            const response = await axios.post('http://localhost:8000/v1/auth/signin', {
                email: formValues.email,
                password: formValues.password,
            });
            return response.data;
        },
        onSuccess: (data) => {
            const accessToken = data?.data?.accessToken || data?.accessToken;
            const refreshToken = data?.data?.refreshToken || data?.refreshToken;

            login(accessToken || 'dummy_login_token', refreshToken || 'dummy_refresh_token');

            // Auth token changed — redirect to the home (or originally requested) page.
            const from = location.state?.from?.pathname || '/';
            navigate(from, { replace: true });
        },
        onError: (error: any) => {
            console.error('Login failed:', error);
            setApiError(error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        },
    });

    const onSubmit = (formValues: LoginFormValues) => {
        setApiError(null);
        loginMutation.mutate(formValues);
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 relative">
            <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative">

                <BackButton className="absolute top-8 left-8" />

                <h1 className="text-3xl font-extrabold text-white mb-8 text-center mt-2">
                    로그인
                </h1>

                {apiError && (
                    <div className="mb-6 mx-auto p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium text-center shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                        {apiError}
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>
                    <div className="flex flex-col relative pb-6">
                        <label className="text-sm font-semibold text-slate-300 mb-2">이메일</label>
                        <input
                            type="email"
                            {...register('email')}
                            className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400/50 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-emerald-400/50 text-white'
                                }`}
                            placeholder="이메일을 입력해주세요!"
                        />
                        {errors.email && (
                            <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.email.message}</span>
                        )}
                    </div>

                    <div className="flex flex-col relative pb-6">
                        <label className="text-sm font-semibold text-slate-300 mb-2">비밀번호</label>
                        <input
                            type="password"
                            {...register('password')}
                            className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400/50 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-emerald-400/50 text-white'
                                }`}
                            placeholder="비밀번호를 입력해주세요!"
                        />
                        {errors.password && (
                            <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.password.message}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isValid || loginMutation.isPending}
                        className={`mt-4 w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${isValid && !loginMutation.isPending
                            ? 'text-white bg-emerald-500 hover:bg-emerald-400 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] cursor-pointer'
                            : 'text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed'
                            }`}
                    >
                        {loginMutation.isPending ? '로그인 중...' : '로그인'}
                    </button>

                    <div className="relative flex items-center justify-center w-full mt-2">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-700/50"></div>
                        </div>
                        <div className="relative px-4 bg-slate-900/80 text-sm text-slate-400">
                            또는
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 text-slate-800 bg-white hover:bg-gray-100 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_15px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] cursor-pointer flex items-center justify-center gap-3"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="#34A853"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="#FBBC05"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="#EA4335"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        Google로 로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
