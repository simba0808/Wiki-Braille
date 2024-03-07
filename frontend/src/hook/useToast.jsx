import { toast } from "react-toastify";

export default function useToast() {
  const customToast = (type, message) => {
    if (type === "success") {
      return toast.success(message, {autoClose:100, hideProgressBar:true, pauseOnHover:false, closeOnClick:true, theme:"dark"});
    } else {
      return toast.error(message,  {autoClose:100, hideProgressBar:true, pauseOnHover:false, closeOnClick:true, theme:"dark"});
    }
  }

  return customToast;
}