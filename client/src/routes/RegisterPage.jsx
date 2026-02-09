import { SignUp } from "@clerk/clerk-react";

const RegisterPage = () => {
  return (
    <div className="flex items-center justify-center h-[calc(100vh-80px)]">
      <div className="bg-white/80 border border-slate-200/70 rounded-3xl p-6 shadow-card">
        <SignUp signInUrl="/login" />
      </div>
    </div>
  );
};

export default RegisterPage;
