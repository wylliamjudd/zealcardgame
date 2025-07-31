import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Verify from "./Verify";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verify" element={<Verify />} />
    </Routes>
  );
}
