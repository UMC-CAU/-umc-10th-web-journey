import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { signupSchema, type SignupFormValues } from '../types/authSchema';

const EyeIcon = ({ show }: { show: boolean }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        {show ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        )}
    </svg>
);

export default function SignupPage() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

    const {
        register,
        trigger,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signupSchema),
        mode: 'onChange',
        defaultValues: {
            email: '',
            password: '',
            passwordConfirm: '',
            nickname: ''
        }
    });

    const emailValue = watch('email');
    const passwordValue = watch('password');
    const passwordConfirmValue = watch('passwordConfirm');
    const nicknameValue = watch('nickname');

    const handleNextStep = async () => {
        if (step === 1) {
            const isEmailValid = await trigger('email');
            if (isEmailValid) setStep(2);
        } else if (step === 2) {
            const isPasswordValid = await trigger('password');
            if (isPasswordValid) setStep(3);
        } else if (step === 3) {
            const isPasswordConfirmValid = await trigger('passwordConfirm');
            if (isPasswordConfirmValid) setStep(4);
        }
    };

    const handlePrevStep = () => {
        if (step > 1) {
            setStep(step - 1);
        } else {
            navigate(-1);
        }
    };

    const onSubmit = async (data: SignupFormValues) => {
        try {
            const response = await axios.post('http://localhost:8000/v1/auth/signup', {
                name: data.nickname,
                email: data.email,
                password: data.password
            });
            console.log('Signup success:', response.data);
            alert('회원가입이 완료되었습니다! 로그인 페이지로 이동합니다.');
            navigate('/login');
        } catch (error: any) {
            console.error('Signup failed:', error);
            alert(error.response?.data?.message || '회원가입에 실패했습니다.');
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-6 relative">
            <div className="w-full max-w-md p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 rounded-3xl shadow-2xl relative transition-all duration-300">

                <button
                    type="button"
                    onClick={handlePrevStep}
                    className="absolute top-8 left-8 text-slate-300 hover:text-white transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>

                <h1 className="text-3xl font-extrabold text-white mb-2 text-center mt-2">
                    회원가입
                </h1>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6" noValidate>

                    {step === 1 && (
                        <div className="flex flex-col relative pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-sm font-semibold text-slate-300 mb-2">이메일</label>
                            <input
                                type="email"
                                {...register('email')}
                                className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-amber-400/50 ${errors.email ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-amber-400/50 text-white'}`}
                                placeholder="example@test.com"
                                autoFocus
                            />
                            {errors.email && (
                                <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.email.message}</span>
                            )}
                        </div>
                    )}

                    {step === 2 && (
                        <div className="flex flex-col relative pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-sm font-semibold text-slate-300 mb-2">비밀번호</label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    {...register('password')}
                                    className={`w-full px-5 py-3 pr-12 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-amber-400/50 ${errors.password ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-amber-400/50 text-white'}`}
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                                >
                                    <EyeIcon show={showPassword} />
                                </button>
                            </div>
                            {errors.password && (
                                <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.password.message}</span>
                            )}
                        </div>
                    )}

                    {step === 3 && (
                        <div className="flex flex-col relative pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <label className="text-sm font-semibold text-slate-300 mb-2">비밀번호 재확인</label>
                            <div className="relative">
                                <input
                                    type={showPasswordConfirm ? "text" : "password"}
                                    {...register('passwordConfirm')}
                                    className={`w-full px-5 py-3 pr-12 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-amber-400/50 ${errors.passwordConfirm ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-amber-400/50 text-white'}`}
                                    placeholder="••••••••"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPasswordConfirm(!showPasswordConfirm)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 focus:outline-none"
                                >
                                    <EyeIcon show={showPasswordConfirm} />
                                </button>
                            </div>
                            {errors.passwordConfirm && (
                                <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.passwordConfirm.message}</span>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="flex flex-col relative pb-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex flex-col items-center mb-6">
                                <div className="w-24 h-24 rounded-full bg-slate-800 border-2 border-amber-500/50 flex items-center justify-center text-amber-400 mb-3 overflow-hidden">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full cursor-pointer hover:bg-slate-700 transition">이미지 업로드 (선택)</span>
                            </div>

                            <label className="text-sm font-semibold text-slate-300 mb-2">닉네임</label>
                            <input
                                type="text"
                                {...register('nickname')}
                                className={`w-full px-5 py-3 rounded-xl bg-slate-800/50 border outline-none transition-all duration-300 focus:ring-2 focus:ring-amber-400/50 ${errors.nickname ? 'border-red-500/50 focus:border-red-500' : 'border-slate-700/50 focus:border-amber-400/50 text-white'}`}
                                placeholder="닉네임을 입력해주세요"
                                autoFocus
                            />
                            {errors.nickname && (
                                <span className="text-red-500 text-xs font-semibold absolute bottom-0 left-1">{errors.nickname.message}</span>
                            )}
                        </div>
                    )}

                    {step < 4 ? (
                        <button
                            type="button"
                            onClick={handleNextStep}
                            disabled={
                                (step === 1 && (!emailValue || !!errors.email)) ||
                                (step === 2 && (!passwordValue || !!errors.password)) ||
                                (step === 3 && (!passwordConfirmValue || !!errors.passwordConfirm))
                            }
                            className={`mt-4 w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${(step === 1 && emailValue && !errors.email) ||
                                (step === 2 && passwordValue && !errors.password) ||
                                (step === 3 && passwordConfirmValue && !errors.passwordConfirm)
                                ? 'text-white bg-amber-500 hover:bg-amber-400 shadow-[0_0_15px_rgba(201,162,39,0.4)] cursor-pointer'
                                : 'text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed'
                                }`}
                        >
                            다음
                        </button>
                    ) : (
                        <button
                            type="submit"
                            disabled={!nicknameValue || !!errors.nickname}
                            className={`mt-4 w-full py-4 px-6 rounded-xl font-bold transition-all duration-300 ${nicknameValue && !errors.nickname
                                ? 'text-white bg-amber-500 hover:bg-amber-400 shadow-[0_0_20px_rgba(201,162,39,0.5)] transform hover:-translate-y-0.5 cursor-pointer'
                                : 'text-slate-500 bg-slate-800 border border-slate-700 cursor-not-allowed'
                                }`}
                        >
                            회원가입 완료
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}
