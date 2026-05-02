import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import BackButton from '../components/BackButton';
import { loginSchema, type LoginFormValues } from '../types/authSchema';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);
    const { login } = useAuth();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid }
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        mode: 'onChange',
        defaultValues: { email: '', password: '' }
    });

    const onSubmit = async (formValues: LoginFormValues) => {
        try {
            setApiError(null);
            const response = await axios.post('http://localhost:8000/v1/auth/signin', {
                email: formValues.email,
                password: formValues.password,
            });
            console.log('Login successful:', response.data);
            const accessToken = response.data?.data?.accessToken || response.data?.accessToken;
            const refreshToken = response.data?.data?.refreshToken || response.data?.refreshToken;

            login(accessToken || 'dummy_login_token', refreshToken || 'dummy_refresh_token');
            navigate('/');
        } catch (error: any) {
            console.error('Login failed:', error);
            setApiError(error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
        }
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
                        disabled={!isValid}
                        className={`mt-4 w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${isValid
                            ? 'text-white bg-emerald-500 hover:bg-emerald-400 transform hover:-translate-y-0.5 active:translate-y-0 shadow-[0_0_15px_rgba(52,211,153,0.4)] hover:shadow-[0_0_25px_rgba(52,211,153,0.6)] cursor-pointer'
                            : 'text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed'
                            }`}
                    >
                        로그인
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
