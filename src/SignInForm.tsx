"use client";
import { useAuthActions } from "@convex-dev/auth/react";
import { useState } from "react";
import { toast } from "sonner";

export function SignInForm() {
  const { signIn } = useAuthActions();
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn");
  const [submitting, setSubmitting] = useState(false);

  return (
    <div className="flex items-center justify-center bg-gray-50 py-6 px-2 sm:px-4 md:px-8">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white p-6 sm:p-8 rounded-2xl shadow-xl border border-gray-100 mx-auto">
        <div className="flex flex-col items-center mb-2">
          <span className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-primary mb-2">
            FairShare
          </span>
          <h2 className="mt-2 text-center text-lg sm:text-xl md:text-xl font-bold text-gray-900">
            {flow === "signIn"
              ? "Sign in to your account"
              : "Create your account"}
          </h2>
        </div>
        <form
          className="flex flex-col gap-4 sm:gap-5"
          onSubmit={(e) => {
            e.preventDefault();
            setSubmitting(true);
            const formData = new FormData(e.target as HTMLFormElement);
            formData.set("flow", flow);
            void signIn("password", formData).catch((error) => {
              let toastTitle = "";
              if (error.message.includes("Invalid password")) {
                toastTitle = "Invalid password. Please try again.";
              } else {
                toastTitle =
                  flow === "signIn"
                    ? "Could not sign in, did you mean to sign up?"
                    : "Could not sign up, did you mean to sign in?";
              }
              toast.error(toastTitle);
              setSubmitting(false);
            });
          }}
        >
          <input
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition placeholder-gray-400  bg-gray-50 text-sm sm:text-base"
            type="email"
            name="email"
            placeholder="Email"
            required
            autoComplete="email"
            disabled={submitting}
          />
          <input
            className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition placeholder-gray-400 bg-gray-50 text-sm sm:text-base"
            type="password"
            name="password"
            placeholder="Password"
            required
            autoComplete={
              flow === "signIn" ? "current-password" : "new-password"
            }
            disabled={submitting}
          />
          <button
            className="w-full py-3 rounded-lg bg-primary text-white font-semibold text-base sm:text-lg shadow hover:bg-primary-hover transition disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            type="submit"
            disabled={submitting}
          >
            {submitting
              ? flow === "signIn"
                ? "Signing in..."
                : "Signing up..."
              : flow === "signIn"
                ? "Sign in"
                : "Sign up"}
          </button>
          <div className="text-center text-xs sm:text-sm text-secondary mt-2">
            <span>
              {flow === "signIn"
                ? "Don't have an account? "
                : "Already have an account? "}
            </span>
            <button
              type="button"
              className="text-primary hover:text-primary-hover hover:underline font-medium cursor-pointer ml-1"
              onClick={() => setFlow(flow === "signIn" ? "signUp" : "signIn")}
              disabled={submitting}
            >
              {flow === "signIn" ? "Sign up instead" : "Sign in instead"}
            </button>
          </div>
        </form>
        <div className="flex items-center my-4 sm:my-6">
          <hr className="flex-grow border-gray-200" />
          <span className="mx-2 sm:mx-4 text-secondary text-xs sm:text-sm">
            or
          </span>
          <hr className="flex-grow border-gray-200" />
        </div>
        <button
          className="w-full py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold text-base sm:text-lg shadow-sm hover:bg-gray-50 transition flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
          onClick={() => void signIn("google")}
          disabled={submitting}
          type="button"
        >
          <svg
            className="w-5 h-5"
            viewBox="0 0 48 48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g clipPath="url(#clip0_17_40)">
              <path
                d="M47.5 24.5C47.5 22.8 47.3 21.2 47 19.7H24V28.3H37.2C36.6 31.2 34.7 33.6 32 35.1V40.1H39.6C44.1 36.1 47.5 30.8 47.5 24.5Z"
                fill="#4285F4"
              />
              <path
                d="M24 48C30.5 48 35.9 45.9 39.6 40.1L32 35.1C30.1 36.3 27.7 37 24 37C18.7 37 14.1 33.4 12.5 28.9H4.7V34.1C8.4 41.1 15.6 48 24 48Z"
                fill="#34A853"
              />
              <path
                d="M12.5 28.9C12.1 27.7 11.9 26.4 11.9 25C11.9 23.6 12.1 22.3 12.5 21.1V15.9H4.7C3.1 19.1 2 22.9 2 26.9C2 30.9 3.1 34.7 4.7 37.9L12.5 28.9Z"
                fill="#FBBC05"
              />
              <path
                d="M24 13.1C27.1 13.1 29.7 14.2 31.6 16.1L39.7 8C35.9 4.5 30.5 2 24 2C15.6 2 8.4 8.9 4.7 15.9L12.5 21.1C14.1 16.6 18.7 13.1 24 13.1Z"
                fill="#EA4335"
              />
            </g>
            <defs>
              <clipPath id="clip0_17_40">
                <rect width="48" height="48" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <span className="text-sm sm:text-base">Sign in with Google</span>
        </button>
      </div>
    </div>
  );
}
