const ProgressButton = ({ text, progress }) => {
  return (
    <div className="relative w-[120px] bg-purple-600 text-white rounded-t-md hover:cursor-pointer">
      <div className="h-full flex justify-center items-center">{text}</div>
      <div className="w-full h-[5px] bg-gray-200 rounded-b-md">
        <div className="bg-green-600 h-full" style={{width: 120*progress}}></div>
      </div>
    </div>
  )
}

export default ProgressButton;