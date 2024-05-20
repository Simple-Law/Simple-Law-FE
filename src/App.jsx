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
  const [counts, setCounts] = useState({
    total: 0,
    preparing: 0,
    pending: 0,
    completed: 0,
    refuse: 0,
    important: 0,
    trash: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await fetchMails();
      if (error) return;

      const nonTrashData = data.filter(mail => mail.statue !== "휴지통");
      setData(data);
      setMails(nonTrashData);
      updateCounts(data);
    };

    fetchData();
  }, []);

  const updateCounts = mails => {
    const nonTrashData = mails.filter(mail => mail.statue !== "휴지통");

    const counts = {
      total: nonTrashData.length,
      preparing: nonTrashData.filter(mail => mail.statue === "preparing").length,
      pending: nonTrashData.filter(mail => mail.statue === "pending").length,
      completed: nonTrashData.filter(mail => mail.statue === "completed").length,
      refuse: nonTrashData.filter(mail => mail.statue === "refuse").length,
      important: nonTrashData.filter(mail => mail.isImportant).length,
      trash: mails.filter(mail => mail.statue === "휴지통").length,
    };

    setCounts(counts);
  };

  const handleMenuClick = filteredMails => {
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
          <Route
            path="/mail/quest"
            element={<QuestPost setMails={setMails} setData={setData} updateCounts={updateCounts} />}
          />
          <Route path="/" element={<LayoutWithHeader />}>
            <Route
              path="/"
              element={
                <LayoutWithSidebar
                  data={data}
                  counts={counts}
                  handleMenuClick={handleMenuClick}
                  updateCounts={updateCounts}
                />
              }
            >
              <Route
                path="/detail/:id"
                element={<DetailPage setMails={setMails} setData={setData} updateCounts={updateCounts} />}
              />
              <Route
                path="/board"
                element={
                  <QuestPage
                    mails={mails}
                    data={data}
                    setMails={setMails}
                    setData={setData}
                    updateCounts={updateCounts}
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

const LayoutWithSidebar = ({ data, counts, handleMenuClick, updateCounts }) => {
  return (
    <div className="flex w-full pt-16">
      <RightSideMenu data={data} counts={counts} onMenuClick={handleMenuClick} updateCounts={updateCounts} />
      <div className="mt-6 mx-8 w-full">
        <Outlet />
      </div>
    </div>
  );
};

export default App;
