import { NavigationSidebar } from "@/components/navigation/navigation-sidebar";
const MainLayout = async ({
  children
}: {
  children: React.ReactNode;
}) => {
  return ( 
    <div className="h-full flex">
      <div className="w-[72px] shrink-0">
        <NavigationSidebar />
      </div>
      <main className="flex-1 h-full overflow-y-auto">
        {children}
      </main>
    </div>
   );
}
 
export default MainLayout;