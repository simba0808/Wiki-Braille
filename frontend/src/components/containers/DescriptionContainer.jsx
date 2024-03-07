import DescriptionCard from '../cards/DescriptionCard';
import { setIndexesToDelete } from '../../slices/dashboardSlice';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import useToast from '../../hook/useToast';

import axios from 'axios';
import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';

const DescriptionContainer = ({ viewMode, screenSize, filteredData, handleClick }) => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { indexesToDelete } = useSelector((state) => state.delete);

  const [isPossibleDelete, setPossibleDelete] = useState(false);

  const customToast = useToast();

  const handleDeleteConfirmClick = async () => {
    try {
      axios.defaults.headers.common["Authorization"] = `Bearer ${userInfo.token}`;
      const response = await axios.post("/api/data/batchdelete", { user: userInfo.name, indexesToDelete });
      if(response.data.message === "success") {
        customToast("success", "Excluído com sucesso.");
        location.reload();
      }
    } catch(err) {
      customToast("failed", "Falha ao excluir descrições");
    }
    setPossibleDelete(false);
    dispatch(setIndexesToDelete([]));
  }

  const handleDeleteCancelClick = () => {
    setPossibleDelete(false);
    dispatch(setIndexesToDelete([]));
    location.reload();
  }

  return (
    <div className="relative">
      {
        viewMode ?
          <Box sx={{ width: "100%", overflowY: 'none', py: 2 }}>
            <ImageList variant={screenSize.isSmall ? "masonry" : ""} cols={screenSize.isSmall ? 2 : 4} gap={10}>
              {
                filteredData.map((item, index) => {
                  return (
                    <div className="sm:h-[260px] h-auto relative flex flex-col justify-center my-2 border-2 border-t-0 shadow-md bg-white rounded-lg  hover:cursor-pointer" key={item.image} onClick={() => handleClick(index)}>
                      <span className="absolute xs:right-2 xs:top-2 right-1 top-1 xs:w-20 xs:px-4 py-1 px-2 rounded-xl text-xs md:text-sm bg-purple-200 text-purple-600">{item.title_id}</span>
                      <div key={item.image} className="p-2 pt-8 mx-auto">
                        <img
                          srcSet={`${item.image}?w=248&fit=crop&auto=format&dpr=2 2x`}
                          src={`${item.image ? item.image : "src/assets/img/empty.svg"}?w=248&fit=crop&auto=format`}
                          className="sm:max-h-[200px]"
                          alt={item.title}
                          loading="lazy"
                        />
                      </div>
                      <div className="px-2 py-2">
                        <p className="absolute bottom-0 w-[90%] text-center overflow-hidden whitespace-nowrap text-overflow-ellipsis text-sm sm:text-md sm:font-semibold ">{item.title}</p>
                      </div>
                    </div>
                  );
                })
              }
            </ImageList>
          </Box> :
          <div className={`p-2 pt-0 ${filteredData.length ? `grid gap-2 md:grid-cols-2 grid-cols-1 rounded-b-xl` : ""}`}>
            {
              filteredData.length 
                ? filteredData.map((item, index) => {
                    return (
                      <DescriptionCard onClick={handleClick} item={item} key={index} index={index} isPossibleDelete={isPossibleDelete} />
                    )
                  }) 
                : <img src="src/assets/img/empty.svg" className="mx-auto py-4 sm:py-14 2xl:py-24" />
            }
          </div>
      }
      <div className="fixed right-4 top-24">
        {
          !isPossibleDelete ?
            <button className="" onClick={() => setPossibleDelete(true)}>
              <svg className="w-10 hover:scale-110 transition-transform duration-200" fill="#7e3af2" xmlns="http://www.w3.org/2000/svg" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24">
                <path d="m23,12h-6c-.553,0-1-.447-1-1s.447-1,1-1h6c.553,0,1,.447,1,1s-.447,1-1,1Zm-1,4c0-.553-.447-1-1-1h-4c-.553,0-1,.447-1,1s.447,1,1,1h4c.553,0,1-.447,1-1Zm-2,5c0-.553-.447-1-1-1h-2c-.553,0-1,.447-1,1s.447,1,1,1h2c.553,0,1-.447,1-1Zm-4.344,2.668c-.558.213-1.162.332-1.795.332h-5.728c-2.589,0-4.729-1.943-4.977-4.521L1.86,6h-.86c-.552,0-1-.447-1-1s.448-1,1-1h4.101C5.566,1.721,7.586,0,10,0h2c2.414,0,4.434,1.721,4.899,4h4.101c.553,0,1,.447,1,1s-.447,1-1,1h-.886l-.19,2h-2.925c-1.654,0-3,1.346-3,3,0,1.044.537,1.962,1.348,2.5-.811.538-1.348,1.456-1.348,2.5s.537,1.962,1.348,2.5c-.811.538-1.348,1.456-1.348,2.5,0,1.169.678,2.173,1.656,2.668Zm-.84-19.668c-.414-1.161-1.514-2-2.816-2h-2c-1.302,0-2.402.839-2.816,2h7.631Z"/>
              </svg>
            </button> :
            <div className="flex">
              <button 
                className="px-4 py-2 flex items-center bg-purple-500 text-white rounded-l-xl hover:scale-105 focus:ring-offset-1 focus:ring-2 focus:ring-purple-500" 
                onClick={handleDeleteCancelClick}
              >
                <svg className="inline pr-1" fill="white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                  <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                </svg>
                Cancel
              </button>
              <button 
                className="px-2 py-2 flex items-center  bg-red-600 text-white rounded-r-xl hover:scale-105 focus:ring-offset-1 focus:ring-2 focus:ring-red-500" 
                onClick={handleDeleteConfirmClick}
              >
                <svg className="inline" fill="white" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 26 26">
                  <path d="M 22.566406 4.730469 L 20.773438 3.511719 C 20.277344 3.175781 19.597656 3.304688 19.265625 3.796875 L 10.476563 16.757813 L 6.4375 12.71875 C 6.015625 12.296875 5.328125 12.296875 4.90625 12.71875 L 3.371094 14.253906 C 2.949219 14.675781 2.949219 15.363281 3.371094 15.789063 L 9.582031 22 C 9.929688 22.347656 10.476563 22.613281 10.96875 22.613281 C 11.460938 22.613281 11.957031 22.304688 12.277344 21.839844 L 22.855469 6.234375 C 23.191406 5.742188 23.0625 5.066406 22.566406 4.730469 Z"></path>
                </svg>
                Confirm
              </button>
            </div>
        }
      </div>
    </div>
  );
}

export default DescriptionContainer