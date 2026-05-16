import { useParams, useNavigate } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import type { MovieDetail, CreditsResponse } from '../types/movie';

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const navigate = useNavigate();

    const { data: movie, loading: movieLoading, error: movieError } = useCustomFetch<MovieDetail>(
        movieId ? `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR` : ''
    );

    const { data: credits, loading: creditsLoading, error: creditsError } = useCustomFetch<CreditsResponse>(
        movieId ? `https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR` : ''
    );

    const isPending = movieLoading || creditsLoading;
    const isError = movieError || creditsError;

    if (isError) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="text-rose-500 bg-rose-500/10 px-8 py-6 rounded-2xl border border-rose-500/20 text-center shadow-xl">
                <span className="text-4xl block mb-4">😢</span>
                <p className="text-xl font-semibold">데이터를 불러오는데 실패했습니다.</p>
                <button onClick={() => navigate(-1)} className="mt-6 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors">
                    이전으로 돌아가기
                </button>
            </div>
        </div>
    );
    
    if (isPending || !movie || !credits) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center">
            <LoadingSpinner />
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 text-slate-50 pb-24 selection:bg-amber-500/30 selection:text-amber-200">
            {/* Hero Section */}
            <div className="relative w-full min-h-[75vh] md:h-[80vh] flex items-center overflow-hidden">
                <div
                    className="absolute inset-0 bg-cover bg-center transform scale-105"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path || movie.poster_path})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-900/40" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                
                <div className="relative w-full max-w-7xl mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center md:items-stretch gap-10 lg:gap-16 pt-20 pb-12">
                    {/* Poster */}
                    <div className="shrink-0 group">
                        <img
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                            alt={movie.title}
                            className="w-64 md:w-80 lg:w-[350px] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-slate-700/50 group-hover:scale-[1.02] transition-transform duration-500 object-cover"
                        />
                    </div>

                    {/* Movie Info */}
                    <div className="flex flex-col justify-center flex-grow text-center md:text-left pt-6 md:pt-0">
                        <h1 className="text-4xl md:text-5xl lg:text-5xl font-extrabold mb-3 tracking-tight text-white drop-shadow-lg">
                            {movie.title}
                        </h1>
                        {movie.tagline && <p className="text-amber-400 text-lg md:text-xl font-medium italic mb-6">"{movie.tagline}"</p>}
                        
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-8 text-sm md:text-base font-medium">
                            <span className="flex items-center gap-1.5 bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 text-amber-400">
                                ⭐️ {(movie.vote_average || 0).toFixed(1)}
                            </span>
                            <span className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-300">
                                📅 {movie.release_date}
                            </span>
                            <span className="bg-slate-800/80 backdrop-blur px-3 py-1.5 rounded-lg border border-slate-700/50 text-slate-300">
                                ⏱️ {movie.runtime}분
                            </span>
                        </div>

                        <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-8">
                            {movie.genres.map((g) => (
                                <span key={g.id} className="bg-amber-500/10 text-amber-300 px-4 py-1.5 rounded-full text-sm font-semibold border border-amber-500/20 backdrop-blur shadow-inner">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        <div className="max-w-3xl">
                            <h3 className="text-2xl font-bold text-white mb-3 tracking-wide">개요</h3>
                            <p className="text-lg text-slate-300 leading-relaxed font-light">
                                {movie.overview || "상세 설명이 제공되지 않습니다."}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cast Section */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 mt-12 md:mt-24">
                <div className="flex items-center gap-3 mb-10">
                    <div className="w-2 h-8 bg-amber-500 rounded-full" />
                    <h2 className="text-3xl font-extrabold text-white tracking-tight">주요 출연진</h2>
                </div>
                
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6 gap-y-10">
                    {credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.id} className="group flex flex-col bg-slate-800/50 border border-slate-700/50 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
                            <div className="aspect-[2/3] overflow-hidden bg-slate-800 relative">
                                <img
                                    src={actor.profile_path ? `https://image.tmdb.org/t/p/w300${actor.profile_path}` : 'https://via.placeholder.com/300x450?text=No+Image'}
                                    alt={actor.name}
                                    loading="lazy"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            <div className="p-4 flex-grow flex flex-col justify-center text-center">
                                <h3 className="font-bold text-sm md:text-base text-slate-100 mb-1 line-clamp-1">{actor.name}</h3>
                                <p className="text-amber-400/80 text-xs md:text-sm font-medium line-clamp-1">{actor.character}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}