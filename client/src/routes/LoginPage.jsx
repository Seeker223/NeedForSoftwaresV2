import { SignIn } from "@clerk/clerk-react";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 shadow-card">
        <SignIn signUpUrl="/register" />
      </div>
    </div>
  );
};

export default LoginPage;
