import BottomNav from "./BottomNav ";
import WardrobeTopNav from "./WardrobeTopNav";
import PageTransition from "./PageTransition";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="anim-slide-up-card bg-white flex-1 flex flex-col rounded-t-3xl mt-2 overflow-hidden">
      <WardrobeTopNav />
      <div
        id="ZoneScroll"
        className="flex-1 overflow-y-auto p-2 pt-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        <PageTransition>
          {children}
        </PageTransition>
      </div>
      <div className="shrink-0">
        <BottomNav />
      </div>
    </div>
  );
}
