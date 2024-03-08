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
    // <div
    //   className="relative h-[190px] col-span-1 flex flex-col items-start bg-tranparent  p-2 border-2 shadow-md rounded-md hover:cursor-pointer"
    //   id={`top-card-${index}`}
    //   onClick={handleLeftClick}
    // >
    //   <span className="absolute right-2 xs:w-20 xs:px-4 py-1 px-2 rounded-xl xs:text-md text-sm bg-purple-200 text-purple-600">
    //     {item.title_id}
    //   </span>
    //   <h2 className="p-0 pl-2 my-0 lg:text-[22px] md:text-lg sm:text-[22px] text-[18px] font-semibold">
    //     {item.title}
    //   </h2>
    //   <div className="flex w-full items-center justify-center flex-1">
    //     <div className="w-full h-full flex flex-col justify-between pl-2 pt-4">
    //       {item.catagory !== "Descrição" ? (
    //         <p className="xl:text-lg text-sm text-left font-semibold">{`Tag: ${item.tag}`}</p>
    //       ) : (
    //         <></>
    //       )}
    //       <div className="flex-1 flex items-center">
    //         <p className="pt-2 text-md text-left 2xl:block hidden">
    //           {item.description.length > 150
    //             ? item.description.substring(0, 150) + "..."
    //             : item.description}
    //         </p>
    //         <p className="pt-2 text-sm text-left xl:block 2xl:hidden hidden">
    //           {item.description.length > 130
    //             ? item.description.substring(0, 130) + "..."
    //             : item.description}
    //         </p>
    //         <p className="pt-2 text-sm text-left lg:block xl:hidden hidden">
    //           {item.description.length > 80
    //             ? item.description.substring(0, 80) + "..."
    //             : item.description}
    //         </p>
    //         <p className="pt-2 text-sm text-left md:block lg:hidden hidden">
    //           {item.description.length > 80
    //             ? item.description.substring(0, 80) + "..."
    //             : item.description}
    //         </p>
    //         <p className="pt-2 text-md text-left sm:block md:hidden hidden">
    //           {item.description.length > 150
    //             ? item.description.substring(0, 150) + "..."
    //             : item.description}
    //         </p>
    //         <p className="pt-2 text-sm text-left sm:hidden block">
    //           {item.description.length > 100
    //             ? item.description.substring(0, 100) + "..."
    //             : item.description}
    //         </p>
    //       </div>
    //     </div>
    //     <img
    //       className="max-h-[140px] max-w-[50%]"
    //       src={
    //         item.image ? `http://localhost:3000/${item.image}` : NotExistIcon
    //       }
    //       alt=""
    //     />
    //   </div>
    //   {
    //     isPossibleDelete &&
    //       <div className="absolute left-0 top-0 flex w-full h-full bg-slate-100 bg-opacity-85">
    //         <input
    //           className="absolute bottom-2 right-2 w-6 h-6 border-2 border-purple-700"
    //           id={`checkbox-${index}`}
    //           checked={isChecked}
    //           type="checkbox"
    //           onChange={() => setChecked(!isChecked)}
    //         />
    //         <label htmlFor={`checkbox-${index}`} className="w-full"></label>
    //       </div>
    //   }
    // </div>
    <div 
      className="relative max-w-[360px] bg-white border-2 border-slate rounded-lg shadow-xl"
      id={`top-card-${index}`}
      onClick={handleLeftClick}
    >
      <div className="w-full h-[194px] bg-gray-200 shadow-md">
        <img
          className="mx-auto h-[100%]"
          src={
            item.image ? `http://localhost:3000/${item.image}` : NotExistIcon
          }
        />
      </div>
      <div className="w-full px-4 py-2 text-left divide-y-2 divide-slate-200">
        <div className="relative py-2">
          <span className="absolute right-0 xs:w-20 xs:px-4 py-1 px-2 rounded-xl xs:text-md text-sm bg-purple-200 text-purple-600">
            {item.title_id}
          </span>
          <h2 className=" text-[22px] font-semibold text-gray-800">
            {item.title}
          </h2>
          <div className="flex items-center font-semibold text-gray-600">
            {[1, 2, 3].map((item) => {
              return (
                <svg
                  className="w-5 h-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill={item <= parseInt(item.rate) ? "#ffd500" : "grey"}
                  key={item}
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              );
            })}
            <span className="flex items-center pl-1">{item.rate}</span>
            &nbsp;
            <span className="hover:cursor-pointer">({item.ratedCount})</span>
          </div>
          <h3 className="font-semibold">{item.catagory}</h3>
          <p className="text-sm whitespace-pre-line min-h-[150px] max-h-[150px] overflow-hidden">
            {item.description.length > 120
              ? item.description.substring(0, 120)
              : item.description}
          </p>
        </div>
        <div className="py-4">
          {item.tag.split(",").map((item, index) => {
            return (
              <span
                key={index}
                className="rounded-full text-center text-sm bg-purple-500 px-2 py-1 mr-2 text-white"
              >
                {item}
              </span>
            );
          })}
        </div>
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
