import type { LucideIcon } from "lucide-react";
import { Sparkles } from "lucide-react";

export type AppRouteItem = {
  title: string;
  href: string;
  description: string;
  icon: LucideIcon;
};

export const primaryRoutes: AppRouteItem[] = [
  {
    title: "AI Longevity Dashboard",
    href: "/dashboard",
    description: "Biological age, risk prediction & habit simulation",
    icon: Sparkles,
  },
];

export const utilityRoutes: AppRouteItem[] = [];