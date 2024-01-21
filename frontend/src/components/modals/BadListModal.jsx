const BadListModal = ({ clickClose, imageList }) => {
  const handleClickClose = () => {
    clickClose(false);
  }
  return (
    <div className="flex justify-center items-center z-30" >
      <div x-data="{ open: true }">
        <div x-show="open" className="fixed inset-0 px-2 z-10 overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
          <div className="bg-white rounded-md shadow-xl overflow-hidden w-full max-h-[80%] md:w-2/3 xl:w-1/2 z-50">
            <div className="bg-indigo-500 text-white px-4 py-4 flex justify-between">
              <h2 className="text-lg font-semibold">As imagens abaixo são de origem</h2>
            </div>

            <div className="p-4">
              <p className="pb-2 text-lg font-semibold">O formato da imagem abaixo precisa ser alterado para PNG ou JPEG.</p>
              <div className="grid grid-cols-3 gap-y-1 xs:grid-cols-5 border divide-y h-64 xs:text-md text-sm overflow-y-auto ">
                {
                  imageList.map((item, index) => <span key={index} className="border-t">{item.title}, {item.order}</span>)
                }
              </div>
            </div>

            <div className="border-t px-4 py-2 flex justify-end">
              <button className="px-3 py-1 bg-indigo-500 text-white  rounded-md w-full sm:w-auto" onClick={handleClickClose}> Aceitar </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BadListModal;