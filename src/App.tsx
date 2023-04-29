import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Ironfish from "./views/ironfish";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/ironfish" element={<Ironfish />} />
          <Route path="*" element={<Ironfish />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
