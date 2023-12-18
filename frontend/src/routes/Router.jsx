import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminRoute from "./AdminRoute";
import PrivateRoute from "./PrivateRoute";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Router = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={ <Login /> } />
        <Route path="/login" element={ <Login /> } />
        <Route path="/register" element={ <Register /> } />
        <Route element={ <PrivateRoute /> }>

        </Route>
        <Route element={<AdminRoute />}>

        </Route>
      </Routes>
    </BrowserRouter>
  );
  
};

export default Router;