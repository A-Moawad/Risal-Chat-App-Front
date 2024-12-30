import { SignInButton } from "@clerk/clerk-react";
import { Button } from "@/components/ui/button";


export default function LoginPage() {
  return (
    <div className="flex flex-col justify-center">
      <h1>Risal Chat</h1>
      <Button className="bg-sky-600  py-1 text-center text-white rounded-md max-w-24 mx-auto">
        <SignInButton />
      </Button>
    </div>
  );
}
