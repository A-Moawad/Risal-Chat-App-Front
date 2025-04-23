import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import HomePage from "./pages/HomePage";
import Loading from "./helper/Loading";
import { ChatProvider } from "@/contexts/chatContext";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <main className="w-full h-full md:px-4">
      {isAuthenticated ? (
        <ChatProvider>
          <HomePage />
        </ChatProvider>
      ) : (
        <LoginPage />
      )}
    </main>
  );
}
