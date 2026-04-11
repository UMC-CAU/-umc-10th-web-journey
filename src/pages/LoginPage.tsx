import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useForm } from '../hooks/useForm';
import BackButton from '../components/BackButton';

const LoginPage = () => {
    const navigate = useNavigate();
    const [apiError, setApiError] = useState<string | null>(null);

    const { values, errors, touched, handleChange, handleBlur, handleSubmit } = useForm({
        initialValues: { email: '', password: '' },
        validate: (values) => {
            const errs: Record<string, string> = {};

            if (!values.email) {
                errs.email = '이메일을 입력해 주세요.';
            } else if (!values.email.includes('@') || !values.email.includes('.')) {
                errs.email = '유효하지 않은 이메일 형식입니다.';
            }

            if (!values.password) {
                errs.password = '비밀번호를 입력해 주세요.';
            } else if (values.password.length < 6) {
                errs.password = '비밀번호는 최소 6자 이상이어야 합니다.';
            }
            return errs;
        },
        onSubmit: async (formValues) => {
            try {
                setApiError(null);
                const response = await axios.post('http://localhost:8000/v1/auth/signin', {
                    email: formValues.email,
                    password: formValues.password,
                });
                console.log('Login successful:', response.data);
                navigate('/');
            } catch (error: any) {
                console.error('Login failed:', error);
                setApiError(error.response?.data?.message || '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.');
            }
        }
    });

    const isFormValid = Object.keys(errors).length === 0 && values.email !== '' && values.password !== '';

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

                <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
                    <div className="flex flex-col relative pb-6">
                        <label className="text-sm font-semibold text-slate-300 mb-2">이메일</label>
                        <input
                            type="email"
                            name="email"
                            value={values.email}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400/50 ${touched.email && errors.email
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-slate-700/50 focus:border-emerald-400/50 text-white'
                                }`}
                            placeholder="이메일을 입력해주세요!"
                        />
                        {touched.email && errors.email && (
                            <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.email}</span>
                        )}
                    </div>

                    <div className="flex flex-col relative pb-6">
                        <label className="text-sm font-semibold text-slate-300 mb-2">비밀번호</label>
                        <input
                            type="password"
                            name="password"
                            value={values.password}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-emerald-400/50 ${touched.password && errors.password
                                ? 'border-red-500/50 focus:border-red-500'
                                : 'border-slate-700/50 focus:border-emerald-400/50 text-white'
                                }`}
                            placeholder="비밀번호를 입력해주세요!"
                        />
                        {touched.password && errors.password && (
                            <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.password}</span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className={`mt-4 w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${isFormValid
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
