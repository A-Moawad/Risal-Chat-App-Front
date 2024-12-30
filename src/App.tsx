import { SignOutButton } from "@clerk/clerk-react";
import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { Button } from "./components/ui/button";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();
  return (
    <main>
      {isLoading ? (
        <>Loading...</>
      ) : isAuthenticated ? (
        <Content />
        ) : (
            
        <LoginPage />
      )}
    </main>
  );
}

function Content() {
  return (
    <main>
      <h1>Risal chat</h1>

      <Button className="max-w-24">
        <SignOutButton  />
      </Button>
    </main>
  );
}
