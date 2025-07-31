import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Verified from "./Verified";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/verified" element={<Verified />} />
    </Routes>
  );
}
