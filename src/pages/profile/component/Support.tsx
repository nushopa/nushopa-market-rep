import { IoMdCall } from "react-icons/io";
import { MdEmail } from "react-icons/md";

interface SelectOption {
  value: React.ReactNode;
  name: string;
  action: () => void;        // Changed from path to action for flexibility
}



const Support = () => {
    const SUPPORT_EMAIL = "support@yourcompany.com";
  const supportOptions: SelectOption[] = [
   {
      value: <IoMdCall  />,
      name: "Call Support",
      action: () => {
        console.log("Navigate to call support");
        // navigate("/support/call");   // Uncomment if using react-router
      },
    },
    {
      value: <MdEmail />,
      name: "Email Support",
      action: () => {
        // This opens the user's default email app (Gmail, Outlook, etc.)
        window.location.href = `mailto:${SUPPORT_EMAIL}?subject=Support%20Request&body=Hello%2C%0A%0AI%20need%20assistance%20with...`;
      },
    },
  ];


  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-4 px-5">
      <div className="flex items-center ">
        <p className="text-lg font-semibold text-gray-900">Support</p>
      </div>

      <div >
        {supportOptions.map((option) => (
          <div
            key={option.name}
            className="flex justify-between items-center gap-2 p-2 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors "
          >
            
            <span className="text-sm font-medium text-gray-900">
              {option.name}
            </span>
            <button onClick={option.action} className="text-gray-600 bg-blue-100 p-2 rounded-full ">
              {option.value}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Support;