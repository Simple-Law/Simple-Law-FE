import { Routes, Route, Outlet, Navigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import CommonProvider from "contexts/CommonContext";
import SignUpPage from "pages/SignUp/SignUp";
import HomePage from "pages/Home/Home";
import LoginPage from "pages/Login/Login";
import Header from "components/layout/Header";
import AppLayout from "components/messaging/MessageProvider";
import MyQuestListPage from "pages/Request/MyRequestList";
import FindUserIdPage from "pages/Login/findUser/FindUserId";
import FindPassword from "pages/Login/findUser/FindPassword";
import RequestDetailPage from "pages/Request/RequestDetail";
import PostEditor from "components/postEditor/PostEditor";
import RequestSideMenu, { AdminSideMenu } from "pages/Request/RequestSideMenu";
import RequestList from "pages/Admin/Request/RequestList";
import ManageAdminList from "pages/Admin/ManageAdmin/ManageAdminList";
import ManageUserList from "pages/Admin/ManageUser/ManageUserList";
import JoinRequestList from "pages/Admin/JoinRequest/JoinRequestList";
import MyPage from "pages/MyPage/MyPage";

const App = () => {
  return (
    <CommonProvider>
      <Routes>
        <Route path='/' element={<AppLayout />}>
          <Route index element={<HomePage />} />
          <Route path='login' element={<Navigate to='/login/quest' replace />} />
          <Route path='admin/login' element={<Navigate to='/login/admin' replace />} />
          <Route path='login/:type' element={<LoginPage />} />
          <Route path='find-id/:type' element={<FindUserIdPage />} />
          <Route path='find-pw/:type' element={<FindPassword />} />
          <Route path='sign-up/:type' element={<SignUpPage />} />
          <Route element={<PrivateRoute />}>
            <Route path='mail/quest' element={<PostEditor />} />
            <Route path='mail/quest/:id/:mode' element={<PostEditor />} />
            <Route element={<LayoutWithHeader />}>
              <Route path='my-page' element={<MyPage />} />
              <Route element={<LayoutWithSidebar />}>
                <Route path='detail/:id' element={<RequestDetailPage />} />
                <Route path='board' element={<MyQuestListPage />} />
                <Route path='admin/board' element={<RequestList />} />
                <Route path='admin/manage-admin' element={<ManageAdminList />} />
                <Route path='admin/manage-user' element={<ManageUserList />} />
                <Route path='admin/join-request' element={<JoinRequestList />} />
              </Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </CommonProvider>
  );
};
const PrivateRoute = () => {
  const accessToken = useSelector(state => state.auth.tokens.accessToken);

  return accessToken ? <Outlet /> : <Navigate to='/login' replace />;
};

const LayoutWithHeader = () => {
  return (
    <>
      <Header />
      <div className='mt-16'>
        <Outlet />
      </div>
    </>
  );
};

const LayoutWithSidebar = () => {
  const dispatch = useDispatch();
  const { data, counts } = useSelector(state => state.mail);
  const userType = useSelector(state => state?.auth?.user?.type);

  const handleMenuClick = filteredMails => {
    dispatch({ type: "SET_MAILS", payload: filteredMails });
  };

  return (
    <div className='flex w-full'>
      {userType === "ADMIN" ? (
        <AdminSideMenu />
      ) : (
        <RequestSideMenu data={data} counts={counts} onMenuClick={handleMenuClick} />
      )}
      <Outlet />
    </div>
  );
};

export default App;
