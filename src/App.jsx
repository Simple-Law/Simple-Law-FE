import React, { useEffect, useState } from "react";
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
import { fetchMails } from "components/apis/mailsApi";

const App = () => {
  const [mails, setMails] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchMails();
      if (error) return;

      const nonTrashData = data.filter((mail) => mail.statue !== "휴지통");
      setData(data);
      setMails(nonTrashData);
    };

    fetchData();
  }, []);
  const handleMenuClick = (filteredMails) => {
    setMails(filteredMails);
  };

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
            <Route
              path="/"
              element={
                <LayoutWithSidebar
                  data={data}
                  handleMenuClick={handleMenuClick}
                />
              }
            >
              <Route path="/detail/:id" element={<DetailPage />} />
              <Route
                path="/board"
                element={
                  <QuestPage
                    mails={mails}
                    setMails={setMails}
                    data={data}
                    setData={setData}
                  />
                }
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
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
const LayoutWithSidebar = ({ data, handleMenuClick }) => {
  return (
    <div className="flex  w-full pt-16">
      <RightSideMenu data={data} onMenuClick={handleMenuClick} />
      <div className="flex-grow">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
