import { useNavigate } from 'react-router-dom';

interface BackButtonProps {
    className?: string;
}

export default function BackButton({ className = '' }: BackButtonProps) {
    const navigate = useNavigate();

    return (
        <button 
            onClick={() => navigate(-1)} 
            className={`text-slate-300 hover:text-white transition-colors ${className}`}
            aria-label="이전 페이지로 이동"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
        </button>
    );
}
