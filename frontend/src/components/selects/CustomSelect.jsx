import { useEffect, useState } from "react";

const CustomSelect = ({ type, values, selectedPrompt, changeSelect }) => {
  const [isExpaned, setExpaned] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [filteredItems, setFilteredItems] = useState(values);

  useEffect(() => {
    setFilteredItems(values)
  }, [values]);

  return (
    <ul className="relative text-sm border rounded-md shadow-md">
      <li 
        className="flex justify-between px-2 py-2 hover:bg-gray-200 rounded-md shadow-md hover:cursor-pointer"
        onClick={() => setExpaned(!isExpaned)}
      >
        <span className="ml-2">{selectedPrompt}</span>
        <span>
          <svg
            className="w-5 h-6 text-gray-800 dark:text-white"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 9-7 7-7-7"
            />
          </svg>
        </span>
      </li>
      {
        isExpaned &&
          <div className={`z-20 absolute px-4 py-2 bg-white border ring-1 ring-gray-200 shadow-md w-full`}>
            {
              type &&
                <span>
                  <input
                    type="text"
                    className="w-full px-2 py-1 mb-2 border rounded-md outline-none ring-1 ring-purple-400"
                    autoFocus
                    value={searchText}
                    onChange={(e) => {
                      setSearchText(e.target.value);
                      let tempArr = [];
                      values.map((item) => {
                        if(item.toLowerCase().includes(e.target.value.toLowerCase())) {
                          tempArr.push(item);
                        }
                      });
                      setFilteredItems(tempArr);
                    }}
                  />
                </span>
            }
            <ul className="divide-y-[1px]">
              {filteredItems.map((item, index) => {
                return (
                  <li
                    key={index}
                    className="px-2 py-1.5 hover:bg-gray-100 hover:cursor-pointer"
                    onClick={() => {
                        changeSelect(item)
                        setExpaned(false);
                      }
                    }
                  >
                    {item}
                  </li>
                );
              })}
            </ul>
          </div>
      }
    </ul>
  );
};

export default CustomSelect;
