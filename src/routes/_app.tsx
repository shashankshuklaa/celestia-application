import { createFileRoute, Outlet } from "@tanstack/react-router";
import { CosmicBackground } from "@/components/cosmic-bg";
import { BottomNav } from "@/components/bottom-nav";
import { PageTransition } from "@/components/page-transition";

export const Route = createFileRoute("/_app")({
  component: AppLayout,
});

function AppLayout() {
  return (
    <div className="relative min-h-[100dvh]">
      <CosmicBackground />
      <div className="mx-auto max-w-md px-5 pt-10 pb-32">
        <PageTransition>
          <Outlet />
        </PageTransition>
      </div>
      <BottomNav />
    </div>
  );
}