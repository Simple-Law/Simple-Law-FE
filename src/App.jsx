import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp";
import Agreement from "components/SignUpForm/Agreement";
import JoinForm from "components/SignUpForm";
import Detail from "pages/SignUp/Steps/Detail";
import Choice from "pages/SignUp/Steps/Choice";
import Home from "pages/home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login/:type" element={<Login />} />
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/signup/:type" element={<SignUp />} />
        {/* <Route path="/signup/:type" element={<JoinForm />} /> */}
        {/* <Route path="/signup/:type/form" element={<JoinForm />} /> */}
        {/* <Route path="/signup/:type/form" element={<JoinForm />} />
        <Route path="/signup/:type/form/detail" element={<Detail />} />
        <Route path="/signup/:type/form/detail/choice" element={<Choice />} /> */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
