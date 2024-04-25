import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import JoinForm from "components/SignUpForm";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login admin={true} />} />
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/join/:type" element={<JoinForm />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
