import { useCallback, useMemo, useState } from 'react';
import { searchMovies } from './api/tmdb';
import MovieGrid from './components/MovieGrid';
import MovieModal from './components/MovieModal';
import MovieSearchForm from './components/MovieSearchForm';
import Navbar from './components/Navbar';
import { starterMovies } from './constants/starterMovies';
import type { Movie, SearchRequest } from './types/movie';

function App() {
  const [movies, setMovies] = useState<Movie[]>(starterMovies);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastQuery, setLastQuery] = useState('추천 영화');
  const [activeLanguage, setActiveLanguage] = useState('ko-KR');
  const [adultFilter, setAdultFilter] = useState(false);

  const resultSummary = useMemo(() => {
    const count = movies.length.toLocaleString('ko-KR');
    const adultText = adultFilter ? '성인 콘텐츠 포함' : '성인 콘텐츠 제외';

    return `${lastQuery} · ${count}편 · ${activeLanguage} · ${adultText}`;
  }, [activeLanguage, adultFilter, lastQuery, movies.length]);

  const handleSearch = useCallback(async (request: SearchRequest) => {
    const query = request.query.trim();

    if (!query) {
      setErrorMessage('검색할 영화 제목을 입력해주세요.');
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    setLastQuery(query);
    setActiveLanguage(request.language);
    setAdultFilter(request.includeAdult);

    try {
      const results = await searchMovies({ ...request, query });
      setMovies(results);
    } catch (error) {
      const message = error instanceof Error ? error.message : '영화 검색 중 문제가 발생했습니다.';
      setErrorMessage(message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSelectMovie = useCallback((movie: Movie) => {
    setSelectedMovie(movie);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedMovie(null);
  }, []);

  return (
    <div className="min-h-screen bg-[#11100f] text-[#f8f4ee]">
      <Navbar resultCount={movies.length} />

      <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-5 pb-20 pt-8">
        <MovieSearchForm isLoading={isLoading} onSearch={handleSearch} />
        <MovieGrid
          errorMessage={errorMessage}
          isLoading={isLoading}
          movies={movies}
          onSelectMovie={handleSelectMovie}
          summary={resultSummary}
        />
      </main>

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
    </div>
  );
}

export default App;
