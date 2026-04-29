import { useState, useEffect } from "react";
import { getProfileDetails, type ApiAuthUser as AuthUser} from "../../../api/authApi";

const Profiledetail = () => {
  const [profile, setProfile] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getProfileDetails();
        setProfile(response);
      } catch (err: unknown) {
        console.error("Failed to fetch profile:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load profile";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-12 space-y-2">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center py-8 bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="mb-4">
          <p className="font-medium">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium text-sm"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-gray-500 text-center py-12 bg-gray-50 rounded-lg p-8">
        <p className="text-lg font-medium mb-2">No profile data available</p>
        <p className="text-sm">Please refresh the page or contact support</p>
      </div>
    );
  }

  const fullName =
    `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

  const formatDate = (dateString?: string | Date): string => {
    if (!dateString) return "N/A";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className=" text-start block text-sm font-medium text-gray-700 mb-2">
          Full Name
        </label>

        <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4">
          {fullName || "N/A"}
        </p>
      </div>

      <div>
        <label className=" text-start block text-sm font-medium text-gray-700 mb-2">
          Email Address
        </label>
        <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4">
          {profile.email || "N/A"}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="text-start block text-sm font-medium text-gray-700 mb-2">
            Phone Number
          </label>
          <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4">
            {profile.phone_number || "N/A"}
          </p>
        </div>

        <div>
          <label className="text-start block text-sm font-semibold text-gray-700 mb-3">
            Date of Birth
          </label>

          <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4 break-words">
            {formatDate(profile.date_of_birth) || "N/A"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className=" text-start block text-sm font-medium text-gray-700 mb-2">
            City
          </label>
          <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4">
            {profile.city || "N/A"}
          </p>
        </div>
        <div>
          <label className="text-start block text-sm font-semibold text-gray-700 mb-2">
            Address
          </label>

          <p className="text-start text-sm text-gray-900 border border-gray-200 rounded-lg py-2 px-4 break-words">
            {profile.address || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Profiledetail;
