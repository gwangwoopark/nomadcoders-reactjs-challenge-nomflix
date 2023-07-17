const API_KEY = "4bf6d28ec3e509d09ffeca2fadbbcfcd";
const BASE_PATH = "https://api.themoviedb.org/3";

export interface IMovie {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
}

export interface IGetMoviesResult {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: IMovie[];
  total_pages: number;
  total_results: number;
}

export interface ITvShow {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
}

export interface IGetTvShowsResult {
  page: number;
  results: ITvShow[];
  total_pages: number;
  total_results: number;
}

export async function getNowPlayingMovies() {
  const url = `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getPopularMovies() {
  const url = `${BASE_PATH}/movie/popular?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getTopRatedMovies() {
  const url = `${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getUpcomingMovies() {
  const url = `${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getAiringToday() {
  const url = `${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getOnTheAir() {
  const url = `${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getPopular() {
  const url = `${BASE_PATH}/tv/popular?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function getTopRated() {
  const url = `${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function searchMovie(keyword: string) {
  const url = `${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

export async function searchTv(keyword: string) {
  const url = `${BASE_PATH}/search/tv?query=${keyword}&api_key=${API_KEY}`;
  return fetch(url).then((res) => res.json());
}

// export async function getMovie(id:number) {
//   const url = `${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`;
//   return fetch(url).then((res) => res.json());
// }
