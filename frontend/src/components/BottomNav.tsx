import React from "react";
import { NavLink } from "react-router-dom";

interface NavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number | string;
}

interface BottomNavProps {
  items: NavItem[];
  variant?: "student" | "teacher";
}

export const BottomNav: React.FC<BottomNavProps> = ({
  items,
  variant = "student",
}) => {
  return (
    <nav
      className={`fixed bottom-3 left-3 right-3 z-20 mx-auto max-w-xl rounded-2xl border border-stone-200/80 bg-white/95 p-2 shadow-lifted backdrop-blur lg:bottom-6 ${variant === "teacher" ? "lg:max-w-2xl" : ""}`}
    >
      <div className="flex items-center justify-around gap-1">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) => `
              flex flex-1 flex-col items-center justify-center rounded-xl py-2 tap-highlight relative transition-colors
              ${
                isActive
                    ? "text-primary-700 bg-primary-50"
                  : "text-stone-500 hover:text-stone-800"
              }
            `}
          >
            <div className="mb-1 text-lg">{item.icon}</div>
            <span className="text-xs font-medium">{item.label}</span>
            {item.badge ? (
              <span className="absolute top-1 right-1/4 bg-accent-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {item.badge}
              </span>
            ) : null}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

// Predefined navigation for student users
export const StudentBottomNav: React.FC = () => {
  const items: NavItem[] = [
    {
      id: "home",
      label: "דף הבית",
      icon: "🏠",
      href: "/student/dashboard",
    },
    {
      id: "lessons",
      label: "שיעורים",
      icon: "📅",
      href: "/student/lessons",
    },
    {
      id: "messages",
      label: "הודעות",
      icon: "💬",
      href: "/student/messages",
      badge: 0,
    },
    {
      id: "profile",
      label: "פרופיל",
      icon: "👤",
      href: "/student/profile",
    },
  ];

  return <BottomNav items={items} variant="student" />;
};

// Predefined navigation for teacher users
export const TeacherBottomNav: React.FC = () => {
  const items: NavItem[] = [
    {
      id: "home",
      label: "דף הבית",
      icon: "🏠",
      href: "/teacher/dashboard",
    },
    {
      id: "calendar",
      label: "לוח זמנים",
      icon: "📆",
      href: "/teacher/calendar",
    },
    {
      id: "students",
      label: "תלמידים",
      icon: "👥",
      href: "/teacher/students",
    },
    {
      id: "messages",
      label: "הודעות",
      icon: "💬",
      href: "/teacher/messages",
      badge: 0,
    },
    {
      id: "profile",
      label: "פרופיל",
      icon: "👤",
      href: "/teacher/profile",
    },
  ];

  return <BottomNav items={items} variant="teacher" />;
};
