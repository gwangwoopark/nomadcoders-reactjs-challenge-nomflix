import { Outlet } from "react-router-dom";
import Header from "./components/Header";

function App() {
  return (
    <div style={{ height: "200vh" }}>
      <Header></Header>
      <Outlet></Outlet>
    </div>
  );
}

export default App;
