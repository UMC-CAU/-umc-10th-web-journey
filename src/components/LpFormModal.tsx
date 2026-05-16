import { useState, useRef, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/axios';
import { uploadImage } from '../api/upload';
import type { LpItem, CreateLpPayload } from '../types/lp';

interface LpFormModalProps {
    onClose: () => void;
    /** When provided the modal works in edit mode for this LP. */
    lp?: LpItem;
}

export default function LpFormModal({ onClose, lp }: LpFormModalProps) {
    const isEdit = !!lp;
    const queryClient = useQueryClient();

    const [title, setTitle] = useState(lp?.title ?? '');
    const [content, setContent] = useState(lp?.content ?? '');
    const [tags, setTags] = useState<string[]>(lp?.tags?.map((t) => t.name) ?? []);
    const [tagInput, setTagInput] = useState('');
    const [preview, setPreview] = useState<string | null>(lp?.thumbnail ?? null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Lock background scroll while the modal is open.
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

    const handleAddTag = () => {
        const trimmed = tagInput.trim();
        if (trimmed && !tags.includes(trimmed)) {
            setTags((prev) => [...prev, trimmed]);
        }
        setTagInput('');
    };

    const handleRemoveTag = (target: string) => {
        setTags((prev) => prev.filter((t) => t !== target));
    };

    const mutation = useMutation({
        mutationFn: async () => {
            let thumbnail = lp?.thumbnail ?? '';
            if (imageFile) {
                thumbnail = await uploadImage(imageFile);
            }

            const payload: CreateLpPayload = {
                title: title.trim(),
                content: content.trim(),
                thumbnail,
                tags,
                published: true,
            };

            if (isEdit) {
                const response = await apiClient.patch(`/lps/${lp!.id}`, payload);
                return response.data?.data || response.data;
            }
            const response = await apiClient.post('/lps', payload);
            return response.data?.data || response.data;
        },
        onSuccess: () => {
            // Refresh main list and (for edit) the detail view.
            queryClient.invalidateQueries({ queryKey: ['lps'] });
            if (isEdit) {
                queryClient.invalidateQueries({ queryKey: ['lp', String(lp!.id)] });
            }
            onClose();
        },
        onError: (error: any) => {
            alert(error?.response?.data?.message || 'LP 저장에 실패했습니다.');
        },
    });

    const canSubmit = title.trim().length > 0 && content.trim().length > 0 && !mutation.isPending;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
            onClick={onClose}
        >
            <div
                className="relative w-full max-w-lg bg-[#232428] rounded-3xl p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-6 right-6 text-zinc-400 hover:text-white transition-colors"
                    aria-label="닫기"
                >
                    <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <h2 className="text-2xl font-extrabold text-white mb-6">
                    {isEdit ? 'LP 수정' : '새 LP 작성'}
                </h2>

                {/* Image upload */}
                <div className="flex justify-center mb-6">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-48 h-48 rounded-full bg-zinc-900 border-2 border-dashed border-zinc-700 overflow-hidden flex items-center justify-center hover:border-amber-500/50 transition-colors"
                    >
                        {preview ? (
                            <img src={preview} alt="미리보기" className="w-full h-full object-cover" />
                        ) : (
                            <span className="text-zinc-500 text-sm font-semibold">사진 선택</span>
                        )}
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                        aria-label="LP 사진 업로드"
                    />
                </div>

                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="LP Name"
                    className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 mb-4 transition-all"
                />

                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="LP Content"
                    className="w-full bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-4 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 resize-none h-28 mb-4 transition-all"
                />

                {/* Tag input */}
                <div className="flex gap-2 mb-3">
                    <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                            }
                        }}
                        placeholder="LP Tag"
                        className="flex-1 bg-zinc-900/50 border border-zinc-700/50 rounded-xl p-3 text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-amber-500/50 transition-all"
                    />
                    <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-5 bg-amber-500 hover:bg-amber-400 text-white font-bold rounded-xl transition-colors"
                    >
                        Add
                    </button>
                </div>

                {tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-6">
                        {tags.map((tag) => (
                            <span
                                key={tag}
                                className="flex items-center gap-2 px-3 py-1.5 bg-zinc-800 text-zinc-300 rounded-full text-sm font-semibold"
                            >
                                #{tag}
                                <button
                                    type="button"
                                    onClick={() => handleRemoveTag(tag)}
                                    className="text-zinc-500 hover:text-rose-400 transition-colors"
                                    aria-label={`${tag} 태그 삭제`}
                                >
                                    ✕
                                </button>
                            </span>
                        ))}
                    </div>
                )}

                <button
                    type="button"
                    disabled={!canSubmit}
                    onClick={() => mutation.mutate()}
                    className="w-full py-4 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-white font-bold rounded-xl transition-colors"
                >
                    {mutation.isPending ? '저장 중...' : isEdit ? 'Edit LP' : 'Add LP'}
                </button>
            </div>
        </div>
    );
}
