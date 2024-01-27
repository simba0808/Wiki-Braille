import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { RegisterImage } from "../assets";
import { useRegisterMutation } from "../slices/userApiSlice";

const Register = () => {
  const navigate = useNavigate();
  const [register, {isLoading}] = useRegisterMutation();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [nameStatus, setNameStatus] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");
  
  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
    setEmailStatus("");
  };
  const handleChangeName = (e) => {
    setName(e.target.value);
    setNameStatus("");
  };
  const handleChangePassword = (e) => {
    setPassword(e.target.value);
    setPasswordStatus("");
  };
  const handleChangeConfirmPassword = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordStatus("");
  };

  const handleSubmit = async () => {
    const isName = checkName(name);
    if(isName === 0) {
      setNameStatus("O nome é obrigatório");
      return;
    }  
    const isEmail = checkEmail(email);
    if(isEmail < 0) {
      setEmailStatus("O e-mail é solicitado");
      return;
    } else {
      if(isEmail == 0) {
        setEmailStatus("O e-mail não é válido");
        return;
      }
      setEmailStatus("");
    }
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
    try {
      const res = await register({ name, email, password }).unwrap();
      toast.success('Registrado com sucesso!', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      setTimeout(() => {
        navigate("/");
      }, 1000)
    } catch (err) {
			toast.error("Falha ao registrar o usuário", {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
    }
    

  };

  const checkName = (name) => {
    if(name === "") {
      return 0;
    }
    return 1;
  };

  const checkEmail = ( emailForCheck ) => {
    if(!emailForCheck) {
      return -1;
    }
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(emailForCheck) ? 1 : 0;
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

  return(
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
              src={RegisterImage}
              alt="Office"
            />
            <ToastContainer />
          </div>
          <div className="flex items-center justify-center p-6 sm:p-12 md:w-1/2">
            <div className="w-full text-left">
              <h1
                className="mb-4 text-xl  font-semibold text-gray-700"
              >
                Criar uma conta
              </h1>
              <label className="block text-sm">
                <span className="text-gray-700">Nome: {nameStatus}</span>
                <input
                  className={`block w-full mt-1 text-sm border p-2 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input ${nameStatus === "" ? "border-grey-200":"border-lightRed"}`}
                  placeholder="Jane Doe"
                  autoFocus
                  value={name}
                  onChange={handleChangeName}
                />
              </label>
              <label className="block mt-4 text-sm">
                <span className="text-gray-700">E-mail: {emailStatus}</span>
                <input
                  className={`block w-full mt-1 text-sm border p-2 rounded-md focus:ring-2 focus:ring-purple-200 focus:border-purple-600 focus:outline-none focus:shadow-outline-purple form-input ${emailStatus === "" ? "border-grey-200":"border-lightRed"}`}
                  placeholder="example@email.com"
                  value={email}
                  onChange={handleChangeEmail}
                />
              </label>
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

              <div className="flex mt-6 text-sm">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="text-purple-600 form-checkbox focus:border-purple-400 focus:outline-none"
                  />
                  <span className="ml-2">
                    Eu concordo com os&nbsp;
                    <span className="underline">política de privacidade</span>
                  </span>
                </label>
              </div>
            
              <button
                className="block w-full px-4 py-2 mt-4 text-sm font-medium leading-5 text-center text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple"
                onClick={handleSubmit}
              >
                Criar uma conta
              </button>

              <hr className="my-8" />

              <p className="mt-4">
                <Link
                  className="text-sm font-medium text-purple-600 hover:underline"
                  to={"/login"}
                >
                  Já tem uma conta? Conecte-se
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

export default Register;