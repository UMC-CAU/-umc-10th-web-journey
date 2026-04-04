import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import type { MovieDetail, CreditsResponse } from '../types/movie';

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [credits, setCredits] = useState<CreditsResponse | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieData = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const [detailRes, creditsRes] = await Promise.all([
                    axios.get<MovieDetail>(`https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                    }),
                    axios.get<CreditsResponse>(`https://api.themoviedb.org/3/movie/${movieId}/credits?language=ko-KR`, {
                        headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` },
                    })
                ]);
                setMovie(detailRes.data);
                setCredits(creditsRes.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        if (movieId) fetchMovieData();
    }, [movieId]);

    if (isError) return <div className="text-red-500 text-center py-20 text-2xl font-bold">데이터를 불러오는데 실패했습니다.</div>;
    if (isPending || !movie || !credits) return <LoadingSpinner />;

    return (
        <div className="min-h-screen bg-gray-900 text-white pb-20">
            <div
                className="w-full h-[60vh] bg-cover bg-center relative"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.poster_path})` }}
            >
                <div className="absolute inset-0 bg-black/70 backdrop-blur-md flex items-center px-10 md:px-20">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="w-64 md:w-80 rounded-xl shadow-2xl"
                    />
                    <div className="ml-10">
                        <h1 className="text-5xl font-bold mb-4">{movie.title}</h1>
                        <p className="text-xl text-gray-300 mb-2">⭐ 평점: {movie.vote_average.toFixed(1)}</p>
                        <p className="text-lg text-gray-400 mb-6">📅 {movie.release_date} | ⏱️ {movie.runtime}분</p>
                        <div className="flex gap-2 mb-6">
                            {movie.genres.map((g) => (
                                <span key={g.id} className="bg-gray-800 px-3 py-1 rounded-full text-sm border border-gray-600">
                                    {g.name}
                                </span>
                            ))}
                        </div>
                        <p className="text-lg leading-relaxed max-w-3xl">{movie.overview || "상세 설명이 제공되지 않습니다."}</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-10 mt-16">
                <h2 className="text-3xl font-bold mb-8">주요 출연진</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
                    {credits.cast.slice(0, 12).map((actor) => (
                        <div key={actor.id} className="bg-gray-800 rounded-lg overflow-hidden shadow-lg text-center pb-4 hover:scale-105 transition-transform duration-300">
                            <img
                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                alt={actor.name}
                                className="w-full h-48 object-cover mb-3"
                            />
                            <h3 className="font-bold text-sm px-2 text-white">{actor.name}</h3>
                            <p className="text-gray-400 text-xs px-2 mt-1">{actor.character}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}