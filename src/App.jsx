import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "new/pages/Admin";
import SignUp from "new/pages/SignUp";
import Home from "new/pages/Home";
import Login from "new/pages/Login";

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
