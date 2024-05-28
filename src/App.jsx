// import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Admin from "pages/Admin";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Login from "pages/Login";
import Header from "components/header";
import AppLayout from "components/AppLayout";
import QuestPage from "pages/QuestPage";
import QuestPost from "pages/QuestPost";
import FindUserId from "pages/FindUserId";
import DetailPage from "pages/DetailPage";
import RightSideMenu from "components/RightSideMenu";
import ReQuestion from "pages/ReQuestion";

import { MailProvider } from "contexts/MailContexts";
import { useMailContext } from "contexts/MailContexts";
import { AuthProvider } from "contexts/AuthContext";
import PrivateRoute from "router/PrivateRoute";

const App = () => {
  return (
    <AuthProvider>
      <MailProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<AppLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/login/:type" element={<Login />} />
              <Route path="/findId" element={<FindUserId />} />
              <Route path="/admin/*" element={<Admin />} />
              <Route path="/signup/:type" element={<SignUp />} />
              <Route path="/mail/quest" element={<QuestPost />} />
              <Route path="/requestion/:id" element={<ReQuestion />} />
              <Route element={<LayoutWithHeader />}>
                {/* <Route element={<PrivateRoute />}> */}
                <Route element={<LayoutWithSidebar />}>
                  <Route path="/detail/:id" element={<DetailPage />} />
                  <Route path="/board" element={<QuestPage />} />
                </Route>
                {/* </Route> */}
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </MailProvider>
    </AuthProvider>
  );
};

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
};

const LayoutWithSidebar = () => {
  const { state, dispatch } = useMailContext();

  const { data, counts } = state;

  const handleMenuClick = filteredMails => {
    dispatch({ type: "SET_MAILS", payload: filteredMails });
  };

  return (
    <div className="flex w-full pt-16">
      <RightSideMenu data={data} counts={counts} onMenuClick={handleMenuClick} />
      <Outlet />
    </div>
  );
};

export default App;
