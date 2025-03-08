import React from "react";
import { Metadata } from "next";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Navigation from "@/components/navigation";
import LogoutButton from "@/components/logout-button";

export const metadata: Metadata = {
  title: "Admin Dashboard",
  description: "Admin dashboard for managing your application",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
        <div className="flex flex-col flex-grow pt-5 bg-white border-r border-gray-200 overflow-y-auto">
          <div className="flex items-center px-4 mb-6">
            <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
          </div>
          <Navigation />
          <LogoutButton />
        </div>
      </aside>

      {/* Mobile Header with Slide-out Navigation */}
      <div className="md:pl-64 flex flex-col flex-1">
        <div className="sticky top-0 z-10 md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 py-2">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="p-0 w-72">
                <div className="flex flex-col h-full">
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-lg font-semibold">Admin Panel</h2>
                  </div>
                  <Navigation />
                  <LogoutButton />
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
