import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Risal Chat
      </h1>
      <Button className="bg-sky-600 py-2 text-white rounded-md max-w-xs mx-auto hover:bg-sky-700 transition">
        <SignInButton />
      </Button>
    </div>
  );
}
