import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import HomePage from "./pages/HomePage";
import { SignOutButton } from "@clerk/clerk-react";
import { Button } from "./components/ui/button";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();

  return (
    <main className="w-full h-full px-4">
      {/* {isLoading ? (
        <div>Loading...</div>
      ) : isAuthenticated ? (
        <>
            <HomePage />
            
          <SignOutButton className="bg-sky-600 py-1 text-center text-white rounded-md mx-auto" />
        </>
      ) : (
        <LoginPage />
      )} */}
      <LoginPage />
      <HomePage />
      <Button className="bg-sky-600 py-1 text-center text-white rounded-md mx-auto">
        <SignOutButton />
      </Button>
    </main>
  );
}
