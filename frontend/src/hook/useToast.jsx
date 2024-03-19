import { toast } from "react-toastify";

export default function useToast() {
  const customToast = (type, message) => {
    if (type === "success") {
      return toast.success(message, {autoClose:1000, hideProgressBar:false, pauseOnHover:true, closeOnClick:true, theme:"dark"});
    } else {
      return toast.error(message,  {autoClose:1000, hideProgressBar:false, pauseOnHover:true, closeOnClick:true, theme:"dark"});
    }
  }

  return customToast;
}