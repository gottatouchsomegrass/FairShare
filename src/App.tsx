import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { UserProfile } from "./components/UserProfile";
import { FAQ } from "./components/FAQ";
import { HowToGuide } from "./components/HowToGuide";
import { useState, useRef, useEffect } from "react";
import { Loader } from "./components/Loader";
// import { ModeToggle } from "./components/mode-toggle";
import gsap from "gsap";
import { Menu } from "@headlessui/react";
import { Bars3Icon } from "@heroicons/react/24/outline";

export default function App() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-zinc-900">
      <header className="sticky top-0 z-20 bg-white/80 dark:bg-zinc-900/90 backdrop-blur-md h-16 flex justify-between items-center border-b border-gray-200 dark:border-zinc-800 shadow-lg px-2 sm:px-4 md:px-8 transition-colors">
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href="/"
            className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-primary text-white font-bold text-2xl shadow-md mr-1 sm:mr-2"
            style={{ textDecoration: "none" }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-users"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
              <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
          </a>
          <a href="/" style={{ textDecoration: "none" }}>
            <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold tracking-tight text-primary font-sans">
              FairShare
            </h2>
          </a>
        </div>
        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-4">
          {/* <ModeToggle /> */}
          <Authenticated>
            <button
              onClick={() => setShowHowTo(true)}
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              📚 How-To Guide
            </button>
            <button
              onClick={() => setShowFAQ(true)}
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              ❓ FAQ
            </button>
            <button
              onClick={() => setShowUserProfile(true)}
              className="text-xs sm:text-sm text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-1 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
            >
              👤 Profile
            </button>
            <SignOutButton />
          </Authenticated>
        </div>
        {/* Mobile nav */}
        <div className="flex sm:hidden items-center">
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-primary">
              <Bars3Icon className="w-6 h-6 text-gray-700 dark:text-gray-200" />
            </Menu.Button>
            <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 divide-y divide-gray-100 dark:divide-zinc-800 rounded-md shadow-lg focus:outline-none z-50">
              <div className="px-1 py-1">
                {/* <ModeToggle /> */}
                <Authenticated>
                  <button
                    onClick={() => setShowHowTo(true)}
                    className="w-full text-left text-xs text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    📚 How-To Guide
                  </button>
                  <button
                    onClick={() => setShowFAQ(true)}
                    className="w-full text-left text-xs text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    ❓ FAQ
                  </button>
                  <button
                    onClick={() => setShowUserProfile(true)}
                    className="w-full text-left text-xs text-gray-600 dark:text-gray-200 hover:text-primary dark:hover:text-primary transition-colors font-medium px-2 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-zinc-800"
                  >
                    👤 Profile
                  </button>
                  <SignOutButton />
                </Authenticated>
              </div>
            </Menu.Items>
          </Menu>
        </div>
      </header>
      <main className="flex-1 p-2 sm:p-4 flex flex-col justify-center">
        <Content />
      </main>
      <Toaster />

      {/* Modals */}
      {showUserProfile && (
        <UserProfile onClose={() => setShowUserProfile(false)} />
      )}
      {showFAQ && <FAQ onClose={() => setShowFAQ(false)} />}
      {showHowTo && <HowToGuide onClose={() => setShowHowTo(false)} />}
      {/* Footer */}
      <footer className="w-full text-center py-4 text-gray-500 text-sm border-t border-gray-200 mt-8">
        Made by{" "}
        <a
          href="https://github.com/gottatouchsomegrass"
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline"
        >
          gottatouchsomegrass (GitHub)
        </a>
      </footer>
    </div>
  );
}

function AnimatedWelcome() {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (el.current) {
      gsap.fromTo(
        el.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      );
    }
  }, []);
  return (
    <div
      ref={el}
      className="text-2xl sm:text-3xl font-bold text-primary dark:text-primary-300 mb-6 text-center"
    >
      Welcome to FairShare!
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);
  const [showWelcome, setShowWelcome] = useState(true);

  // Hide welcome after first dashboard render
  useEffect(() => {
    if (loggedInUser && showWelcome) {
      setShowWelcome(false);
    }
  }, [loggedInUser]);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
        <Loader className="scale-125" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 md:px-8">
      <Unauthenticated>
        <AnimatedWelcome />
        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-4 sm:gap-8 w-full px-2">
          <div className="w-full max-w-xs sm:max-w-sm md:max-w-lg">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
      <Authenticated>
        {/* Do not show AnimatedWelcome after login/dashboard */}
        <Dashboard />
      </Authenticated>
    </div>
  );
}
