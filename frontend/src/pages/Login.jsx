import { LoginImage } from '../assets'
import Loading from "../components/Loading";
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/userApiSlice';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../slices/authSlice';
import { ToastContainer, toast } from "react-toastify";
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [verifyStatus, setVerifyStatus] = useState("");
  const [verifyShow, setVerifyShow] = useState(false);
  const [seconds, setSeconds] = useState(40);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if(verifyShow) {
      const interval = setInterval(() => {
        setSeconds(prevSecond => prevSecond-1);
      }, 1000);
      if (seconds === 0) {
        clearInterval(interval);
        window.location.reload(false)
      }
      return () => clearInterval(interval);
    }
  }, [verifyShow, seconds]);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailStatus("");
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordStatus("");
  };

  const handleChangeCode = (e) => {
    setVerifyCode(e.target.value);
  }
 
  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !verifyShow) {
      handleSubmit();
    } else if(e.keyCode === 13 && verifyShow) {
      handleCodeSubmit();
    }
  };

  const checkEmail = (emailForCheck) => {
    if (!emailForCheck) {
      return -1;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailForCheck) ? 1 : 0;
  };

  const checkPassword = (passwordForCheck) => {
    if (passwordForCheck.length < 6) {
      return -1;
    }
    return 1;
  };

  const handleSubmit = async () => {
    const isEmail = checkEmail(email);

    if (isEmail < 0) {
      setEmailStatus("É necessário ter um e-mail");
      return;
    } else {
      if (isEmail == 0) {
        setEmailStatus("O e-mail não é válido");
        return;
      }
      setEmailStatus("");
    }

    const isPassword = checkPassword(password);
    if (isPassword < 0) {
      setPasswordStatus("A senha deve ter pelo menos 6 caracteres");
      return;
    }
    setPasswordStatus("");

    try {
      setLoading(true);
      const res = await login({ email, password }).unwrap();
      if(res.message === "sent") {
        setVerifyShow(true);
      }
      setLoading(false);
    } catch (err) {
      setPassword("");
      setLoading(false);
      if (err.data.message === "inactive") {
        toast.error("O usuário não está ativo", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
      } else {
        toast.error("Credencial inválida", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
      }
    }
  };

  const handleCodeSubmit = async () => {
    if(verifyCode.length === 0) {
      setVerifyStatus("Insira seu código de verificação");
      return;
    }

    try {
      const res = await axios.post("/api/user/verifylogin", { email, verifyCode });
      if(res.data.message === "verified") {
        toast.success('Logado com sucesso!', { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
        dispatch(setCredentials({ ...res.data.authInfo }));
        const { role } = res.data.authInfo;
        if (role === 2) {
          navigate("/adminGuide");
        } else if (role === 1) {
          navigate("/editorGuide");
        } else if (role === 0) {
          navigate("/guide");
        }
      }
    } catch (err) {
      if (err.response.data.message === "expired") {
        setVerifyStatus("Código expirado");
        toast.error("Código expirado", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
        window.location.reload(false);
      } else {
        setVerifyStatus("Código inválido");
        toast.error("Código inválido", { autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark", });
      }
    }
  };

  return (
    <>
      <div className="flex items-center min-h-screen p-6 bg-gray-50">
        <div
          className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl"
        >
          <div className="flex flex-col overflow-y-auto md:flex-row">
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full"
                src={LoginImage}
                alt="Office"
              />
              <ToastContainer />
            </div>
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              {
                !verifyShow ? 
                  <div className="w-full text-left">
                    <h1
                      className="mb-4 text-xl font-semibold text-gray-700"
                    >
                      Conecte-se
                    </h1>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">E-mail: {emailStatus}</span>
                      <input
                        className={`block w-full mt-1 text-sm border p-2 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input ${emailStatus === "" ? "border-grey-200" : "border-red-400 ring-2 ring-red-100"}`}
                        placeholder="example@email.com"
                        autoFocus={true}
                        value={email}
                        onChange={handleChangeEmail}
                      />
                    </label>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">Senha: {passwordStatus}</span>
                      <input
                        className={`block w-full mt-1 p-2 text-sm border rounded-md focus:border-purple-600  focus:ring-2 focus:ring-purple-200 focus:outline-none focus:shadow-outline-purple form-input ${passwordStatus === "" ? "border-grey-200" : "border-lightRed"}`}
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
                        className="text-sm font-medium text-purple-600 hover:underline"
                        to={"/resetPassword"}
                      >
                        Esqueceu sua senha?
                      </Link>
                    </p>
                    <p className="mt-1">
                      <Link
                        className="text-sm font-medium text-purple-600 hover:underline"
                        to={"/register"}
                      >
                        Criar uma conta
                      </Link>
                    </p>
                  </div> :
                  <div className="w-full text-left">
                    <h1
                      className="mb-4 text-xl font-semibold text-gray-700"
                    >
                      Conecte-se
                    </h1>
                    <p className="w-full mt-4 text-right">Faltam <b>{`${seconds}`}</b> s</p>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">Verificar código: {verifyStatus}</span>
                      <input
                        className={`block w-full mt-1 text-sm border p-2 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input ${verifyStatus === "" ? "border-grey-200" : "focus:border-red-400 focus:ring-2 focus:ring-red-100"}`}
                        placeholder="123456"
                        autoFocus={true}
                        value={verifyCode}
                        onChange={handleChangeCode}
                        onKeyDown={handleKeyDown}
                      />
                    </label>
                  </div>
              }
            </div>
          </div>
        </div>
      </div>
      {
        loading && <Loading />
      }
    </>
  );
};

export default Login;