import { createRoot } from "react-dom/client";
import { ConvexAuthProvider } from "@convex-dev/auth/react";
import { ConvexReactClient } from "convex/react";
import "./index.css";
import App from "./App";
// import { ThemeProvider } from "./components/theme-provider";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL as string);

createRoot(document.getElementById("root")!).render(
  // <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
  <ConvexAuthProvider client={convex}>
    <App />
  </ConvexAuthProvider>
  // </ThemeProvider>
);
