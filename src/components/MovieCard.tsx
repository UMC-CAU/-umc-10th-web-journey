// src/components/MovieCard.tsx
import { useState } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
    movie: Movie; // 부모한테서 영화 데이터 1개를 통째로 받을 거야!
}

export default function MovieCard({ movie }: MovieCardProps) {
    // 마우스가 카드 위에 올라갔는지 기억하는 상태야.
    const [isHovered, setIsHovered] = useState(false);

    // TMDB에서 주는 이미지 경로 앞에는 항상 이 기본 URL이 붙어야 해!
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    return (
        <div
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* 1. 영화 포스터 이미지 */}
            <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover bg-gray-200"
            />

            {/* 2. 마우스를 올렸을 때(isHovered === true)만 보이는 오버레이 설명창 */}
            {isHovered && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center">
                    <h2 className="text-white text-lg font-bold mb-2">{movie.title}</h2>
                    {/* line-clamp-5를 주면 글이 길어도 5줄까지만 나오고 ... 처리돼! */}
                    <p className="text-gray-300 text-sm line-clamp-5 leading-relaxed">
                        {movie.overview}
                    </p>
                </div>
            )}
        </div>
    );
}