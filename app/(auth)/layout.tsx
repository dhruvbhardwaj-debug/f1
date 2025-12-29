import { Oswald } from "next/font/google";

// Initialize Oswald font
const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "700"], // 700 gives it that bold F1 look
});

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div 
      className={`bg-red-400 ${oswald.className} flex min-h-screen w-full items-center justify-center`}
    >
      {children}
    </div>
  );
};

export default AuthLayout;

