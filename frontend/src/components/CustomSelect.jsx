import { useState } from "react";

const CustomSelect = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ["Best Match", "Title Number", "Star Rating"];

  const toggleDropDown = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClicked = (option) => {
    setSelectedOption(option);
    setIsOpen(false);
  }

  return (
    <div className="relative inline-block text-left">
      <div>
        <span className="rouned-md shadow-md">
          <button
            type="button"
            className="inline-flex justify-center w-full rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={toggleDropDown}
            id="option-menu"
            aria-haspopup="true"
            aria-expanded="true"
          >
            { selectedOption || "Select an option"}
            <svg
              className="-mr-1 ml-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fill-rule="evenodd"
                d="M10 12a1 1 0 01-.7-.29l-4-4a1 1 0 011.42-1.42L10 10.59l3.29-3.3a1 1 0 111.42 1.42l-4 4a1 1 0 01-.71.29z"
                clip-rule="evenodd"
              />
            </svg>
          </button>
        </span>
      </div>
      {
        isOpen && (
          <div
            className="z-20 origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-md bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
            role="menu"
            aria-aria-orientation="vertical"
            aria-labelledby="option-menu"
          >
            <div className="py-1" role="none">
              {
                options.map((option) => (
                  <p
                    key={option}
                    className="block px-4 py-2 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                    onClick={() => handleOptionClicked(option)}
                    role="menuitem">
                      {option}
                  </p>
                ))
              }
            </div>
          </div>
        )
      }
    </div>
  )
};

export default CustomSelect;