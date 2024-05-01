import { BrowserRouter, Routes, Route } from "react-router-dom";
import Admin from "./pages/admin";
import Login from "./pages/login";
import SignUp from "./pages/SignUp";
import Agreement from "components/SignUpForm/Agreement";
import JoinForm from "components/SignUpForm";
import Detail from "components/SignUpForm/Detail";
import Choice from "components/SignUpForm/Choice";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin/login" element={<Login admin={true} />} />
        <Route path="/admin" element={<Admin />}></Route>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signup/:type" element={<Agreement />} />
        {/* <Route path="/signup/:type/form" element={<JoinForm />} /> */}
        <Route path="/signup/:type/form" element={<JoinForm />} />
        <Route path="/signup/:type/form/detail" element={<Detail />} />
        <Route path="/signup/:type/form/detail/choice" element={<Choice />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
