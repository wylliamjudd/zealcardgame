import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import HowToPlay from "./HowToPlay";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/how-to-play" element={<HowToPlay />} />
    </Routes>
  );
}
