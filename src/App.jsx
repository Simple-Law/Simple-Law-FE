import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Admin from "pages/Admin";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Login from "pages/Login";
import Header from "components/header";
import AppLayout from "components/AppLayout";
import QuestPage from "pages/QuestPage";
import QuestPost from "pages/QuestPost";
import FindUserId from "pages/ FindUserId";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login/:type" element={<Login />} />
          <Route path="/findId" element={<FindUserId />} />
          <Route path="/admin" element={<Admin />}></Route>
          <Route path="/signup/:type" element={<SignUp />} />
          <Route path="/mail/quest" element={<QuestPost />} />
          <Route path="/" element={<LayoutWithHeader />}>
            <Route path="/board" element={<QuestPage />} />
            <Route path="/board/:type" element={<QuestPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};
