"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navItems } from "./nav";

/**
 * App chrome: a fixed left sidebar on desktop, a fixed bottom tab bar on mobile,
 * and an animated content area. Content is capped at ~480px and centred so the
 * desktop view reads as a faithful product preview rather than a stretched page.
 */
export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // The add/edit client form is a focused, modal-style flow (close via the
  // in-page "X"), so we drop the mobile tab bar there to match the design and
  // keep its fixed Save bar unobstructed.
  const isFormRoute =
    pathname === "/clients/new" || /\/clients\/[^/]+\/edit$/.test(pathname);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="fixed left-0 top-0 z-40 hidden h-full w-64 flex-col border-r border-outline-variant/40 bg-surface-container-low px-4 py-6 md:flex">
        <div className="flex items-center gap-3 px-2 pb-8">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-on-primary">
            <span className="text-headline-sm font-bold">DD</span>
          </div>
          <div className="leading-tight">
            <p className="text-body-lg font-bold text-primary">Darshak Desai</p>
            <p className="text-label-sm uppercase tracking-wider text-on-surface-variant">
              CRM
            </p>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {navItems.map((item) => {
            const active = item.match(pathname);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-full px-4 py-3 text-body-lg transition-colors ${
                  active
                    ? "bg-secondary-container font-bold text-primary"
                    : "text-on-surface-variant hover:bg-surface-variant/60"
                }`}
              >
                <Icon
                  className="h-5 w-5"
                  strokeWidth={active ? 2.4 : 2}
                />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-4 rounded-xl bg-surface-container px-4 py-3">
          <p className="text-label-md uppercase tracking-wider text-on-surface-variant">
            Agamic Financial
          </p>
          <p className="mt-0.5 text-body-md font-medium text-on-surface">
            Darshak Desai · Admin
          </p>
        </div>
      </aside>

      {/* Main column */}
      <div className="md:pl-64">
        <main className="mx-auto w-full max-w-[480px] px-container-padding pb-28 pt-4 md:pb-12 md:pt-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.26, ease: [0.22, 1, 0.36, 1] }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        className={`pb-safe fixed bottom-0 left-0 z-50 w-full items-center justify-around border-t border-outline-variant/50 bg-surface px-2 py-2 shadow-[0_-4px_16px_rgba(0,0,0,0.05)] md:hidden ${
          isFormRoute ? "hidden" : "flex"
        }`}
      >
        {navItems.map((item) => {
          const active = item.match(pathname);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`relative flex min-w-[60px] flex-col items-center justify-center rounded-lg py-1.5 transition-colors active:scale-90 ${
                active ? "text-primary" : "text-on-surface-variant"
              }`}
            >
              {active && (
                <span className="absolute top-0 h-1 w-8 rounded-b-full bg-primary" />
              )}
              <Icon
                className="mb-1 h-6 w-6"
                strokeWidth={active ? 2.5 : 2}
                fill={active ? "currentColor" : "none"}
                fillOpacity={active ? 0.12 : 0}
              />
              <span
                className={`text-label-sm ${active ? "font-bold" : "font-medium"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
