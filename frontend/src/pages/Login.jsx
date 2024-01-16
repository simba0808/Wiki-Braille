import { LoginImage } from '../assets'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/userApiSlice';
import { useDispatch } from'react-redux';
import { setCredentials } from '../slices/authSlice';
import { ToastContainer, toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, {isLoading}] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailStatus("");
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordStatus("");
  };

  const handleKeyDown = (e) => {
    if(e.keyCode === 13) {
      handleSubmit();
    }
  };

  const checkEmail = (emailForCheck) => {
    if(!emailForCheck) {
      return -1;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailForCheck) ? 1 : 0;
  };

  const checkPassword = (passwordForCheck) => {
    if(passwordForCheck.length < 6) {
      return -1;
    }
    return 1;
  };

  const handleSubmit = async () => {
    const isEmail = checkEmail(email);

    if(isEmail < 0) {
      setEmailStatus("É necessário ter um e-mail");
      return;
    } else {
      if(isEmail == 0) {
        setEmailStatus("O e-mail não é válido");
        return;
      }
      setEmailStatus("");
    }

    const isPassword = checkPassword(password);
    if(isPassword < 0) {
      setPasswordStatus("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setPasswordStatus("");
    
    try {
      const res = await login({ email, password }).unwrap();
      toast.success('Logado com sucesso!', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      dispatch(setCredentials({...res}));
      const { role } = res;
      if (role === 2) {
        navigate("/adminDashboard");
      } else if(role === 1){
        navigate("/editorDashboard");
      } else if (role === 0) {
        navigate("/dashboard");
      }
    } catch (err) {
      setPassword("");
      if(err.data.message === "inactive") {
        toast.error("O usuário não está ativo", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      } else {
        toast.error("Credencial inválida", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      }
    }
  };

  return(
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div
        className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl dark:bg-gray-800"
      >
        <div className="flex flex-col overflow-y-auto md:flex-row">
          <div className="h-32 md:h-auto md:w-1/2">
            <img
              aria-hidden="true"
              className="object-cover w-full h-full dark:hidden"
              src={LoginImage}
              alt="Office"
            />
            <ToastContainer  />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full text-left">
              <h1
                className="mb-4 text-xl font-semibold text-gray-700 dark:text-gray-200"
              >
                Conecte-se
              </h1>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">E-mail: {emailStatus}</span>
                <input
                  className={`block w-full mt-1 text-sm border p-2 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input ${emailStatus === "" ? "border-grey-200":"border-red-400 ring-2 ring-red-100"}`}
                  placeholder="example@email.com"
                  autoFocus={true}
                  value={email}
                  onChange={handleChangeEmail}
                />
              </label>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700 dark:text-gray-400">Senha: {passwordStatus}</span>
                <input
                  className={`block w-full mt-1 p-2 text-sm border rounded-md focus:border-purple-600  focus:ring-2 focus:ring-purple-200 focus:outline-none focus:shadow-outline-purple dark:text-gray-300 dark:focus:shadow-outline-gray form-input ${passwordStatus === "" ? "border-grey-200":"border-lightRed"}`}
                  placeholder="***************"
                  type="password"
                  value={password}
                  onChange={handleChangePassword}
                  onKeyDown={handleKeyDown}
                />
              </label>

              <button
                className="block w-full px-4 py-2 mt-12 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={handleSubmit}
              >
                Conecte-se
              </button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to={"/resetPassword"}
                >
                  Esqueceu sua senha?
                </Link>
              </p>
              <p className="mt-1">
                <Link
                  className="text-sm font-medium text-purple-600 dark:text-purple-400 hover:underline"
                  to={"/register"}
                >
                  Criar uma conta
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Login;