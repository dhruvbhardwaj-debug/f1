import { Oswald } from "next/font/google";
import Image from "next/image";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["300", "700"],
});

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    // We add 'relative' so the background image can pin itself to this container
    <div className={`${oswald.className} relative flex min-h-screen w-full items-center justify-center overflow-hidden`}>
      
      {/* Background Image Container */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/wallpaperflare.com_wallpaper.jpg" // Put your image in the /public folder
          alt="Background"
          fill
          priority
          quality={80}
          className="object-cover brightness-[0.4]" // Lower brightness helps text stand out
        />
      </div>

      {/* Content Layer */}
      <main className="relative z-10 w-full max-w-md px-4">
        {children}
      </main>
    </div>
  );
};

export default AuthLayout;