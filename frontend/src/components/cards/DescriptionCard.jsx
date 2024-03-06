import { NotExistIcon } from "../../assets";

import { useState } from "react";

const DescriptionCard = ({ onClick, item, index }) => {
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [isMenuShow, setIsMenuShow] = useState(false);

  const handleRightClick = (e) => {
    e.preventDefault();
    setPosX(e.clientX - document.getElementById(`top-card-${index}`).getBoundingClientRect().left);
    setPosY(e.clientY - document.getElementById(`top-card-${index}`).getBoundingClientRect().top);
    console.log(posX, posY);
    setIsMenuShow(true);
  }

  return (
    <div
      className="relative h-[190px] col-span-1 flex flex-col items-start bg-slate-100 p-2 border-2 shadow-md rounded-md hover:cursor-pointer"
      id={`top-card-${index}`}
      onClick={() => onClick(index)}
      onContextMenu={handleRightClick}
    >
      <span className="absolute right-2 xs:w-20 xs:px-4 py-1 px-2 rounded-xl xs:text-md text-sm bg-purple-200 text-purple-600">
        {item.title_id}
      </span>
      <h2 className="p-0 pl-2 my-0 lg:text-[22px] md:text-lg sm:text-[22px] text-[18px] font-semibold">
        {item.title}
      </h2>
      <div className="flex w-full items-center justify-center flex-1">
        <div className="w-full h-full flex flex-col justify-between pl-2 pt-4">
          {item.catagory !== "Descrição" ? (
            <p className="xl:text-lg text-sm text-left font-semibold">{`Tag: ${item.tag}`}</p>
          ) : (
            <></>
          )}
          <div className="flex-1 flex items-center">
            <p className="pt-2 text-md text-left 2xl:block hidden">
              {item.description.length > 150
                ? item.description.substring(0, 150) + "..."
                : item.description}
            </p>
            <p className="pt-2 text-sm text-left xl:block 2xl:hidden hidden">
              {item.description.length > 130
                ? item.description.substring(0, 130) + "..."
                : item.description}
            </p>
            <p className="pt-2 text-sm text-left lg:block xl:hidden hidden">
              {item.description.length > 80
                ? item.description.substring(0, 80) + "..."
                : item.description}
            </p>
            <p className="pt-2 text-sm text-left md:block lg:hidden hidden">
              {item.description.length > 80
                ? item.description.substring(0, 80) + "..."
                : item.description}
            </p>
            <p className="pt-2 text-md text-left sm:block md:hidden hidden">
              {item.description.length > 150
                ? item.description.substring(0, 150) + "..."
                : item.description}
            </p>
            <p className="pt-2 text-sm text-left sm:hidden block">
              {item.description.length > 100
                ? item.description.substring(0, 100) + "..."
                : item.description}
            </p>
          </div>
        </div>
        <img
          className="max-h-[140px] max-w-[50%]"
          src={
            item.image ? `http://localhost:3000/${item.image}` : NotExistIcon
          }
          alt=""
        />
      </div>
      {
        isMenuShow && (
          <div className="absolute px-4 py-2 bg-white" style={{left: posX, top: posY}}>
            <button onClick={(e) => {
              e.preventDefault();
              alert(index)}
              }>{index}</button>
          </div>
        )
      }
    </div>
  );
};

export default DescriptionCard;
