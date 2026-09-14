import { NavLink } from "react-router-dom";
import { ReactNode } from "react";

interface AppShellProps { children: ReactNode }

const links = [
  { href: "/student/dashboard", label: "סקירה", icon: "⌂" },
  { href: "/student/lessons", label: "השיעורים שלי", icon: "◷" },
  { href: "/student/lessons/browse", label: "קביעת שיעור", icon: "+" },
];

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="app-shell">
      <header className="border-b border-stone-200/80 bg-[#f5f5f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-10">
          <NavLink to="/student/dashboard" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-stone-950 text-lg text-white shadow-soft">מ</span>
            <span><span className="block font-serif text-lg font-bold leading-none text-stone-950">מסלול</span><span className="mt-1 block text-[0.63rem] font-bold tracking-[0.16em] text-primary-600">DRIVE WITH CONFIDENCE</span></span>
          </NavLink>
          <div className="hidden items-center gap-2 text-sm text-stone-500 sm:flex"><span className="h-2 w-2 rounded-full bg-success-500" /> המערכת זמינה</div>
        </div>
      </header>
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-l border-stone-200/80 px-5 py-8 lg:block">
          <p className="eyebrow mb-4">אזור אישי</p>
          <nav className="space-y-2">{links.map((link) => <NavLink key={link.href} to={link.href} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors ${isActive ? "bg-stone-950 text-white" : "text-stone-500 hover:bg-white hover:text-stone-950"}`}><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-50 text-primary-700">{link.icon}</span>{link.label}</NavLink>)}</nav>
          <div className="mt-10 rounded-2xl bg-primary-50 p-4"><p className="text-xs font-bold text-primary-700">טיפ לדרך</p><p className="mt-2 text-sm leading-6 text-primary-900">שיעור קצר בכל שבוע שומר על הקצב ומקרב אתכם לרישיון.</p></div>
        </aside>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}