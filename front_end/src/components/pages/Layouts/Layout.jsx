import { Outlet } from "react-router-dom";
import Header from "./Header";
import AppSidebar from "./AppSidebar";
import Footer from "./Footer";
import { useEffect, useState } from "react";

export default function Layout() {
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) setCollapsed(true); // auto-collapse on mobile
    };
    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const sidebarWidth = collapsed ? 80 : 250;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Header */}
      <Header
        sidebarWidth={isMobile ? 0 : sidebarWidth}
        onToggleSidebar={() => setCollapsed(c => !c)}
      />

      {/* Sidebar */}
      <AppSidebar
        collapsed={collapsed}
        isMobile={isMobile}
        onToggle={() => setCollapsed(c => !c)}
      />

      {/* Main content */}
      <div
        className={`pt-16 pb-12 transition-all duration-300`}
        style={{ paddingLeft: isMobile ? 0 : sidebarWidth }}
      >
        <main className="min-h-[calc(100vh-4rem-3rem)] overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="grid gap-6 lg:grid-cols-3">
            <section className="lg:col-span-3 rounded-2xl bg-white/70 dark:bg-gray-800/70 backdrop-blur-md border border-white/30 dark:border-gray-700/30 shadow-sm p-6 transition-colors duration-300">
              <Outlet />
            </section>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}
