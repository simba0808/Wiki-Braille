const ProgressCircle = ({ progress, name }) => {
  const circumference = 50 * 2 * Math.PI;

  return (
    <div className="flex items-center flex-wrap max-w-lg px-10 bg-white rounded-2xl p-2 shadow-md">
      <div className="flex items-center justify-center -m-6 overflow-hidden bg-white rounded-full">
        <svg className="w-32 h-32 transform translate-x-1 translate-y-1" aria-hidden="true">
          <circle
            className="text-gray-300"
            strokeWidth="10"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
          <circle
            className="text-blue-600"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - (progress / 100) * circumference}
            strokeLinecap="round"
            stroke="currentColor"
            fill="transparent"
            r="50"
            cx="60"
            cy="60"
          />
        </svg>
        <span className="absolute text-2xl text-blue-700">{`${parseInt(progress)}%`}</span>
      </div>
      <div className="flex hidden sm:block">
          <p className="ml-10 font-medium text-gray-600 sm:text-sm">{name}</p>
        </div>
    </div>
  );
};

export default ProgressCircle;