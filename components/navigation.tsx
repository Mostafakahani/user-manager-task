"use client";

import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, BarChart3, Settings } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
interface NavItemProps {
  href: string;
  icon: React.ReactNode;
  title: string;
  isActive?: boolean;
}
export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 px-2 space-y-1">
      <NavItem
        href="/dashboard"
        icon={<LayoutDashboard className="h-5 w-5" />}
        title="Dashboard"
        isActive={pathname === "/dashboard"}
      />
      <NavItem
        href="/dashboard/users"
        icon={<Users className="h-5 w-5" />}
        title="Users"
        isActive={pathname.startsWith("/dashboard/users")}
      />
      <NavItem
        href="/dashboard/analytics"
        icon={<BarChart3 className="h-5 w-5" />}
        title="Analytics"
        isActive={pathname === "/dashboard/analytics"}
      />
      <NavItem
        href="/dashboard/settings"
        icon={<Settings className="h-5 w-5" />}
        title="Settings"
        isActive={pathname === "/dashboard/settings"}
      />
    </nav>
  );
}

const NavItem = ({ href, icon, title, isActive }: NavItemProps) => (
  <Link href={href} className="flex">
    <Button
      variant="ghost"
      className={cn(
        "w-full justify-start gap-2",
        isActive ? "bg-muted" : "hover:bg-muted"
      )}
    >
      {icon}
      <span>{title}</span>
    </Button>
  </Link>
);
