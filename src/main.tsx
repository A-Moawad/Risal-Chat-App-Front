import { ClerkProvider, useAuth } from "@clerk/clerk-react";
import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { Toaster } from "@/components/ui/sonner";

const convex = new ConvexReactClient(import.meta.env.VITE_CONVEX_URL);
ReactDOM.createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ClerkProvider publishableKey={import.meta.env.VITE_CLERK_PUBLISHABLE_KEY}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        <App />
        <Toaster
          position="top-right"
          theme="light"
          toastOptions={{
            classNames: {
              error: "bg-red-600 text-white font-bold px-6 py-3 shadow-md ",
              success: "bg-green-500 text-white font-semibold px-6 py-3 shadow-md",
            },
          }}
        />
      </ConvexProviderWithClerk>
    </ClerkProvider>
  </StrictMode>
);
