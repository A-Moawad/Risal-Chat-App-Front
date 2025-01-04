import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import HomePage from "./pages/HomePage";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();
  return (
    <main className="w-[100%]  px-4">
      {isLoading ? (
        <>Loading...</>
      ) : isAuthenticated ? (
        <HomePage />
      ) : (
        <LoginPage />
      )}
    </main>
  );
}


