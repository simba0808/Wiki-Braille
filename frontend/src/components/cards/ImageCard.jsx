import { NotExistIcon } from "../../assets";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIndexesToDelete } from "../../slices/dashboardSlice";

const ImageCard = ({ onClick, item, index, isPossibleDelete }) => {
  const dispatch = useDispatch();
  const { indexesToDelete } = useSelector((state) => state.delete);
  //const { filterGroup } = useSelector(state => state.search)

  const [isChecked, setChecked] = useState(
    indexesToDelete.includes(item.title_id)
  );
  const checkRef = useRef(true);

  useEffect(() => {
    if (checkRef.current) {
      checkRef.current = false;
    } else {
      if (indexesToDelete.length === 0) {
        const newArray = [...indexesToDelete];
        newArray.push(item.title_id);
        dispatch(setIndexesToDelete(newArray));
      } else {
        const filteredArray = [...indexesToDelete].filter(
          (itemToDelete) => itemToDelete !== item.title_id
        );
        if (filteredArray.length === indexesToDelete.length) {
          const newArray = [...indexesToDelete];
          newArray.push(item.title_id);
          dispatch(setIndexesToDelete(newArray));
        } else {
          dispatch(setIndexesToDelete(filteredArray));
        }
      }
    }
  }, [isChecked]);

  const handleLeftClick = () => {
    if (isPossibleDelete) {
      return;
    } else {
      onClick(index);
    }
  };

  return (
    <div
      className="sm:h-[260px] h-auto relative flex flex-col justify-center my-2 border-2 border-t-0 shadow-md bg-white rounded-lg  hover:cursor-pointer"
      key={item.image}
      onClick={handleLeftClick}
    >
      <span className="absolute xs:right-2 xs:top-2 right-1 top-1 xs:w-20 xs:px-4 py-1 px-2 rounded-xl text-xs md:text-sm bg-red-200 text-red-600">
        {item.title_id}
      </span>
      <div key={item.image} className="p-2 pt-8 mx-auto">
        <img
          srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
          src={`${
            item.image ? item.image : NotExistIcon
          }?w=248&fit=crop&auto=format`}
          className="sm:max-h-[200px]"
          alt={item.title}
          loading="lazy"
        />
      </div>
      <div className="px-2 py-2">
        <p className="absolute bottom-0 w-[90%] text-center overflow-hidden whitespace-nowrap text-overflow-ellipsis text-sm sm:text-md sm:font-semibold ">
          {item.title}
        </p>
      </div>
      {isPossibleDelete && (
        <div className="absolute left-0 top-0 w-full h-full flex bg-gray-100 bg-opacity-85">
          <input
            className="absolute bottom-2 right-2 w-6 h-6 border-2 border-purple-700"
            id={`checkbox-${index}`}
            checked={isChecked}
            type="checkbox"
            onChange={() => setChecked(!isChecked)}
          />
          <label htmlFor={`checkbox-${index}`} className="w-full"></label>
        </div>
      )}
    </div>
  );
};

export default ImageCard;
