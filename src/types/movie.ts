export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
}

export interface MovieResponse {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export interface MovieDetail {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    vote_average: number;
    release_date: string;
    runtime: number;
    genres: { id: number; name: string }[];
}

export interface Cast {
    id: number;
    name: string;
    character: string;
    profile_path: string;
}

export interface CreditsResponse {
    id: number;
    cast: Cast[];
}