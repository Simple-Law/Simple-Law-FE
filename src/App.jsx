import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";

import Home from "pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:type" element={<Login />} />
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/signup/:type" element={<SignUp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
