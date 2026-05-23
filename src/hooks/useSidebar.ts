import { useState, useEffect } from 'react';

export default function useSidebar() {
    const [isOpen, setIsOpen] = useState(window.innerWidth >= 1024);

    // 반응형: 창 크기 변경 시 자동 처리
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 1024) {
                setIsOpen(false);
            } else {
                setIsOpen(true);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ESC 키로 닫기 (모바일에서만)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && window.innerWidth < 1024) {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    // 사이드바 열릴 때 모바일에서 배경 스크롤 방지
    useEffect(() => {
        if (isOpen && window.innerWidth < 1024) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const open = () => setIsOpen(true);
    const close = () => {
        if (window.innerWidth < 1024) setIsOpen(false);
    };
    const toggle = () => setIsOpen((prev) => !prev);

    return { isOpen, open, close, toggle };
}
