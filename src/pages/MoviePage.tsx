// src/pages/MoviePage.tsx
import { useEffect, useState } from 'react';
import axios from 'axios';
import type { Movie, MovieResponse } from '../types/movie';
import MovieCard from '../components/MovieCard';

export default function MoviePage() {
    const [movies, setMovies] = useState<Movie[]>([]);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await axios.get<MovieResponse>('https://api.themoviedb.org/3/movie/popular?language=ko-KR&page=1', {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_TMDB_KEY}`
                    }
                });
                setMovies(response.data.results);
            } catch (error) {
                console.error('데이터를 불러오는데 실패했어요!', error);
            }
        };

        fetchMovies();
    }, []);

    return (
        <div className="px-10 py-10 bg-gray-50 min-h-screen">
            <h1 className="text-3xl font-bold mb-8 text-center">인기 영화 목록 🎬</h1>

            {/* 반응형 Grid 적용! 화면 크기가 커질수록 2개 -> 3개 -> 4개 -> 6개로 늘어나! */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {/* 배열에 있는 20개의 영화를 map() 함수를 통해 카드로 변신시켜 줌! */}
                {movies.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                ))}
            </div>
        </div>
    );
}