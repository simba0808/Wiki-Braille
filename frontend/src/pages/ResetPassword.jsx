import axios from "axios";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ResetImage } from "../assets";
import { ToastContainer, toast } from "react-toastify";
import Loading from "../components/Loading";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  const [verifyCode, setVerifyCode] = useState(["", "", "", "", "", "", ""]);
  const [focusedInput, setFocusedInput] = useState(0);
  const [codeReceived, setCodeReceived] = useState(false);
  const [isVerified, setVerified] = useState(false);
  const [isLoading, setLoading] = useState(false);

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailStatus("");
  };

  const checkEmail = (emailForCheck) => {
    if(!emailForCheck) {
      return -1;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailForCheck) ? 1 : 0;
  };

  const handleChangeCode = (e, index) => {
    setVerifyCode((prev) => {
      const updatedCode = [...prev];
      updatedCode[index] = e.target.value;
      return updatedCode;
    });
    setFocusedInput(index+1);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordStatus("");
  };

  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordStatus("");
  };

  const checkPassword = ( passwordForCheck, confirmPasswordForCheck ) => {
    if(passwordForCheck.length < 6) {
      return -1;
    }
    if(passwordForCheck !== confirmPasswordForCheck) {
      return 0;
    }
    return 1;
  };

  const submitResetPassword = async () => {
    const isPassword = checkPassword(password, confirmPassword);
    if(isPassword < 0) {
      setPasswordStatus("A senha deve ter pelo menos 6 caracteres");
      return;
    } else {
      if(isPassword == 0) {
        setPasswordStatus("As senhas não correspondem");
        return;
      }
      setPasswordStatus("");
    }
    setLoading(true);
    try {
      const response = await axios.post("/api/user/resetPassword", { email, password });
      if(response.data.message === "success") {
        setLoading(false);
        toast.success("Redefinição de senha bem-sucedida", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (err) {
      setLoading(false);
      toast.error("Falha ao redefinir a senha. Tente novamente", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  };
 
  const submitRequest = async () => {
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
    setLoading(true);
    try {
      const response = await axios.post("/api/user/resetPasswordRequest", { email });
      setLoading(false);
      if(response.data.message === "sent") {
        setCodeReceived(true);
      }
    } catch (err) {
      setLoading(false);
      toast.error("E-mail não encontrado", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
  };

  const verifyCurrentCode = async () => {
    let code;
    verifyCode.map((item) => code.append(item));
    setLoading(true);
    const response = await axios.post("/api/user/verify", { email: email, verifyCode: code });
    if(response.data.message === "verified") {
      setVerified(true);
      setLoading(false);
    } else {
      setLoading(false);
      toast.error("O código de verificação é inválido", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      return;
    }
  }

  return(
    <>
      { isLoading && <Loading /> }
      <div className="flex items-center min-h-screen p-6 bg-gray-50">
        <div
          className="flex-1 h-full max-w-4xl mx-auto overflow-hidden bg-white rounded-lg shadow-xl"
        >
          <div className="flex flex-col divide divide-x-2 divide-slate-50 overflow-y-auto md:flex-row">
            <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
              {
                isVerified ? 
                  <div className="w-full text-left">
                    <h1
                      className="mb-4 text-xl font-semibold text-gray-700"
                    >
                      Inserir nova senha
                    </h1>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">Senha: {passwordStatus}</span>
                      <input
                        className={`block w-full mt-1 p-2 text-sm border rounded-md focus:border-purple-600  focus:ring-2 focus:ring-purple-200 focus:outline-none focus:shadow-outline-purple form-input ${passwordStatus === "" ? "border-grey-200":"border-lightRed"}`}
                        placeholder="***************"
                        type="password"
                        value={password}
                        onChange={handleChangePassword}
                      />
                    </label>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">
                        Confirmar senha: {passwordStatus}
                      </span>
                      <input
                        className={`block w-full mt-1 p-2 text-sm border rounded-md focus:border-purple-600 focus:ring-2 focus:ring-purple-200 focus:outline-none focus:shadow-outline-purple form-input ${passwordStatus === "" ? "border-grey-200":"border-lightRed"}`}
                        placeholder="***************"
                        type="password"
                        value={confirmPassword}
                        onChange={handleChangeConfirmPassword}
                      />
                    </label>
                    <button
                      className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      onClick={submitResetPassword}
                    >
                      Redefina a senha
                    </button>
                  </div> : 
                  !codeReceived ? 
                  <div className="w-full text-left">
                    <h1
                      className="mb-4 text-xl font-semibold text-gray-700"
                    >
                      Redefina a senha
                    </h1>
                    <p className="mt-10 text-center text-sm text-gray-700">Forgot Password? No problem, enter your email address and we will send you code to your Mail Inbox</p>
                    <label className="block mt-4 text-sm">
                      <span className="text-gray-700">E-mail: {emailStatus}</span>
                      <input
                        className={`block w-full mt-1 text-sm border p-2 rounded-md focus:outline-none focus:shadow-outline-purple form-input ${emailStatus === "" ? "border-grey-200 focus:ring-2 focus:ring-purple-200 focus:border-purple-600":"border-red-400 ring-2 ring-red-100"}`}
                        placeholder="example@email.com"
                        value={email}
                        onChange={handleChangeEmail}
                        autoFocus={true}
                      />
                    </label>
                    <button
                      className="block w-full px-4 py-2 mt-12 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                      onClick={submitRequest}
                    >
                      Enviar solicitação
                    </button>
    
                    <hr className="my-8" />
    
                    <p className="mt-4">
                      <Link
                        className="text-sm font-medium text-purple-600 hover:underline"
                        to={"/login"}
                      >
                        Vá para Entrar
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
                      Inserir código de verificação
                    </h1>
                    <div className="max-w-md mx-auto border max-w-sm mt-20 rounded">
                      <div className="shadow-md px-4 py-6">
                          <div className="flex justify-center gap-2 mb-6">
                            {
                              [1,2,3,4,5,6].map((element, index) => {
                                return (
                                  <input 
                                    className={`w-12 h-12 text-center border rounded-md shadow-sm focus:border-teal-500 focus:ring-teal-500`} 
                                    type="text" maxLength="1" pattern="[0-9]" inputMode="numeric" autoComplete="one-time-code" 
                                    value={verifyCode[index]} 
                                    onChange={(e) => handleChangeCode(e, index)} 
                                    required
                                    autoFocus={focusedInput == index ? true:false}
                                  />
                                )
                              })
                            }
                          </div>
                          <div className="flex items-center justify-center">
                            <button 
                              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" 
                              type="button"
                              onClick={verifyCurrentCode}
                            >
                              Verificar
                            </button>
                          </div>
                      </div>
                    </div>
                  </div>
              }
            </div>
            <div className="h-32 md:h-auto md:w-1/2">
              <img
                aria-hidden="true"
                className="object-cover w-full h-full"
                src={ResetImage}
                alt="Office"
              />
              <ToastContainer  />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetPassword;