import type { LucideIcon } from "lucide-react";
import { Sparkles, BarChart3, Target, Clock, UserCircle2 } from "lucide-react";

export type AppRouteItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const primaryRoutes: AppRouteItem[] = [
  {
    title: "AI Longevity Lab",
    href: "/dashboard",
    description: "Biological age, risk prediction & habit simulation",
    icon: Sparkles,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    description: "Trends, body systems & health score over time",
    icon: BarChart3,
  },
  {
    title: "Goals",
    href: "/dashboard/goals",
    description: "Set & track long-term longevity goals",
    icon: Target,
  },
  {
    title: "History",
    href: "/dashboard/history",
    description: "Chronological log of all AI predictions",
    icon: Clock,
  },
];

export const utilityRoutes: AppRouteItem[] = [
  {
    title: "Profile",
    href: "/dashboard/profile",
    description: "Your health baseline & account settings",
    icon: UserCircle2,
  },
];