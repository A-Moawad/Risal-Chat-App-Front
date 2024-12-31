import { SignOutButton } from "@clerk/clerk-react";
import LoginPage from "./pages/LoginPage";
import { useCurrentUser } from "./hooks/useCurrentUser";
import { Button } from "./components/ui/button";
import MobileNav from "./components/MobileNav";
import logo from "./assets/images/logo.svg";

export default function App() {
  const { isLoading, isAuthenticated } = useCurrentUser();
  return (
    <main className="containe">
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
    <main className="flex-col flex justify-center ">
      <h1 className="flex flex-col">
        <img src={logo} alt="Logo" width={50}  height={50}/>
        <span className="text-gray-600">Welcome, User!</span>
      </h1>

      <Button className="max-w-24 m-auto bg-blue-500">
        <SignOutButton />
      </Button>
      <MobileNav />
    </main>
  );
}
