import { useNavigate } from "react-router-dom";
import UserLayout from "../dashboard/component/UserLayout";
import Profile from "./component/Profile";

export default function Settings() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex items-center justify-center  py-4">
      <div>
        <UserLayout
          showName
          onSettings={() => navigate("/settings")}
          size="lg"
        />
        <Profile /> 
      </div>
    </div>
  );
}
