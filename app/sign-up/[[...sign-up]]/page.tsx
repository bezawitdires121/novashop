import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="min-h-screen bg-[#05050a] flex items-center justify-center pt-20 px-6">
      <SignUp />
    </main>
  );
}