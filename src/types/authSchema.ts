import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해 주세요.')
    .email('유효하지 않은 이메일 형식입니다.'),
  password: z.string()
    .min(1, '비밀번호를 입력해 주세요.')
    .min(6, '비밀번호는 최소 6자 이상이어야 합니다.'),
});

export const signupSchema = z.object({
  email: z.string()
    .min(1, '이메일을 입력해 주세요.')
    .email('올바른 이메일 형식을 입력해주세요.'),
  password: z.string()
    .min(1, '비밀번호를 입력해 주세요.')
    .min(6, '비밀번호는 6자 이상이어야 합니다.'),
  passwordConfirm: z.string()
    .min(1, '비밀번호 재확인을 입력해 주세요.'),
  nickname: z.string()
    .min(1, '닉네임을 입력해 주세요.'),
}).refine((data) => data.password === data.passwordConfirm, {
  path: ['passwordConfirm'],
  message: '비밀번호가 일치하지 않습니다.',
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type SignupFormValues = z.infer<typeof signupSchema>;
