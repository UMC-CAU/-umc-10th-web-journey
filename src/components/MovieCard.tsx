import { useNavigate } from 'react-router-dom';
import type { Movie } from '../types/movie';

interface MovieCardProps {
    movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
    const navigate = useNavigate();
    const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

    return (
        <div
            className="group relative overflow-hidden rounded-2xl shadow-xl shadow-slate-900/50 cursor-pointer transition-all duration-500 bg-slate-800 border border-slate-700/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20 hover:border-emerald-500/30"
            onClick={() => navigate(`/movie/${movie.id}`)}
        >
            <div className="aspect-[2/3] overflow-hidden bg-slate-800">
                {movie.poster_path ? (
                    <img
                        src={`${IMAGE_BASE_URL}${movie.poster_path}`}
                        alt={movie.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-500">
                        No Image
                    </div>
                )}
            </div>

            {/* Gradient overlay that appears on hover */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            <div className="absolute inset-0 p-5 flex flex-col justify-end translate-y-10 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h2 className="text-white text-xl font-extrabold mb-1 drop-shadow-md line-clamp-1">{movie.title}</h2>
                <div className="flex items-center gap-2 mb-3">
                    <span className="text-emerald-400 text-sm font-bold bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
                        ⭐ {movie.vote_average.toFixed(1)}
                    </span>
                    <span className="text-slate-300 text-xs">{movie.release_date}</span>
                </div>
                <p className="text-slate-300 text-sm line-clamp-4 leading-relaxed font-light">
                    {movie.overview || "상세 설명이 제공되지 않습니다."}
                </p>
            </div>
        </div>
    );
}