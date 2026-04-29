import { useState } from "react";

interface SettingsForm {
  name: string;
  email: string;
  notifications: Record<string, boolean>;
}

const Notification = () => {
  const [formData, setFormData] = useState<SettingsForm>({
    name: "",
    email: "",
    notifications: {
      orderUpdates: true,
      newMessages: true,
      paymentAlerts: false,
    },
  });

  const handleNotificationChange = (key: string) => {
    setFormData((prev) => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key as keyof SettingsForm["notifications"]],
      },
    }));
  };
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 py-2 px-4">
      <h3 className="text-lg text-start font-semibold mb-2 text-gray-900">
        Notifications
      </h3>
      <div className="space-y">
        {Object.entries(formData.notifications).map(([key, value]) => (
          <label
            key={key}
            className="flex items-center p-3 rounded-xl hover:bg-gray-50 cursor-pointer transition-colors"
          >
            <input
              type="checkbox"
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-5 w-5"
              checked={value}
              onChange={() => handleNotificationChange(key)}
            />
            <span className="ml-3 text-sm text-gray-900 capitalize">
              {key.replace(/([A-Z])/g, " $1")}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Notification;
