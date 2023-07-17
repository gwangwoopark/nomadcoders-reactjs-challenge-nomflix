import { createBrowserRouter } from "react-router-dom";
import Home from "./screens/Home";
import Tv from "./screens/Tv";
import Search from "./screens/Search";
import Root from "./Root";
import MovieCard from "./components/MovieCard";
import TvShowCard from "./components/TvShowCard";

const router = createBrowserRouter([
  {
    path: "/nomadcoders-reactjs-challenge-nomflix/",
    element: <Root />,
    children: [
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: "movie/:id",
            element: <MovieCard />,
          },
        ],
      },
      {
        path: "tv",
        element: <Tv />,
        children: [
          {
            path: ":id",
            element: <TvShowCard />,
          },
        ],
      },
      {
        path: "search",
        element: <Search />,
        children: [
          {
            path: "movie/:id",
            element: <MovieCard />,
          },
          {
            path: "tv/:id",
            element: <TvShowCard />,
          },
        ],
      },
    ],
  },
]);

export default router;
