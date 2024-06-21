import React from "react";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import store from "./redux/store";
import SignUp from "pages/SignUp";
import Home from "pages/Home";
import Login from "pages/Login";
import Header from "components/header";
import AppLayout from "components/MessageProvider";
import QuestPage from "pages/Quest/QuestPage";
import QuestPost from "pages/Quest/QuestPost";
import FindUserId from "pages/FindUserId";
import DetailPage from "pages/DetailPage";
import RightSideMenu from "components/RightSideMenu";
import ReQuestion from "pages/ReQuestion";
// import PrivateRoute from "router/PrivateRoute";
import ImgUpload from "pages/SignUp/imgUpload";
import MnageAdmin from "pages/Admin/MnageAdmin/MnageAdmin";

const App = () => {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<AppLayout />}>
            <Route index element={<Home />} />
            <Route path='img' element={<ImgUpload />} />
            <Route path='login' element={<Login />} />
            <Route path='login/:type' element={<Login />} />
            <Route path='findId' element={<FindUserId />} />
            {/* <Route path='admin/*' element={<Admin />} /> */}
            <Route path='signup/:type' element={<SignUp />} />
            <Route path='mail/quest' element={<QuestPost />} />
            <Route path='requestion/:id' element={<ReQuestion />} />
            <Route element={<LayoutWithHeader />}>
              {/* <Route element={<PrivateRoute />}> */}
              <Route element={<LayoutWithSidebar />}>
                <Route path='detail/:id' element={<DetailPage />} />
                <Route path='board' element={<QuestPage />} />
                <Route path='admin/mnageAdmin' element={<MnageAdmin />} />
              </Route>
              {/* </Route> */}
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
      <RightSideMenu data={data} counts={counts} onMenuClick={handleMenuClick} />
      <Outlet />
    </div>
  );
};

export default App;
