import { useState, useRef, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { uploadImage } from '../api/upload';
import { useAuth } from '../context/AuthContext';

interface ProfileEditModalProps {
    onClose: () => void;
}

export default function ProfileEditModal({ onClose }: ProfileEditModalProps) {
    const { user, updateUser } = useAuth();

    const [name, setName] = useState(user?.name ?? '');
    const [bio, setBio] = useState(user?.bio ?? '');
    const [preview, setPreview] = useState<string | null>(user?.avatar ?? null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const mutation = useMutation({
        mutationFn: async () => {
            let avatar = user?.avatar ?? null;
            if (imageFile) {
                avatar = await uploadImage(imageFile);
            }
            // bio / avatar are optional — send only the fields that have a value.
            const payload: Record<string, unknown> = { name: name.trim() };
            if (bio.trim()) payload.bio = bio.trim();
            if (avatar) payload.avatar = avatar;

            const response = await apiClient.patch('/users', payload);
            return response.data?.data || response.data;
        },
        onSuccess: (data) => {
            updateUser(data);
            alert('프로필이 수정되었습니다.');
            onClose();
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || '프로필 수정에 실패했습니다.');
        },
    });

    const canSubmit = name.trim().length > 0 && !mutation.isPending;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-md bg-slate-800 rounded-3xl p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-slate-400 hover:text-white transition-colors"
                    aria-label="닫기"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-extrabold text-white mb-6">프로필 수정</h2>

                <div className="flex justify-center mb-6">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-28 h-28 rounded-full bg-slate-700 border-2 border-slate-600 overflow-hidden flex items-center justify-center hover:border-emerald-500/50 transition-colors text-4xl"
                    >
                        {preview ? (
                            <img src={preview} alt="프로필 미리보기" className="w-full h-full object-cover" />
                        ) : (
                            <span>👤</span>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="프로필 사진 업로드"
                    />
                </div>

                <label className="block text-sm font-semibold text-slate-300 mb-2">이름</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="이름을 입력하세요"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 mb-4 transition-all"
                />

                <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Bio <span className="text-slate-500 font-normal">(선택)</span>
                </label>
                <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="자기소개를 입력하세요 (선택)"
                    className="w-full bg-slate-900/50 border border-slate-700/50 rounded-xl p-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-emerald-500/50 resize-none h-24 mb-6 transition-all"
                />

                <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => mutation.mutate()}
                    className="w-full py-4 bg-emerald-500 hover:bg-emerald-400 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold rounded-xl transition-colors"
                >
                    {mutation.isPending ? '저장 중...' : '저장'}
                </button>
            </div>
        </div>
    );
}
