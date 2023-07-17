import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IGetTvShowsResult,
  IMovie,
  ITvShow,
  getNowPlayingMovies,
  getPopularMovies,
  getTopRatedMovies,
  getUpcomingMovies,
  searchMovie,
  searchTv,
} from "../api";
import { styled } from "styled-components";
import { motion, AnimatePresence } from "framer-motion";
import { makeImagePath } from "../utils";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import { useLocation } from "react-router-dom";

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

enum SearchList {
  Movies = "Movies",
  TvShows = "TvShows",
}

enum Direction {
  Increase,
  Decrease,
}

export default function Search() {
  const { search } = useLocation();
  const keyword = new URLSearchParams(search).get("keyword");

  const { data: movies, isLoading: isLoadingMovies } =
    useQuery<IGetMoviesResult>(["movies", keyword], () =>
      searchMovie(keyword!)
    );

  const { data: tvShows, isLoading: isLoadingTvShows } =
    useQuery<IGetTvShowsResult>(["tvShows", keyword], () => searchTv(keyword!));

  const [indexMovies, setIndexMovies] = useState(0);
  const [indexTvShows, setIndexTvShows] = useState(0);

  const [scrollMovies, setScrollMovies] = useState(false);
  const [scrollTvShows, setScrollTvShows] = useState(false);

  const changeSearchListIndex = (list: SearchList, direction: Direction) => {
    switch (list) {
      case SearchList.Movies:
        if (movies && !scrollMovies) {
          toggleSearchListScroll(list);
          const totalMovies = movies.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexMovies((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexMovies((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case SearchList.TvShows:
        if (tvShows && !scrollTvShows) {
          toggleSearchListScroll(list);
          const totalMovies = tvShows.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexTvShows((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexTvShows((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
    }
  };

  const toggleSearchListScroll = (list: SearchList) => {
    switch (list) {
      case SearchList.Movies:
        setScrollMovies((prev) => !prev);
        break;
      case SearchList.TvShows:
        setScrollTvShows((prev) => !prev);
        break;
    }
  };

  const navigate = useNavigate();
  const onMovieBoxClicked = (movie: IMovie, list: SearchList) => {
    navigate(`movie/${movie.id}?keyword=${keyword}`, {
      state: { movie, from: list },
    });
  };

  const onTvShowBoxClicked = (tv: ITvShow, list: SearchList) => {
    navigate(`tv/${tv.id}?keyword=${keyword}`, { state: { tv, from: list } });
  };

  let bannerMovie: IMovie | null = null;
  if (!isLoadingMovies && movies) {
    bannerMovie = movies.results[0];
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
            <SliderTitle>Movies: Search Resuls</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeSearchListIndex(SearchList.Movies, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleSearchListScroll(SearchList.Movies)}
            >
              <Row
                key={SearchList.Movies + indexMovies + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {movies?.results
                  .slice(offset * indexMovies, offset * indexMovies + offset)
                  .map((movie) => (
                    <Box
                      layoutId={SearchList.Movies + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() =>
                        onMovieBoxClicked(movie, SearchList.Movies)
                      }
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
                changeSearchListIndex(SearchList.TvShows, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={1}>
            <SliderTitle>Tv Shows: Search Results</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeSearchListIndex(SearchList.TvShows, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleSearchListScroll(SearchList.TvShows)}
            >
              <Row
                key={SearchList.TvShows + indexTvShows + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {tvShows?.results
                  .slice(1)
                  .slice(offset * indexTvShows, offset * indexTvShows + offset)
                  .map((tvShow) => (
                    <Box
                      layoutId={SearchList.TvShows + tvShow.id}
                      key={tvShow.id}
                      bgphoto={makeImagePath(tvShow.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() =>
                        onTvShowBoxClicked(tvShow, SearchList.TvShows)
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{tvShow.name}</h4>
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
                changeSearchListIndex(SearchList.TvShows, Direction.Increase)
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
