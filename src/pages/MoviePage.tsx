import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import type { Movie, MovieResponse } from '../types/movie';

export default function MoviePage() {
    const { category } = useParams<{ category: string }>();
    const [movies, setMovies] = useState<Movie[]>([]);
    const [isPending, setIsPending] = useState(false);
    const [isError, setIsError] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const fetchMovies = async () => {
            setIsPending(true);
            setIsError(false);
            try {
                const response = await axios.get<MovieResponse>(
                    `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}`,
                    { headers: { Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}` } }
                );
                setMovies(response.data.results);
            } catch {
                setIsError(true);
            } finally {
                setIsPending(false);
            }
        };

        fetchMovies();
    }, [category, page]);

    if (isError) return <div className="text-red-500 text-2xl text-center py-10">에러가 발생했습니다.</div>;

    return (
        <div className="min-h-screen px-10 py-10 bg-gray-50">
            {isPending ? (
                <LoadingSpinner />
            ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map((movie) => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            )}
            <div className="flex items-center justify-center gap-4 mt-10">
                <button
                    onClick={() => setPage((prev) => prev - 1)}
                    disabled={page === 1}
                    className="px-6 py-3 rounded-lg text-white bg-[#bedab1] shadow-md transition duration-200 disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-[#a6ca98]"
                >
                    이전
                </button>

                <span className="font-bold text-lg">{page} 페이지</span>

                <button
                    onClick={() => setPage((prev) => prev + 1)}
                    className="px-6 py-3 rounded-lg text-white bg-[#bedab1] shadow-md transition duration-200 hover:bg-[#a6ca98]"
                >
                    다음
                </button>
            </div>
        </div>
    );
}