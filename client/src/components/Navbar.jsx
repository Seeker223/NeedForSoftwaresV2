import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignOutButton,
  UserButton,
  useUser,
} from "@clerk/clerk-react";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const { user } = useUser();
  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    setOpen(false);
  }, [location.pathname, location.search]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="w-full h-16 md:h-20 flex items-center justify-between sticky top-0 z-40 backdrop-blur-md bg-white/75 dark:bg-slate-950/70 border-b border-slate-200/60 dark:border-slate-800">
      <Link to="/" className="flex items-center gap-3 text-lg md:text-xl font-bold tracking-tight">
        <img src="/logo.png" alt="NeedForSoftwares Logo" className="w-8 h-8 rounded-lg" />
        <span className="text-slate-900 dark:text-slate-100">NeedForSoftwares</span>
      </Link>

      <div className="hidden md:flex items-center gap-5 xl:gap-7 text-sm font-medium text-slate-700 dark:text-slate-200">
        <Link to="/" className="hover:text-brand-700 transition">
          Home
        </Link>
        <Link to="/posts?sort=trending" className="hover:text-brand-700 transition">
          Trending
        </Link>
        <Link to="/posts?sort=popular" className="hover:text-brand-700 transition">
          Most Popular
        </Link>
        <SignedIn>
          {isAdmin && (
          <Link
            to="/write"
            className="px-4 py-2 rounded-full bg-brand-700 text-white shadow-soft hover:bg-brand-800 transition"
          >
            Write Post
          </Link>
          )}
        </SignedIn>
        <ThemeToggle />
        <SignedOut>
          <Link
            to="/login"
            className="py-2 px-4 rounded-full border border-brand-200 dark:border-slate-700 text-brand-800 dark:text-brand-200 hover:bg-brand-50 dark:hover:bg-slate-800 transition"
          >
            Login
          </Link>
        </SignedOut>
        <SignedIn>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 dark:text-slate-400 max-w-28 truncate">
              {user?.username || user?.primaryEmailAddress?.emailAddress}
            </span>
            <UserButton />
            <SignOutButton>
              <button className="text-xs px-3 py-1.5 rounded-full border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                Sign out
              </button>
            </SignOutButton>
          </div>
        </SignedIn>
      </div>

      <button
        className="md:hidden h-10 w-10 rounded-lg border border-slate-300 dark:border-slate-700 flex items-center justify-center"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Toggle menu"
        type="button"
      >
        <div className="flex flex-col gap-1.5">
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-transform ${
              open ? "translate-y-2 rotate-45" : ""
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-opacity ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`h-0.5 w-5 bg-slate-900 dark:bg-slate-100 transition-transform ${
              open ? "-translate-y-2 -rotate-45" : ""
            }`}
          />
        </div>
      </button>

      <div
        className={`md:hidden fixed inset-0 top-16 z-50 transition-all duration-300 ${
          open
            ? "translate-x-0 opacity-100"
            : "translate-x-full opacity-0 pointer-events-none"
        }`}
      >
        <div
          className={`absolute inset-0 bg-slate-900/45 transition-opacity duration-300 ${
            open ? "opacity-100" : "opacity-0"
          }`}
          onClick={() => setOpen(false)}
        />
        <div className="relative h-full bg-brand-50 dark:bg-slate-900 p-6 flex flex-col justify-between border-l border-brand-200/60 dark:border-slate-700">
          <nav className="flex flex-col gap-5 text-lg font-medium text-slate-800 dark:text-slate-100">
            <Link to="/">Home</Link>
            <Link to="/posts?sort=trending">Trending</Link>
            <Link to="/posts?sort=popular">Most Popular</Link>
            <SignedIn>{isAdmin && <Link to="/write">Write Post</Link>}</SignedIn>
          </nav>

          <div className="border-t border-slate-200 dark:border-slate-800 pt-5 space-y-4">
            <SignedIn>
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs text-slate-500 dark:text-slate-400">Signed in as</p>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-100 truncate">
                    {user?.username || user?.primaryEmailAddress?.emailAddress}
                  </p>
                </div>
                <UserButton />
              </div>
              <SignOutButton>
                <button
                  className="w-full rounded-xl px-4 py-3 border border-slate-300 dark:border-slate-700 text-sm"
                  type="button"
                >
                  Sign out
                </button>
              </SignOutButton>
            </SignedIn>
            <SignedOut>
              <Link
                to="/login"
                className="block text-center rounded-xl px-4 py-3 bg-brand-700 text-white"
              >
                Login
              </Link>
            </SignedOut>
            <div className="flex justify-end">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
