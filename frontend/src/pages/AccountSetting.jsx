const AccountSetting = () => {
  return (
    <main className="h-full">
      <div className="container px-6 mx-auto grid">
        <h2 className="my-6 text-2xl text-left font-semibold text-gray-700 dark:text-gray-200">
          Account Setting
        </h2>
        <div className="flex ">
          <div className="w-[30%] flex flex-col justify-center">
            <p className="text-lg font-bold">Personal Information</p>
            <p className="py-2">Update your accout settings</p>
          </div>
          <div className="grow px-8 py-4">
            <div className="flex">
              <div className="w-[20%]">
                <img src="" alt="avatar" />
              </div>
              <div className="grow flex flex-col flex-start">
                <button className="w-[120px] py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
                  Change Avatar
                </button>
                <p className="p-4 pt-1 pl-0 text-left text-sm ">JPG, GIF, or PNG. 1MB max</p>
              </div>
            </div>
            <div className="p-2">
              <label className="float-left">Your Name</label>
              <input
                className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                placeholder="Aki Nao"
              />
            </div>
            <div className="p-2">
              <label className="float-left">Your Email</label>
              <input
                className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                placeholder="aki.geniuse@gmail.com"
              />
            </div>
            <button className="float-left ml-2 mt-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              Save
            </button>
          </div>
        </div>
        <div className="flex divide divide-y-2 divide-slate-300">
          <div className="w-[30%] flex flex-col justify-center">
            <p className="text-lg font-bold">Change password</p>
            <p className="py-2">Update your password associated with your account.</p>
          </div>
          <div className="grow px-8 py-4">
            <div className="px-2 py-2">
              <label className="float-left py-1">Current Password</label>
              <input
                className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                type="password"
                placeholder="******"
              />
            </div>
            <div className="px-2 py-2">
              <label className="float-left py-1">New Password</label>
              <input
                className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                type="password"
                placeholder="******"
              />
            </div>
            <div className="px-2 py-2">
              <label className="float-left py-1">Confirm Password</label>
              <input
                className="block w-full p-2 text-md text-black border-2 rounded-md focus:ring-2 focus:ring-purple-300 focus:outline-none form-input"
                type="password"
                placeholder="******"
              />
            </div>
            <button className="float-left ml-2 mt-4 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-purple-600 border border-transparent rounded-lg active:bg-purple-600 hover:bg-purple-700 focus:outline-none focus:shadow-outline-purple">
              Save
            </button>
          </div>
        </div>
        <div className="flex divide divide-y-2 divide-slate-300">
          <div className="w-[30%] py-4 flex flex-col justify-center">
            <p className="text-lg font-bold">Delete account</p>
          </div>
          <div className="grow px-8 py-8">
            <button className="float-left ml-2 px-4 py-2 text-sm font-medium leading-5 text-white transition-colors duration-150 bg-red-600 border border-transparent rounded-lg active:bg-red-700 hover:bg-red-500 focus:outline-none focus:shadow-outline-purple">
              Delete Account
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AccountSetting;
