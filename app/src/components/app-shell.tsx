"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { signOut } from "@/app/actions/auth";

type AppShellProps = {
  title: string;
  description: string;
  children: ReactNode;
  userName?: string;
};

const navItems = [
  { label: "Dashboard", href: "/" },
  { label: "Opportunities", href: "/opportunities" },
  { label: "Customers", href: "/customers" },
  { label: "Inventory", href: "/inventory" },
  { label: "Tasks", href: "/tasks" },
  { label: "Marketing", href: "/marketing", badge: "12" },
];

function Sidebar({ pathname }: { pathname: string }) {
  return (
    <aside className="hidden w-80 shrink-0 border-r border-slate-200 bg-slate-950/95 text-slate-100 lg:flex lg:flex-col">
      <div className="border-b border-white/10 px-6 py-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/15 text-lg font-semibold text-emerald-300">
            RV
          </div>
          <div>
            <p className="text-sm font-semibold tracking-wide text-white">RV Sales Mission Control</p>
            <p className="text-xs text-slate-400">Dealership command center</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-4 py-5">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm transition ${
                isActive ? "bg-white/10 text-white" : "text-slate-300 hover:bg-white/5 hover:text-white"
              }`}
            >
              <span>{item.label}</span>
              {item.badge ? (
                <span className="rounded-full bg-emerald-400/15 px-2 py-0.5 text-[11px] text-emerald-300">
                  {item.badge}
                </span>
              ) : null}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-white/10 px-5 py-4 text-sm text-slate-400">
        <p className="font-medium text-slate-200">Live floor health</p>
        <div className="mt-3 rounded-2xl bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <span>Conversion rate</span>
            <span className="text-emerald-300">21.4%</span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-800">
            <div className="h-full w-[72%] rounded-full bg-emerald-300" />
          </div>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ title, description, children, userName = "Avery" }: AppShellProps) {
  const pathname = usePathname();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex min-h-screen bg-slate-100 text-slate-900">
      <Sidebar pathname={pathname} />

      <main className="flex-1">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/80 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-sm font-medium text-slate-500">
              {greeting}, {userName.split("@")[0]}
            </p>
            <h1 className="text-2xl font-semibold text-slate-950">{title}</h1>
            <p className="text-sm text-slate-500">{description}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="text-slate-600">Sales floor online</span>
            </div>
            <form action={signOut}>
              <button
                type="submit"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign out
              </button>
            </form>
          </div>
        </header>

        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}
