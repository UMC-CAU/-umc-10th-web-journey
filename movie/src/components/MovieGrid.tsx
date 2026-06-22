import { memo, useMemo } from 'react';
import type { Movie } from '../types/movie';
import MovieCard from './MovieCard';

interface MovieGridProps {
  errorMessage: string | null;
  isLoading: boolean;
  movies: Movie[];
  onSelectMovie: (movie: Movie) => void;
  summary: string;
}

const MovieGrid = memo(({ errorMessage, isLoading, movies, onSelectMovie, summary }: MovieGridProps) => {
  const sortedMovies = useMemo(
    () => [...movies].sort((first, second) => second.popularity - first.popularity),
    [movies],
  );

  return (
    <section className="flex flex-col gap-5">
      <header className="flex flex-col gap-2 border-b border-[#2e2a26] pb-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#f8f4ee]">영화 검색 결과</h2>
          <p className="mt-1 text-sm text-[#d0c7b8]">{summary}</p>
        </div>
        {isLoading && <p className="text-sm font-semibold text-[#43b7a7]">TMDB에서 불러오는 중</p>}
      </header>

      {errorMessage && (
        <div className="rounded-lg border border-[#e64646]/50 bg-[#3a1818] px-4 py-3 text-sm text-[#ffd7d7]">
          {errorMessage}
        </div>
      )}

      {!isLoading && sortedMovies.length === 0 && (
        <div className="grid min-h-56 place-items-center rounded-lg border border-dashed border-[#4a433b] text-center text-[#d0c7b8]">
          검색 결과가 없습니다.
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {sortedMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onSelectMovie={onSelectMovie} />
        ))}
      </div>
    </section>
  );
});

MovieGrid.displayName = 'MovieGrid';

export default MovieGrid;
