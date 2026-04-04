import { useState } from 'react';
import type { Movie } from '../types/movie';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    return (
        <div
            className="relative overflow-hidden rounded-xl shadow-lg cursor-pointer transform transition-transform duration-300 hover:scale-105"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <img
                src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                className="w-full h-full object-cover bg-gray-200"
            />

            {isHovered && (
                <div className="absolute inset-0 bg-black/70 backdrop-blur-sm p-4 flex flex-col justify-center items-center text-center">
                    <h2 className="text-white text-lg font-bold mb-2">{movie.title}</h2>
                    <p className="text-gray-300 text-sm line-clamp-5 leading-relaxed">
                        {movie.overview}
                    </p>
                </div>
            )}
        </div>
    );
}