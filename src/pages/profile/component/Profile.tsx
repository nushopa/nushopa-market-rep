import { useNavigate } from "react-router-dom";
import Profiledetail from "./Profiledetail";

const Profile = () => {
    const navigate = useNavigate();
  return (
    <div>
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-2 px-4">
        <p className="text-lg text-start font-semibold mb-4 text-gray-900">
          Profile
        </p>
        
        <Profiledetail/>

         <div className="mt-8">
           <button onClick={() => navigate("/profile")} className="bg-[#121212] text-white hover:bg-blue-600 text-sm font-medium text-gray-900 py-3 px-4 rounded-md transition-colors w-full">
                Edit Profile
           </button>
          </div>
      </div>
    </div>
  );
};

export default Profile;
