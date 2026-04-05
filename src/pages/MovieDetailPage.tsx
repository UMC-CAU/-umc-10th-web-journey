import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';

interface MovieDetail {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
}

export default function MovieDetailPage() {
    const { movieId } = useParams<{ movieId: string }>();
    const [movie, setMovie] = useState<MovieDetail | null>(null);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const fetchMovieDetail = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const response = await axios.get<MovieDetail>(
                    `https://api.themoviedb.org/3/movie/${movieId}?language=ko-KR`,
                    { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
                );
                setMovie(response.data);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        if (movieId) fetchMovieDetail();
    }, [movieId]);

    if (isError) return <div className="text-red-500 text-center py-10 text-2xl">에러가 발생했습니다.</div>;
    if (isPending) return <LoadingSpinner />;
    if (!movie) return null;

    return (
        <div className="max-w-4xl mx-auto p-10 flex flex-col md:flex-row gap-10 mt-10 bg-white rounded-2xl shadow-xl">
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-full md:w-1/2 rounded-xl shadow-lg object-cover"
            />
            <div className="flex flex-col justify-center">
                <h1 className="text-4xl font-bold mb-4">{movie.title}</h1>
                <p className="text-xl font-semibold text-gray-700 mb-2">⭐ 평점: {movie.vote_average.toFixed(1)}</p>
                <p className="text-lg text-gray-500 mb-6">📅 개봉일: {movie.release_date}</p>
                <p className="text-gray-800 leading-relaxed text-lg">{movie.overview || "상세 설명이 없습니다."}</p>
            </div>
        </div>
    );
}