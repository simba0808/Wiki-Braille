export default function Pagination({
  startPageIndex,
  filteredCount,
  numberPerPage,
  currentPageIndex,
  backButtonHandle,
  forwardButtonHandle,
  goToFirstHandle,
  goToLastHandle,
  handlePageClick
}) {
  return (
    <ul className="inline-flex sm:items-center">
      <li className="flex items-center">
        <button aria-label="Previous" onClick={goToFirstHandle}>
          <svg className={`w-6 rotate-180 ${currentPageIndex<=1?"fill-gray-400":`fill-purple-600`}`} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LastPageIcon"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></svg>
        </button>
      </li>
      <li className="flex items-center">
        <button aria-label="Previous" onClick={backButtonHandle}>
          <svg
            aria-hidden="true"
            className={`w-6 ${currentPageIndex<=1?"fill-gray-400":`fill-purple-600`}`}
            viewBox="0 0 20 20"
          >
            <path
              d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </li>
      {
        [1, 2, 3, 4, 5].map((item, index) => {
          return (
            <li key={index} className="mx-[2px]">
              <button
                className={`w-9 h-9 rounded-full text-purple-600 focus:shadow-outline-purple border border-purple-600 focus:outline-none focus:shadow-outline-purple ${
                  currentPageIndex === startPageIndex + index
                    ? "bg-purple-600 text-white"
                    : ""
                } ${
                  startPageIndex + index >
                  (filteredCount % numberPerPage
                    ? filteredCount / numberPerPage + 1
                    : filteredCount / numberPerPage)
                    ? "opacity-50 cursor-not-allowed"
                    : ""
                }}`}
                onClick={() => handlePageClick(startPageIndex + index)}
                disabled={
                  startPageIndex + index >
                  (filteredCount % numberPerPage
                    ? filteredCount / numberPerPage + 1
                    : filteredCount / numberPerPage)
                    ? true
                    : false
                }
              >
                {startPageIndex + index}
              </button>
            </li>
          );
        })
      }
      <li className="flex items-center">
        <button aria-label="Next" onClick={forwardButtonHandle}>
          <svg
            className={`w-6 ${(currentPageIndex + 1) >= (filteredCount % numberPerPage ? filteredCount / numberPerPage + 1 : filteredCount / numberPerPage)?"fill-gray-400":`fill-purple-600`}`}
            aria-hidden="true"
            viewBox="0 0 20 20"
          >
            <path
              d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
              clipRule="evenodd"
              fillRule="evenodd"
            ></path>
          </svg>
        </button>
      </li>
      <li className="flex items-center">
        <button aria-label="Previous" onClick={goToLastHandle}>
          <svg className={`w-6 ${(currentPageIndex + 1) >= (filteredCount % numberPerPage ? filteredCount / numberPerPage + 1 : filteredCount / numberPerPage)?"fill-gray-400":`fill-purple-600`}`} focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="LastPageIcon"><path d="M5.59 7.41L10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z"></path></svg>
        </button>
      </li>
    </ul>
  );
}
