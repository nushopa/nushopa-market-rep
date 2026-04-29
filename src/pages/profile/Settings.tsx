import { FaArrowLeft } from "react-icons/fa";
import Profile from "./component/Profile";
import Notification from "./component/Notification";
import Language from "./component/Language";
import Support from "./component/Support";


export default function Settings() {
 

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 py-4">
      <div className=" w-full max-w-4xl px-6 py-6 lg:px-8">
      <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => window.history.back()}
            className=" bg-gray-100 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <FaArrowLeft />
          </button>
        </div>
        <div className="mb-6 bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
          <h2 className="text-start text-xl font-bold text-gray-900">Settings</h2>
          <p className="text-start text-sm text-gray-500 ">
            Manage your profile and notification preferences
          </p>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
       <Profile/>

        <div className="space-y-2">
          <Notification/>
          <Language/>
          <Support/>
        </div>
      </div>
    </div>
    </div>
    
  );
}
