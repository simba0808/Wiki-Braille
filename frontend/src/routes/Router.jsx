import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Layout from "../components/admin/layout";
import Dashboard from "../pages/Dashboard";
import AccountSetting from "../pages/AccountSetting";

const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route element={ <PrivateRoute /> }>
          <Route element={ <Layout />} >
            <Route path="/dashboard" element={ <Dashboard /> } />
            <Route path="/setting" element={ <AccountSetting /> } />
          </Route>
        </Route>
        <Route element={<AdminRoute />}>
          <Route element={ <Layout />} >
            <Route path="/adminDashboard" element={ <Dashboard /> } />
            <Route path="/setting" element={ <AccountSetting /> } />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
  
};

export default Router;