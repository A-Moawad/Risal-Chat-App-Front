import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import HomePage from "./pages/HomePage";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <main className="w-full h-full px-4">
      {isAuthenticated ? <HomePage /> : <LoginPage />}
    </main>
  );
}
