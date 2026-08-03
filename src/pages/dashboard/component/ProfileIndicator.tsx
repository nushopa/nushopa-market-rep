import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertTriangle, Clock3 } from "lucide-react";
import { useAuth } from "../../../context/AuthContext";

type VerificationStatus = "pending" | "approved" | "rejected";

const ProfileIndicator = () => {
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  // Self-healing: always check the real backend state on mount instead of
  // trusting that whichever page updated the profile also synced context
  // correctly. Cheap safety net against drift/mismatches upstream.
  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const profileComplete = !!user?.profile_completed;
  const status: VerificationStatus = user?.status ?? "pending";

  // Determine state: incomplete profile always wins, then status
  let variant: "red" | "yellow" | "green";
  let title: string;
  let description: string;
  let showButton: boolean;

  if (!profileComplete) {
    variant = "red";
    title = "Profile Incomplete";
    description = "Complete your profile to get verified and start using your account.";
    showButton = true;
  } else if (status === "approved") {
    variant = "green";
    title = "Profile Verified";
    description = "Your identity has been verified successfully.";
    showButton = false;
  } else if (status === "rejected") {
    variant = "red";
    title = "Verification Failed";
    description = "There was an issue with your submitted documents. Please update your profile.";
    showButton = true;
  } else {
    // status === "pending"
    variant = "yellow";
    title = "Verification Under Review";
    description = "Your profile is complete and pending review. This usually takes 24–48 hours.";
    showButton = false;
  }

  const styles = {
    red: {
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-200 dark:border-red-800",
      text: "text-red-700",
      subtext: "text-red-600",
      icon: <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-500" />,
      button: "bg-red-600 hover:bg-red-700 text-white",
    },
    yellow: {
      bg: "bg-yellow-50 dark:bg-yellow",
      border: "border-yellow-200 dark:border-yellow-800",
      text: "text-gray-900",
      subtext: "text-gray-900",
      icon: <Clock3 className="w-5 h-5 text-gray-900 dark:text-yellow-500" />,
      button: "bg-yellow-600 hover:bg-yellow-700 text-white",
    },
    green: {
      bg: "bg-green-50 dark:bg-green-900/20",
      border: "border-green-200 dark:border-green-800",
      text: "text-green-700",
      subtext: "text-green-600",
      icon: <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />,
      button: "bg-green-600 hover:bg-green-700 text-white",
    },
  }[variant];

  return (
    <div
      role="status"
      className={`flex items-start gap-3 rounded-xl border px-4 py-3 my-6 ${styles.bg} ${styles.border}`}
    >
      <div className="mt-0.5">{styles.icon}</div>

      <div className="flex-1">
        <p className={`text-sm font-semibold ${styles.text}`}>{title}</p>
        <p className={`text-xs mt-0.5 ${styles.subtext}`}>{description}</p>
      </div>

      {showButton && (
        <button
          type="button"
          onClick={() => navigate("/profile")}
          className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-lg transition ${styles.button}`}
        >
          Update Profile
        </button>
      )}
    </div>
  );
};

export default ProfileIndicator;