import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignUp
      appearance={{
        elements: {
          // The container (Glassmorphism + Sharp Edges)
          card: "!bg-black/70 !backdrop-blur-xl !border !border-white/20 !shadow-2xl !rounded-none",
          
          // Header
          headerTitle: "!text-white !uppercase !tracking-widest !text-2xl",
          headerSubtitle: "!text-zinc-400",
          
          // Primary Button (F1 Racing Red)
          formButtonPrimary: "!bg-red-600 hover:!bg-red-700 !rounded-none !uppercase !tracking-tighter !border-none !shadow-[0_0_15px_rgba(220,38,38,0.5)] !transition-all !duration-300",
          
          // Input Fields (Transparent Dark)
          formFieldLabel: "!text-zinc-300 !uppercase !text-[10px] !font-bold",
          formFieldInput: "!bg-white/5 !border-white/10 !text-white !rounded-none focus:!ring-red-600 focus:!border-red-600 !transition-all",
          
          // Social Buttons (Google/GitHub)
          socialButtonsBlockButton: "!bg-white/5 !border-white/10 hover:!bg-white/10 !text-white !rounded-none !transition-colors",
          socialButtonsBlockButtonText: "!text-white !font-medium",
          
          // Footer / Branding Links
          footerActionText: "!text-zinc-400",
          footerActionLink: "!text-red-500 hover:!text-red-400",
          
          // Divider
          dividerLine: "!bg-white/10",
          dividerText: "!text-zinc-500",
          
          // Misc Elements
          identityPreviewText: "!text-white",
          formFieldInputShowPasswordButton: "!text-zinc-400",
          scrollBox: "!rounded-none", // Ensures no rounded scroll areas
        },
      }}
    />
  );
}