import React from "react";
import { BrowserRouter, Routes, Route, Outlet, Navigate } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import SignUpPage from "pages/SignUp/SignUp";
import HomePage from "pages/Home/Home";
import LoginPage from "pages/Login/Login";
import Header from "components/layout/Header";
import AppLayout from "components/messaging/MessageProvider";
import MyQuestListPage from "pages/Quest/MyQuestList";
import QuestPostPage from "pages/Quest/QuestPost";
import FindUserIdPage from "pages/Login/findUser/FindUserId";
import RequestDetailPage from "pages/Quest/RequestDetail";
import RequestSideMenu from "components/layout/RequestSideMenu";
import MnageAdmin from "pages/Admin/MnageAdmin/MnageAdmin";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<HomePage />} />
            <Route path='login' element={<Navigate to='/login/quest' replace />} />
            <Route path='admin/login' element={<Navigate to='/login/admin' replace />} />
            <Route path='login/:type' element={<LoginPage />} />
            <Route path='find-id' element={<FindUserIdPage />} />
            <Route path='sign-up/:type' element={<SignUpPage />} />
            <Route path='mail/quest' element={<QuestPostPage />} />

            <Route element={<LayoutWithHeader />}>
              <Route element={<LayoutWithSidebar />}>
                <Route path='detail/:id' element={<RequestDetailPage />} />
                <Route path='board' element={<MyQuestListPage />} />
                <Route path='admin/mnageAdmin' element={<MnageAdmin />} />
              </Route>
            </Route>
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
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
  const dispatch = useDispatch();
  const { data, counts } = useSelector(state => state.mail); // Redux state에서 가져옵니다.

  const handleMenuClick = filteredMails => {
    dispatch({ type: "SET_MAILS", payload: filteredMails });
  };

  return (
    <div className='flex w-full pt-16'>
      <RequestSideMenu data={data} counts={counts} onMenuClick={handleMenuClick} />
      <Outlet />
    </div>
  );
};

export default App;
