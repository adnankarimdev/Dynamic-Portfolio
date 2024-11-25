"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  ListStart,
  Infinity,
  FilePenLine,
  LogOut,
  MonitorCheck,
  Star,
  MessageCircle,
  Reply,
  Route,
  Monitor,
  BadgePlus,
  Loader,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import LogoSvg from "../../app/logo.svg";

const navItems = [
  {
    icon: LayoutDashboard,
    label: "Dashboard",
    href: "#",
    show: true,
  },
  { icon: LogOut, label: "Logout", href: "/", show: true },
];

export function AppSidebar() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    sessionStorage.removeItem("authToken");
    router.push("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className="mb-2"></div>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map(
                (item) =>
                  item.show && (
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full justify-start px-2",
                        "hover:bg-accent hover:text-accent-foreground",
                      )}
                      asChild
                    >
                      {item.label === "Logout" ? (
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full"
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="ml-2 hidden group-hover:inline-block">
                            {item.label}
                          </span>
                        </button>
                      ) : (
                        <Link href={item.href}>
                          <item.icon className="h-5 w-5" />
                          <span className="ml-2 hidden group-hover:inline-block">
                            {item.label}
                          </span>
                        </Link>
                      )}
                    </Button>
                  ),
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
