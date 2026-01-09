import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <SignIn
      appearance={{
        elements: {
          // The container
          card: "!bg-black/70 !backdrop-blur-xl !border !border-white/20 !shadow-2xl !rounded-none",
          
          // Header
          headerTitle: "!text-white !uppercase !tracking-widest !text-2xl",
          headerSubtitle: "!text-zinc-400",
          
          // Primary Button (The "F1 Red" Button)
          formButtonPrimary: "!bg-red-600 hover:!bg-red-700 !rounded-none !uppercase !tracking-tighter !border-none !shadow-[0_0_15px_rgba(220,38,38,0.5)]",
          
          // Input Fields
          formFieldLabel: "!text-zinc-300 !uppercase !text-[10px] !font-bold",
          formFieldInput: "!bg-white/5 !border-white/10 !text-white !rounded-none focus:!ring-red-600 focus:!border-red-600",
          
          // Social Buttons (Google/GitHub)
          socialButtonsBlockButton: "!bg-white/5 !border-white/10 hover:!bg-white/10 !text-white !rounded-none",
          socialButtonsBlockButtonText: "!text-white !font-medium",
          
          // Footer / Branding
          footerActionText: "!text-zinc-400",
          footerActionLink: "!text-red-500 hover:!text-red-400",
          dividerLine: "!bg-white/10",
          dividerText: "!text-zinc-500",
          identityPreviewText: "!text-white",
          formFieldInputShowPasswordButton: "!text-zinc-400"
        },
      }}
    />
  );
}