import { useQuery } from "react-query";
import {
  IGetMoviesResult,
  IGetTvShowsResult,
  IMovie,
  ITvShow,
  getAiringToday,
  getNowPlayingMovies,
  getOnTheAir,
  getPopular,
  getPopularMovies,
  getTopRated,
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

enum TvShowsList {
  AiringToday = "AiringToday",
  OnTheAir = "OnTheAir",
  Popular = "Popular",
  TopRated = "TopRated",
}

enum Direction {
  Increase,
  Decrease,
}

export default function Home() {
  const { data: airingToday, isLoading: isLoadingAiringToday } =
    useQuery<IGetTvShowsResult>(["tvshows", "airingToday"], getAiringToday);
  const { data: popular, isLoading: isLoadingPopular } =
    useQuery<IGetTvShowsResult>(["tvshows", "popular"], getPopular);
  const { data: topRated, isLoading: isLoadingTopRated } =
    useQuery<IGetTvShowsResult>(["tvshows", "topRated"], getTopRated);
  const { data: onTheAir, isLoading: isLoadingOnTheAir } =
    useQuery<IGetTvShowsResult>(["tvshows", "upcoming"], getOnTheAir);

  const [indexAiringToday, setIndexAiringToday] = useState(0);
  const [indexPopular, setIndexPopular] = useState(0);
  const [indexTopRated, setIndexTopRated] = useState(0);
  const [indexOnTheAir, setIndexOnTheAir] = useState(0);

  const [scrollAiringToday, setScrollAiringToday] = useState(false);
  const [scrollPopular, setScrollPopular] = useState(false);
  const [scrollTopRated, setScrollTopRated] = useState(false);
  const [scrollOnTheAir, setScrollOnTheAir] = useState(false);

  const changeTvShowsIndex = (list: TvShowsList, direction: Direction) => {
    switch (list) {
      case TvShowsList.AiringToday:
        if (airingToday && !scrollAiringToday) {
          toggleTvListScroll(list);
          const totalMovies = airingToday.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexAiringToday((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexAiringToday((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case TvShowsList.Popular:
        if (popular && !scrollPopular) {
          toggleTvListScroll(list);
          const totalMovies = popular.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexPopular((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexPopular((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case TvShowsList.TopRated:
        if (topRated && !scrollTopRated) {
          toggleTvListScroll(list);
          const totalMovies = topRated.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexTopRated((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexTopRated((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
      case TvShowsList.OnTheAir:
        if (onTheAir && !scrollOnTheAir) {
          toggleTvListScroll(list);
          const totalMovies = onTheAir.results.length;
          const maxIndex = Math.floor(totalMovies / offset) - 1;
          if (direction === Direction.Decrease) {
            setIndexOnTheAir((prev) => (prev === 0 ? maxIndex : prev - 1));
          } else {
            setIndexOnTheAir((prev) => (prev === maxIndex ? 0 : prev + 1));
          }
        }
        break;
    }
  };

  const toggleTvListScroll = (list: TvShowsList) => {
    switch (list) {
      case TvShowsList.AiringToday:
        setScrollAiringToday((prev) => !prev);
        break;
      case TvShowsList.Popular:
        setScrollPopular((prev) => !prev);
        break;
      case TvShowsList.TopRated:
        setScrollTopRated((prev) => !prev);
        break;
      case TvShowsList.OnTheAir:
        setScrollOnTheAir((prev) => !prev);
        break;
    }
  };

  const navigate = useNavigate();
  const onBoxClicked = (tv: ITvShow, list: TvShowsList) => {
    console.log(tv.id);
    navigate(`${tv.id}`, { state: { tv, from: list } });
  };

  let bannerMovie: ITvShow | null = null;
  if (!isLoadingOnTheAir && onTheAir) {
    bannerMovie = onTheAir.results[0];
  }

  console.log(topRated);

  return (
    <Wrapper>
      {!bannerMovie ? (
        <Loader>Loading...</Loader>
      ) : (
        <>
          <Banner bgphoto={makeImagePath(bannerMovie.backdrop_path || "")}>
            <Title>{bannerMovie.name}</Title>
            <Overview>{bannerMovie.overview}</Overview>
          </Banner>
          <Slider index={0}>
            <SliderTitle>Latest Shows</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeTvShowsIndex(TvShowsList.OnTheAir, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleTvListScroll(TvShowsList.OnTheAir)}
            >
              <Row
                key={TvShowsList.OnTheAir + indexOnTheAir + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {onTheAir?.results
                  .slice(1)
                  .slice(
                    offset * indexOnTheAir,
                    offset * indexOnTheAir + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={TvShowsList.OnTheAir + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, TvShowsList.OnTheAir)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
                      </Info>
                    </Box>
                  ))}
              </Row>
            </AnimatePresence>
            <Arrow
              style={{ right: 1 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeTvShowsIndex(TvShowsList.OnTheAir, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={1}>
            <SliderTitle>Airing Today</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeTvShowsIndex(TvShowsList.AiringToday, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleTvListScroll(TvShowsList.AiringToday)}
            >
              <Row
                key={TvShowsList.AiringToday + indexAiringToday + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {airingToday?.results
                  .slice(1)
                  .slice(
                    offset * indexAiringToday,
                    offset * indexAiringToday + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={TvShowsList.AiringToday + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() =>
                        onBoxClicked(movie, TvShowsList.AiringToday)
                      }
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
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
                changeTvShowsIndex(TvShowsList.AiringToday, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={2}>
            <SliderTitle>Popular Shows</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeTvShowsIndex(TvShowsList.Popular, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleTvListScroll(TvShowsList.Popular)}
            >
              <Row
                key={TvShowsList.Popular + indexPopular + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {popular?.results
                  .slice(1)
                  .slice(offset * indexPopular, offset * indexPopular + offset)
                  .map((movie) => (
                    <Box
                      layoutId={TvShowsList.Popular + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, TvShowsList.Popular)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
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
                changeTvShowsIndex(TvShowsList.Popular, Direction.Increase)
              }
            >
              <path d="M0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM281 385c-9.4 9.4-24.6 9.4-33.9 0s-9.4-24.6 0-33.9l71-71L136 280c-13.3 0-24-10.7-24-24s10.7-24 24-24l182.1 0-71-71c-9.4-9.4-9.4-24.6 0-33.9s24.6-9.4 33.9 0L393 239c9.4 9.4 9.4 24.6 0 33.9L281 385z" />
            </Arrow>
          </Slider>
          <Slider index={3}>
            <SliderTitle>Top Rated Shows</SliderTitle>
            <Arrow
              style={{ left: 0 }}
              xmlns="http://www.w3.org/2000/svg"
              height="1em"
              viewBox="0 0 512 512"
              onClick={() =>
                changeTvShowsIndex(TvShowsList.TopRated, Direction.Decrease)
              }
            >
              <path d="M512 256A256 256 0 1 0 0 256a256 256 0 1 0 512 0zM231 127c9.4-9.4 24.6-9.4 33.9 0s9.4 24.6 0 33.9l-71 71L376 232c13.3 0 24 10.7 24 24s-10.7 24-24 24l-182.1 0 71 71c9.4 9.4 9.4 24.6 0 33.9s-24.6 9.4-33.9 0L119 273c-9.4-9.4-9.4-24.6 0-33.9L231 127z" />
            </Arrow>
            <AnimatePresence
              initial={false}
              onExitComplete={() => toggleTvListScroll(TvShowsList.TopRated)}
            >
              <Row
                key={TvShowsList.TopRated + indexTopRated + ""}
                variants={rowVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ type: "tween", duration: 1 }}
              >
                {topRated?.results
                  .slice(1)
                  .slice(
                    offset * indexTopRated,
                    offset * indexTopRated + offset
                  )
                  .map((movie) => (
                    <Box
                      layoutId={TvShowsList.TopRated + movie.id}
                      key={movie.id}
                      bgphoto={makeImagePath(movie.backdrop_path, "w500")}
                      variants={boxVariants}
                      initial="normal"
                      whileHover="hover"
                      transition={{ type: "twin" }}
                      onClick={() => onBoxClicked(movie, TvShowsList.TopRated)}
                    >
                      <Info variants={infoVariants}>
                        <h4>{movie.name}</h4>
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
                changeTvShowsIndex(TvShowsList.TopRated, Direction.Increase)
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
