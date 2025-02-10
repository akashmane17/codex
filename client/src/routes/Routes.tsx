import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Editor from "../pages/Editor";

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/:roomId" element={<Editor />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
