import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AdminLayout from "../components/admin/layout";
import UserLayout from "../components/user/layout";
import Dashboard from "../pages/Dashboard";
import AccountSetting from "../pages/AccountSetting";
import AddData from "../pages/admin/AddData";

const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route element={ <PrivateRoute /> }>
          <Route element={ <UserLayout />} >
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/setting" element={ <AccountSetting /> } />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={ <AdminLayout />} >
            <Route path="/adminAddData" element={ <AddData /> } />
            <Route path="/adminDashboard" element={ <Dashboard /> } />
            <Route path="/adminSetting" element={ <AccountSetting /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
  
};

export default Router;