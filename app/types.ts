export type Movies = {
  slice(arg0: number, arg1: number): unknown;
  genres: any;
  runtime: number;
  adult: boolean;
  backdrop_path: string | null;
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  media_type: "movie" | string;
  original_language: string;
  genre_ids: number[];
  popularity: number;
  release_date: string; // ISO date string
  video: boolean;
  vote_average: number;
  vote_count: number;
};
export type TrailerResult = {
  iso_639_1: string; // хэл (e.g. "en")
  iso_3166_1: string; // улс (e.g. "US")
  name: string; // video гарчиг
  key: string; // YouTube video ID
  site: string; // "YouTube"
  size: number; // 720, 1080 гэх мэт
  type: string; // "Trailer", "Teaser" гэх мэт
  official: boolean; // албан ёсны эсэх
  published_at: string; // ISO date string
  id: string; // video ID
};
export type MovieVideosResponse = {
  id: number; // movie ID (e.g. 550)
  results: TrailerResult[];
};
export interface CastMember {
  adult: boolean;
  gender: number;
  id: number;
  known_for_department: string;
  name: string;
  original_name: string;
  popularity: number;
  profile_path: string | null;
  cast_id: number;
  character: string;
  credit_id: string;
  order: number;
}

export interface MovieCredits {
  id: number;
  cast: CastMember[];

  crew?: any[];
}
export interface MovieResult {
  adult: boolean;
  backdrop_path: string | null;
  genre_ids: number[];
  id: number;
  original_language: string;
  original_title: string;
  overview: string;
  popularity: number;
  poster_path: string | null;
  release_date: string;
  title: string;
  video: boolean;
  vote_average: number;
  vote_count: number;
}

export interface TMDBResponse {
  page: number;
  results: MovieResult[];
  total_pages: number;
  total_results: number;
}
export interface Genre {
  id: number;
  name: string;
}

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
  vote_average: number;
}
