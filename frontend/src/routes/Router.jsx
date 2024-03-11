import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import EditorRoute from "./EditorRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import ResetPassword from "../pages/ResetPassword";
import AdminLayout from "../components/admin/Layout";
import EditorLayout from "../components/editor/Layout";
import UserLayout from "../components/user/Layout";
import Dashboard from "../pages/Dashboard";
import AccountSetting from "../pages/AccountSetting";
import AddData from "../pages/admin/AddData";
import GenerateDescription from "../pages/admin/GenerateDescription";
import UserManage from "../pages/admin/UserManage";
import ActivityManage from "../pages/admin/ActivityManage";
import Guidence from "../pages/Guidence";

const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route path="/resetPassword" element={ <ResetPassword /> } />
        <Route element={ <PrivateRoute /> }>
          <Route element={ <UserLayout />} >
            <Route path="/guide" element={ <Guidence /> } />
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/setting" element={ <AccountSetting /> } />
          </Route>
        </Route>
        <Route element={<EditorRoute />}>
          <Route element={ <EditorLayout />} >
            <Route path="/editorGuide" element={ <Guidence /> } />
            <Route path="/editorAddData" element={ <AddData /> } />
            <Route path="/editorDashboard" element={ <Dashboard /> } />
            <Route path="/editorSetting" element={ <AccountSetting /> } />
            <Route path="/editorAddin" element={ <GenerateDescription /> } />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={ <AdminLayout />} >
            <Route path="/adminGuide" element={ <Guidence /> } />
            <Route path="/adminAddData" element={ <AddData /> } />
            <Route path="/adminActivities" element={ <ActivityManage /> } />
            <Route path="/adminManage" element={ <UserManage /> } />
            <Route path="/adminDashboard" element={ <Dashboard /> } />
            <Route path="/adminSetting" element={ <AccountSetting /> } />
            <Route path="/adminAddin" element={ <GenerateDescription /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
  
};

export default Router;