import { Home, Users, Megaphone, ClipboardList, Settings } from "lucide-react";
import type { LucideIcon } from "lucide-react";

export interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  /** Matches this route plus its sub-routes (e.g. /clients/3). */
  match: (path: string) => boolean;
}

export const navItems: NavItem[] = [
  { label: "Home", href: "/", icon: Home, match: (p) => p === "/" },
  {
    label: "Clients",
    href: "/clients",
    icon: Users,
    match: (p) => p.startsWith("/clients"),
  },
  {
    label: "Broadcasts",
    href: "/broadcasts",
    icon: Megaphone,
    match: (p) => p.startsWith("/broadcasts"),
  },
  {
    label: "Tasks",
    href: "/tasks",
    icon: ClipboardList,
    match: (p) => p.startsWith("/tasks"),
  },
  {
    label: "Settings",
    href: "/settings",
    icon: Settings,
    match: (p) => p.startsWith("/settings"),
  },
];
