import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { styled } from "styled-components";
import { makeImagePath } from "../utils";
import { IMovie } from "../api";

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0;
`;

const Movie = styled(motion.div)`
  position: fixed;
  width: 40vw;
  height: 80vh;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  margin: auto auto;
  background-color: ${(props) => props.theme.black.lighter};
  border-radius: 15px;
  overflow: hidden;
`;

const Cover = styled.div<{ bgphoto: string }>`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center center;
  background-image: url(${(props) => props.bgphoto});
`;

const Title = styled.h3`
  color: ${(props) => props.theme.white.lighter};
  font-size: 16px;
  padding: 20px;
  position: relative;
  top: -60px;
`;

const Overview = styled.p`
  color: ${(props) => props.theme.white.lighter};
  font-size: 12px;
  padding: 20px;
  position: relative;
  top: -60px;
`;

export default function MovieCard() {
  const navigate = useNavigate();
  const onOverlayClicked = () => {
    navigate(-1);
  };
  const match = useMatch("/movie/:id");
  const { state } = useLocation();
  const { movie }: { movie: IMovie } = state;
  const { from }: { from: string } = state;
  console.log(movie.backdrop_path);
  return (
    <>
      <AnimatePresence key={movie.id}>
        <Overlay
          onClick={onOverlayClicked}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        ></Overlay>
        <Movie layoutId={from + match?.params.id + ""} key={movie.id}>
          <Cover bgphoto={makeImagePath(movie.backdrop_path, "w500")} />
          <Title>{movie.title}</Title>
          <Overview>{movie.overview}</Overview>
        </Movie>
      </AnimatePresence>
    </>
  );
}
