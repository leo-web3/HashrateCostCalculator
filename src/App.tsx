import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Ironfish from "./views/ironfish";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Ironfish />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
