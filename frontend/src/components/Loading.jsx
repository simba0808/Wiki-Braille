import { LoadingIcon } from "../assets";

const Loading = () => {
  return (
    <div className="main-modal fixed w-full h-100 inset-0 z-50 overflow-hidden flex justify-center items-center animated fadeIn faster">
      <img className="w-16 h-16 animate-spin animate-spin-duration-300 animate-spin-timing-function-ease-out" src={LoadingIcon} />
    </div>
  )
};

export default Loading;