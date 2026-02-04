import { LeftSidebar } from "./LeftSidebar";
import { TopNav } from "./TopNav";
import { RightSidebar } from "./RightSidebar";
import { useAppStore } from "@/stores/useAppStore";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-background">
      {/* Left Sidebar */}
      <LeftSidebar />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Navigation */}
        <TopNav />

        {/* Content Area */}
        <main className="flex-1 overflow-hidden">
          <div className="flex h-full">
            {/* Main content */}
            <div className="flex-1 overflow-auto">
              {children}
            </div>

            {/* Right Sidebar */}
            <RightSidebar />
          </div>
        </main>
      </div>
    </div>
  );
}
