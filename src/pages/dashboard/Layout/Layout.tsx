import { useState } from "react";
import {  Outlet, useLocation } from "react-router-dom";
import { cn } from "../../../utils";
import Header from "./Header";



const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/orders":    "Order",
  "/chat":      "Chat",
}

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(false);

   const { pathname } = useLocation();

   const pageTitle = pageTitles[pathname] ?? "Dashboard"

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar overlay */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/50 backdrop-blur-sm lg:hidden",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
      />

    

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden ">

        {/* Header */}
        <Header pageTitle={pageTitle} onMenuClick={() => setSidebarOpen(true)} />

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
