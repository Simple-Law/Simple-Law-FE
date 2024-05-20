import React from "react";
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
import DetailPage from "pages/DetailPage";
import RightSideMenu from "components/RightSideMenu";

import { MailProvider } from "contexts/MailContexts";
import { useMailContext } from "contexts/MailContexts";

const App = () => {
  return (
    <MailProvider>
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
              <Route path="/" element={<LayoutWithSidebar />}>
                <Route path="/detail/:id" element={<DetailPage />} />
                <Route path="/board" element={<QuestPage />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </MailProvider>
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
      <div className="mt-6 mx-8 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
