import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IMovie,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
} from "../api";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Wrapper = styled.div`
  background-color: black;
`;

const Loader = styled.div`
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Banner = styled.div<{ bgphoto: string }>`
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-left: 60px;
  background-image: linear-gradient(rgba(0, 0, 0, 0), rgba(0, 0, 0, 1)),
    url(${(props) => props.bgphoto});
  background-size: cover;
`;

const Title = styled.h2`
  font-size: 32px;
  margin-bottom: 10px;
`;

const Overview = styled.p`
  font-size: 18px;
  width: 50%;
`;

const Slider = styled.div<{ index: number }>`
  position: relative;
  top: ${(props) => props.index * 300 - 100}px;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
`;

const SliderTitle = styled.div`
  position: absolute;
  left: 10px;
  top: -140px;
`;

const Arrow = styled.svg`
  position: absolute;
  path {
    /* stroke-width: 24px; */
    stroke: ${(props) => props.theme.white.darker};
  }
  height: 40px;
  margin: 0 16px;
  z-index: 99;
  fill: ${(props) => props.theme.black.darker};
`;

const Row = styled(motion.div)`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 5px;
  position: absolute;
  width: 100%;
`;

const rowVariants = {
  hidden: {
    x: window.innerWidth - 5,
  },
  visible: {
    x: 0,
  },
  exit: {
    x: -window.innerWidth + 5,
  },
};

const Box = styled(motion.div)<{ bgphoto: string }>`
  background-color: white;
  height: 200px;
  color: red;
  font-size: 64px;
  background-image: url(${(props) => props.bgphoto});
  background-size: cover;
  background-position: center;
  &:first-child {
    transform-origin: center left;
  }
  &:last-child {
    transform-origin: center right;
  }
`;

const boxVariants = {
  normal: {
    scale: 1,
  },
  hover: {
    scale: 1.3,
    y: -50,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "twin",
    },
  },
};

const Info = styled(motion.div)`
  padding: 10px;
  background-color: ${(props) => props.theme.black.lighter};
  opacity: 0;
  position: absolute;
  width: 100%;
  bottom: 0;
  h4 {
    text-align: center;
    font-size: 10px;
    color: ${(props) => props.theme.white.lighter};
  }
`;

const infoVariants = {
  hover: {
    opacity: 1,
    transition: {
      delay: 0.5,
      duration: 0.1,
      type: "twin",
    },
  },
};

const offset = 6;

enum MovieList {
  NowPlaying = "NowPlaying",
  Popular = "Popular",
  TopRated = "topRated",
  Upcoming = "Upcoming",
}

enum Direction {
  Increase,
  Decrease,
}

export default function Home() {
  const { data: nowPlayingMovies, isLoading: isLoadingNowPlayingMovies } =
    useQuery<IGetMoviesResult>(["movies", "nowPlaying"], getNowPlayingMovies);
  const { data: popularMovies, isLoading: isLoadingPopularMovies } =
    useQuery<IGetMoviesResult>(["movies", "popular"], getPopularMovies);
  const { data: topRatedMovies, isLoading: isLoadingTopRatedMovies } =
    useQuery<IGetMoviesResult>(["movies", "topRated"], getTopRatedMovies);
  const { data: upcomingMovies, isLoading: isLoadingUpcomingMovies } =
    useQuery<IGetMoviesResult>(["movies", "upcoming"], getUpcomingMovies);

  const [indexNowPlaying, setIndexNowPlaying] = useState(0);
  const [indexPopular, setIndexPopular] = useState(0);
  const [indexTopRated, setIndexTopRated] = useState(0);
  const [indexUpcoming, setIndexUpcoming] = useState(0);

  const [scrollNowPlaying, setScrollNowPlaying] = useState(false);
  const [scrollPopular, setScrollPopular] = useState(false);
  const [scrollTopRated, setScrollTopRated] = useState(false);
  const [scrollUpcoming, setScrollUpcoming] = useState(false);

  const changeMovieListIndex = (list: MovieList, direction: Direction) => {
    switch (list) {
      case MovieList.NowPlaying:
        if (nowPlayingMovies && !scrollNowPlaying) {
          toggleMovieListScroll(list);
          const totalMovies = nowPlayingMovies.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexNowPlaying((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexNowPlaying((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case MovieList.Popular:
        if (popularMovies && !scrollPopular) {
          toggleMovieListScroll(list);
          const totalMovies = popularMovies.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexPopular((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexPopular((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case MovieList.TopRated:
        if (topRatedMovies && !scrollTopRated) {
          toggleMovieListScroll(list);
          const totalMovies = topRatedMovies.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexTopRated((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexTopRated((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case MovieList.Upcoming:
        if (upcomingMovies && !scrollUpcoming) {
          toggleMovieListScroll(list);
          const totalMovies = upcomingMovies.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexUpcoming((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexUpcoming((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
    }
  };

  const toggleMovieListScroll = (list: MovieList) => {
    switch (list) {
      case MovieList.NowPlaying:
        setScrollNowPlaying((prev) => !prev);
        break;
      case MovieList.Popular:
        setScrollPopular((prev) => !prev);
        break;
      case MovieList.TopRated:
        setScrollTopRated((prev) => !prev);
        break;
      case MovieList.Upcoming:
        setScrollUpcoming((prev) => !prev);
        break;
    }
  };

  const navigate = useNavigate();
  const onBoxClicked = (movie: IMovie, list: MovieList) => {
    navigate(`movie/${movie.id}`, { state: { movie, from: list } });
  };

  let bannerMovie: IMovie | null = null;
  if (!isLoadingNowPlayingMovies && nowPlayingMovies) {
    bannerMovie = nowPlayingMovies.results[0];
  }

  return (
    <Wrapper>
      {!bannerMovie ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(bannerMovie.backdrop_path || "")}>
            <Title>{bannerMovie.title}</Title>
            <Overview>{bannerMovie.overview}</Overview>
          </Banner>
          <Slider index={0}>
            <SliderTitle>Now Playing Movies</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.NowPlaying, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleMovieListScroll(MovieList.NowPlaying)}
            >
              <Row
                key={MovieList.NowPlaying + indexNowPlaying + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {nowPlayingMovies?.results
                  .slice(1)
                  .slice(
                    offset * indexNowPlaying,
                    offset * indexNowPlaying + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={MovieList.NowPlaying + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, MovieList.NowPlaying)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow
              style={{ right: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.NowPlaying, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={1}>
            <SliderTitle>Latest Movies</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.Popular, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleMovieListScroll(MovieList.Popular)}
            >
              <Row
                key={MovieList.Popular + indexPopular + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {popularMovies?.results
                  .slice(1)
                  .slice(offset * indexPopular, offset * indexPopular + offset)
                  .map((movie) => (
                    <Box
                      layoutId={MovieList.Popular + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, MovieList.Popular)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow
              style={{ right: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.Popular, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={2}>
            <SliderTitle>Top Rated Movies</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.TopRated, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleMovieListScroll(MovieList.TopRated)}
            >
              <Row
                key={MovieList.TopRated + indexTopRated + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {topRatedMovies?.results
                  .slice(1)
                  .slice(
                    offset * indexTopRated,
                    offset * indexTopRated + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={MovieList.TopRated + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, MovieList.TopRated)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow
              style={{ right: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.Popular, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={3}>
            <SliderTitle>Upcoming Movies</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.Upcoming, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleMovieListScroll(MovieList.Upcoming)}
            >
              <Row
                key={MovieList.Upcoming + indexUpcoming + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {popularMovies?.results
                  .slice(1)
                  .slice(
                    offset * indexUpcoming,
                    offset * indexUpcoming + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={MovieList.Upcoming + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, MovieList.Upcoming)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.title}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow
              style={{ right: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeMovieListIndex(MovieList.Upcoming, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Outlet></Outlet>
        </>
      )}
    </Wrapper>
  );
}
