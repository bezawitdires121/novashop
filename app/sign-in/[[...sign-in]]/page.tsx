import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="min-h-screen bg-[#05050a] flex items-center justify-center pt-20 px-6">
      <SignIn />
    </main>
  );
}