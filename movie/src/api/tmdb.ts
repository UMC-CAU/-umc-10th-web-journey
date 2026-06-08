import type { Movie, SearchRequest } from '../types/movie';

interface TmdbSearchResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

const TMDB_SEARCH_URL = 'https://api.themoviedb.org/3/search/movie';
const TMDB_IMAGE_URL = 'https://image.tmdb.org/t/p';

const accessToken = import.meta.env.VITE_TMDB_ACCESS_TOKEN as string | undefined;
const apiKey = import.meta.env.VITE_TMDB_API_KEY as string | undefined;

export const getTmdbImageUrl = (
  path: string | null,
  size: 'w342' | 'w500' | 'w780' | 'original' = 'w500',
) => {
  if (!path) return null;

  return `${TMDB_IMAGE_URL}/${size}${path}`;
};

export const searchMovies = async ({
  query,
  includeAdult,
  language,
}: SearchRequest): Promise<Movie[]> => {
  if (!accessToken && !apiKey) {
    throw new Error('TMDB 환경 변수가 없습니다. VITE_TMDB_ACCESS_TOKEN 또는 VITE_TMDB_API_KEY를 설정해주세요.');
  }

  const params = new URLSearchParams({
    include_adult: String(includeAdult),
    language,
    page: '1',
    query,
  });

  const headers: HeadersInit = {};

  if (apiKey) {
    params.set('api_key', apiKey);
  } else if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  const response = await fetch(`${TMDB_SEARCH_URL}?${params.toString()}`, { headers });

  if (!response.ok) {
    throw new Error(`TMDB 검색 요청 실패: ${response.status}`);
  }

  const data = (await response.json()) as TmdbSearchResponse;

  return data.results;
};
