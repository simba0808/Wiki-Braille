import PrimaryButton from '../components/PrimaryButton';
import { LoginImage } from '../assets'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLoginMutation } from '../slices/userApiSlice';
import { ToastContainer, toast } from "react-toastify";


const Login = () => {
  const navigate = useNavigate();

  const [login, {isLoading}] = useLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailStatus, setEmailStatus] = useState("");
  const [passwordStatus, setPasswordStatus] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    const isEmail = checkEmail(email);

    if(isEmail < 0) {
      setEmailStatus("Email is reurired");
      return;
    } else {
      if(isEmail == 0) {
        setEmailStatus("Email is not valid");
        return;
      }
      setEmailStatus("");
    }

    const isPassword = checkPassword(password);
    if(isPassword < 0) {
      setPasswordStatus("Password must be at least 6 characters");
      return;
    }
    setPasswordStatus("");
    
    try {
      const res = await login({ email, password }).unwrap();
      toast.success('Logged in Successfully!', {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
      const { role } = res;
      if(role === 1) {
        navigate("/adminDashboard");
      } else {
        navigate("/dashboard");
      }
      
    } catch (err) {
      setPassword("");
			toast.error(err?.data?.message || err.error, {autoClose: 1000, hideProgressBar: true, pauseOnHover: false, closeOnClick: true, theme: "dark",});
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

  return(
    <>
      <div className="w-[85%] h-[100vh] mx-auto p-0 m-0 flex flex-row">
        <div className="w-[50%] h-[100%] flex flex-col align-center justify-center">
          <div className="h-[80%] flex flex-col">
            <div className="flex-1">
              <p className="text-left text-[50px] text-blue font-bold">Logo</p>
            </div>
            <div className="flxe-3 flex">
              <img className="w-[90%]" src={LoginImage} alt="login-image"/>
            </div>
            <div className="flex-1 flex items-end justify-center">
              <p className="text-left text-blue text-lg">Copyright Reserved &copy; 2023</p>
            </div>
          </div>
          <ToastContainer  />
        </div>
        <div className="w-[50%] flex align-center justify-center">
          <div className="w-[80%] flex flex-col justify-center">
            <p className="ml-4 text-left text-[40px] text-blue font-bold">Welcome Back</p>
            <p className="mb-5 ml-4 text-left text-[20px] text-slate-500">Login to continue</p>
            <label className="text-left ml-5 mt-7">Email: {emailStatus}</label>
            <input className={`w-full p-3 m-4 mt-1 border-2 bg-slate-100 ${emailStatus==="" ? "border-primary":"border-lightRed"} rounded-xl focus:ring-2 outline-none`} type='email' placeholder='stevejin88@gmail.com' value={email}  onChange={handleChangeEmail} />
            <label className='text-left ml-5'>Password: {passwordStatus}</label>
            <input className={`w-full p-3 m-4 mt-1 border-2 bg-slate-100 ${passwordStatus==="" ? "border-primary":"border-lightRed"} rounded-xl focus:ring-2 outline-none`} type="password" placeholder='******' value={password} onChange={handleChangePassword}/>
            <div className="mb-5 ml-1 inline-flex items-center relative">
              <label
                className="relative flex cursor-pointer items-center rounded-full p-3"
                htmlFor="checkbox"
                data-ripple-dark="true"
              >
                <input
                  type="checkbox"
                  className="before:content[''] peer relative h-6 w-6 cursor-pointer appearance-none rounded-md border border-blue-gray-500 transition-all before:absolute before:top-2/4 before:left-2/4 before:block before:h-12 before:w-12 before:-translate-y-2/4 before:-translate-x-2/4 before:rounded-full before:bg-blue-gray-500 before:opacity-0 before:transition-opacity checked:border-primary checked:bg-primary checked:before:bg-primary hover:before:opacity-10"
                  id="checkbox"
                />
                <div className="pointer-events-none absolute top-2/4 left-2/4 -translate-y-2/4 -translate-x-2/4 text-white opacity-0 transition-opacity peer-checked:opacity-100">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3.5 w-3.5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                </div>
              </label>
              <span className="text-blue">Remember Me</span>
              <div className="absolute right-0">
                <a className="text-blue" href="#">Forget Password?</a>
              </div>
            </div>
            <div className="mt-10 flex flex-col align-center justify-center items-center">
              <button onClick={handleSubmit}>
                <PrimaryButton  text="Login" />
              </button>
              <p className="p-5 text-xl text-blue">New User?&nbsp;&nbsp;<Link to={"/register"} className="underline underline-offset-8">Sign Up</Link></p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;