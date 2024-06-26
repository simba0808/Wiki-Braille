import { NotExistIcon } from "../../assets";

import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setIndexesToDelete } from "../../slices/dashboardSlice";

const DescriptionCard = ({ onClick, item, index, isPossibleDelete }) => {
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
      className="relative text-left text-gray-500 bg-white border-2 border-slate rounded-lg shadow-xl hover:-translate-y-2 hover:transition-transform duration-200 hover:cursor-pointer"
      id={`top-card-${index}`}
      onClick={handleLeftClick}
    >
      <span className="absolute right-2 top-2 xs:w-20 xs:px-4 py-1 px-2 rounded-xl xs:text-md text-sm bg-red-200 text-red-600">
        {item.title_id}
      </span>
      <h2 className="px-4 pt-7 text-[22px] font-semibold text-gray-800">
        {item.title.length > 20
          ? item.title.substring(0, 20) + "..."
          : item.title}
      </h2>
      <h3 className="px-4 font-semibold">{item.catagory}</h3>
      <div className="flex items-center px-4 font-normal pb-1 text-gray-400">
        {[1, 2, 3].map((element) => {
          return (
            <svg
              className="w-5 h-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill={element <= parseInt(item.rate) ? "#ffd500" : "#9e9e9e"}
              key={element}
            >
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
          );
        })}
        <span className="flex items-center pl-1">{item.rate}</span>
        &nbsp;
        <span className="hover:cursor-pointer">({item.ratedCount})</span>
      </div>

      <div className="w-full h-[120px] bg-gray-200 border-t-[1px] border-gray-50 shadow-md">
        <img
          className="mx-auto h-[100%]"
          src={
            item.image ? `${item.image}` : NotExistIcon
          }
        />
      </div>
      <div className="w-full px-4 py-2 text-left divide-y-[1px] divide-slate-200">
        <div className="relative py-2">
          <p className="text-md text-gray-700 whitespace-pre-line min-h-[100px] max-h-[100px] overflow-hidden">
          {item.description.length > 120
              ? item.description.substring(0, 120)
              : item.description}
          </p>
        </div>
        {
          item.tag !== "" &&
            <div className="py-2 flex flex-wrap gap-2">
              {item.tag.split(",").map((item, index) => {
                return (
                  <span
                    key={index}
                    className="rounded-full text-center text-sm bg-purple-200 px-3 py-1 text-purple-600"
                  >
                    {item}
                  </span>
                );
              })}
            </div>
        }
      </div>

      {
        isPossibleDelete && (
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
        )
      }
    </div>
  );
};

export default DescriptionCard;
