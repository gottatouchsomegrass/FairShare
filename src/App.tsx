import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { SignInForm } from "./SignInForm";
import { SignOutButton } from "./SignOutButton";
import { Toaster } from "sonner";
import { Dashboard } from "./components/Dashboard";
import { UserProfile } from "./components/UserProfile";
import { FAQ } from "./components/FAQ";
import { HowToGuide } from "./components/HowToGuide";
import { useState } from "react";
import { Loader } from "./components/Loader";
import { ModeToggle } from "./components/mode-toggle";

export default function App() {
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [showFAQ, setShowFAQ] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm h-16 flex justify-between items-center border-b shadow-sm px-2 sm:px-4">
        <h2 className="text-lg sm:text-xl font-semibold text-primary">
          FairShare
        </h2>
        <div className="flex items-center gap-2 sm:gap-4">
          <ModeToggle />
          <Authenticated>
            <button
              onClick={() => setShowHowTo(true)}
              className="text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors"
            >
              📚 How-To Guide
            </button>
            <button
              onClick={() => setShowFAQ(true)}
              className="text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors"
            >
              ❓ FAQ
            </button>
            <button
              onClick={() => setShowUserProfile(true)}
              className="text-xs sm:text-sm text-gray-600 hover:text-primary transition-colors"
            >
              👤 Profile
            </button>
            <SignOutButton />
          </Authenticated>
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
    </div>
  );
}

function Content() {
  const loggedInUser = useQuery(api.auth.loggedInUser);

  if (loggedInUser === undefined) {
    return (
      <div className="flex justify-center items-center min-h-[300px] sm:min-h-[400px]">
        <Loader className="scale-125" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto w-full px-2 sm:px-4 md:px-8">
      <Authenticated>
        <Dashboard />
      </Authenticated>
      <Unauthenticated>
        <div className="flex flex-col items-center justify-center min-h-[300px] sm:min-h-[400px] gap-6 sm:gap-8">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-primary mb-3 sm:mb-4">
              Welcome to FairShare
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-secondary mb-6 sm:mb-8">
              Split expenses with friends and keep track of who owes what
            </p>
          </div>
          <div className="w-full max-w-sm sm:max-w-md md:max-w-lg">
            <SignInForm />
          </div>
        </div>
      </Unauthenticated>
    </div>
  );
}
