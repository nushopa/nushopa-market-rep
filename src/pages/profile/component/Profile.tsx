import { useNavigate } from "react-router-dom";
import Profiledetail from "./Profiledetail";

const Profile = () => {
    const navigate = useNavigate();
  return (
     <div className="mt-14">
        <p className="text-md text-start font-semibold mb-4 text-gray-900">
          Profile Details
        </p>
        
        <Profiledetail/>

         <div className="mt-8">
           <button onClick={() => navigate("/profile")} className="bg-[#028a00] text-[#fff]  text-sm font-medium py-3 px-4 rounded-md transition-colors w-full">
                Edit Profile
           </button>
          </div>
      </div>
  );
};

export default Profile;
