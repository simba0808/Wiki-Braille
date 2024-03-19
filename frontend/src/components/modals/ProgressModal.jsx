const ProgressModal = ({ current, total }) => {
  console.log(current, total)
  return(
    <div className="min-w-screen h-screen animated fadeIn faster  fixed  left-0 top-0 flex justify-center items-center inset-0 z-50 outline-none focus:outline-none bg-no-repeat bg-center bg-cover" id="modal-id">
      <div className="absolute bg-black opacity-80 inset-0 z-0"></div>
      <div className="w-full  max-w-md relative mx-auto my-auto rounded-xl shadow-lg bg-white">
        <div className="p-4 pb-6 text-left">
          <h2 className="mb-4 text-xl font-semibold text-gray-700">Converting...</h2>
          <div className="mb-2 flex justify-end">
            <span className="px-3 py-0.5 bg-purple-200 text-purple-600 rounded-md">{current}/{total}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full dark:bg-gray-700">
            <div className="bg-blue-600 text-sm font-medium text-blue-100 text-center p-0.5 leading-none rounded-full" style={{width: `${current/total*100}%`}}>
              {
                `${(100*current/total).toFixed(2)} %`
              }
            </div>
        </div>
        </div>
      </div>
    </div>
  )
}

export default ProgressModal;