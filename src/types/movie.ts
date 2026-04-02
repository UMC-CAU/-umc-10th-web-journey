// src/types/movie.ts

// 1. 영화 하나하나의 데이터 모양을 정의해. (영상에서 강사님이 하나하나 타이핑하신 부분이야!)
export interface Movie {
    id: number;
    title: string;
    overview: string;
    poster_path: string;
    // 원래는 더 많지만, UI를 그리는 데 필요한 핵심 데이터만 먼저 적어봤어!
}

// 2. Axios로 받아오는 전체 응답 데이터의 모양을 정의해.
export interface MovieResponse {
    page: number;
    results: Movie[]; // 결과창 안에는 우리가 위에서 정의한 영화(Movie)들의 배열이 들어있어!
    total_pages: number;
    total_results: number;
}