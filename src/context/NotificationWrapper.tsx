import { useAuth } from "./AuthContext";
import NotificationProvider from "./NotificationProvider";

export default function NotificationWrapper({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  return (
    <NotificationProvider distributorId={user?.role === 6000 ? user?.id : undefined}>
      {children}
    </NotificationProvider>
  );
}