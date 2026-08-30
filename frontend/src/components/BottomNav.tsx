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
      className={`
        fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200
        ${variant === "teacher" ? "shadow-2xl" : "shadow-lg"}
      `}
    >
      <div className="flex justify-around items-center h-20 px-2">
        {items.map((item) => (
          <NavLink
            key={item.id}
            to={item.href}
            className={({ isActive }) => `
              flex flex-col items-center justify-center h-14 flex-1
              tap-highlight relative rounded-2xl mx-1 transition-colors
              ${
                isActive
                  ? "text-primary-600 bg-primary-50"
                  : "text-stone-500 hover:text-stone-800"
              }
            `}
          >
            <div className="text-2xl mb-1">{item.icon}</div>
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
