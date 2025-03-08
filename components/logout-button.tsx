"use client";
import { signOut } from "next-auth/react";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <div className="p-4 border-t border-gray-200">
      <Button
        onClick={() => signOut({ callbackUrl: "/" })}
        variant="outline"
        className="w-full justify-start gap-2 cursor-pointer"
      >
        <LogOut className="h-5 w-5" />
        <span>Logout</span>
      </Button>
    </div>
  );
}
