import React from "react";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OPS from "./components/notFound/notFound";
import TestComponent from "./components/Test/Test";
import Auth from "./hoc/Auth/Auth";
import Forgot from "./hoc/Forgot/Forgot";
import Header from "./hoc/Header/Header";
import Main from "./hoc/Main/Main";
import Reg from "./hoc/Reg/Reg";
import Create from "./hoc/Create/Create";
import TestCreate from "./hoc/TestCreate/TestCreate";
import Footer from "./hoc/Footer/Footer";
import TestGenerator from "./hoc/AIGenerate/Generate";
import AddUser from "./hoc/AddUser/AddUser";

export default function App() {
  const login = useSelector((state) => state.login.status);
  return (
    <div className="wrapper min-h-full overflow-hidden">
      <ToastContainer position="top-center" autoClose={2000} />
      <Routes>
        <Route path="/" element={login ? <div>Вы зашли</div> : <Auth />} />
        <Route path="/signin" element={<Reg />} />
        <Route path="/forgot-password" element={<Forgot />} />
        <Route path="/main/tests/create" element={<TestCreate />} />
        <Route path="/main/profile" element={<Create />} />
        <Route path="*" element={<OPS />} />
        <Route path={"/generate"} element={<TestGenerator />} />
        <Route path={"/main/user-add"} element={<AddUser />} />
        <Route
          path="/main"
          element={
            <div className="main">
              {login ? (
                <>
                  <Header />
                  <Main />
                  <Footer />
                </>
              ) : (
                <OPS />
              )}
            </div>
          }
        />
        <Route
          path="/main/test/:id"
          element={
            <>
              <TestComponent />
            </>
          }
        />
      </Routes>
    </div>
  );
}
