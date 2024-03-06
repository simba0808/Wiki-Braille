import DescriptionCard from '../cards/DescriptionCard';

import Box from '@mui/material/Box';
import ImageList from '@mui/material/ImageList';

const DescriptionContainer = ({ viewMode, screenSize, filteredData, handleClick }) => {

  return (
    <>
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
                        src={`${item.image ? `http://localhost:3000/${item.image}` : "src/assets/img/empty.svg"}?w=248&fit=crop&auto=format`}
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
                    <DescriptionCard onClick={handleClick} item={item} key={index} index={index} />
                  )
                }) 
              : <img src="src/assets/img/empty.svg" className="mx-auto py-4 sm:py-14 2xl:py-24" />
          }
        </div>
      }
    </>
  );
}

export default DescriptionContainer