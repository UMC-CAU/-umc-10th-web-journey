import { useState } from 'react';
import { useParams } from 'react-router-dom';
import useCustomFetch from '../hooks/useCustomFetch';
import LoadingSpinner from '../components/LoadingSpinner';
import MovieCard from '../components/MovieCard';
import ButtonComponent from '../components/ButtonComponent';
import type { MovieResponse } from '../types/movie';

export default function MoviePage() {
    const { category } = useParams<{ category: string }>();
    const [page, setPage] = useState(1);

    const { data: response, loading: isPending, error: isError } = useCustomFetch<MovieResponse>(
        category ? `https://api.themoviedb.org/3/movie/${category}?language=ko-KR&page=${page}` : ''
    );

    const movies = response?.results || [];
    // TMDB API usually limits access to max 500 pages
    const totalPages = Math.min(response?.total_pages || 1, 500);

    const getCategoryTitle = (cat: string | undefined) => {
        switch (cat) {
            case 'popular': return '인기 영화';
            case 'now_playing': return '현재 상영 중';
            case 'top_rated': return '평점 높은 영화';
            case 'upcoming': return '개봉 예정 영화';
            default: return '영화 탐색';
        }
    };

    if (isError) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-900">
            <div className="text-rose-500 bg-rose-500/10 px-6 py-4 rounded-xl border border-rose-500/20 text-xl font-medium tracking-wide shadow-lg shadow-rose-500/5">
                데이터를 불러오는 데 실패했습니다.
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-900 px-6 py-12 md:px-12 lg:px-20 selection:bg-emerald-500/30 selection:text-emerald-200">
            <div className="max-w-7xl mx-auto">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight drop-shadow-md">
                        {getCategoryTitle(category)}
                    </h1>
                </header>

                {isPending ? (
                    <div className="flex justify-center py-20">
                        <LoadingSpinner />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 gap-y-10">
                        {movies.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                )}

                <ButtonComponent page={page} totalPages={totalPages} setPage={setPage} />
            </div>
        </div>
    );
}