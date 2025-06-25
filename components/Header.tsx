
import React, { useState } from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import {
  HandHelping,
  GitGraph,
  Info,
  LogOut,
  LayoutDashboard,
  LogIn,
  Home as HomeIcon,
  Menu,
  X,
} from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
    { href: "/help", label: "Help", icon: <HandHelping className="w-4 h-4" /> },
    { href: "/commands", label: "Commands", icon: <GitGraph className="w-4 h-4" /> },
    { href: "/about", label: "About Us", icon: <Info className="w-4 h-4" /> },
  ];

  const userActionClasses =
    "text-gray-300 hover:text-white transition-all duration-200 flex items-center gap-2 py-2 px-3 rounded-lg text-sm";

  const renderNavLinks = (isMobile = false) =>
    navItems.map((item) => {
      const isActive = router.pathname === item.href;

      const getLinkClasses = () => {
        const baseClasses = "font-semibold transition-colors duration-300 ease-in-out flex items-center gap-1.5 sm:gap-2 py-2 px-3 text-sm";

        if (isMobile) {
          const mobileActiveClasses = "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md";
          const mobileInactiveClasses = "text-gray-300 hover:text-white hover:bg-white/10";
          return `${baseClasses} rounded-lg w-full ${isActive ? mobileActiveClasses : mobileInactiveClasses}`;
        } else {
          const desktopActiveClasses = "text-white";
          const desktopInactiveClasses = "text-gray-300 hover:text-white";
          return `${baseClasses} ${isActive ? desktopActiveClasses : desktopInactiveClasses}`;
        }
      };

      const getLabelClasses = () => {
        if (!isMobile && isActive) {
          return "bg-gradient-to-r from-purple-500 to-blue-500 bg-clip-text text-transparent";
        }
        return "";
      };

      return (
        <Link
          key={item.href}
          href={item.href}
          onClick={() => isMenuOpen && setIsMenuOpen(false)}
          className={getLinkClasses()}
        >
          {item.icon}
          <span className={getLabelClasses()}>{item.label}</span>
        </Link>
      );
    });

  return (
    <header className="w-full bg-vsfbg relative z-20 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="text-white font-bold text-xl flex items-center gap-2 shrink-0">
            <img
              src="/logo.png"
              alt="Kayy Logo 1"
              className="w-9 h-9 rounded-full object-cover shadow-md"
            />
            Kayy
            <span className="text-gray-400 font-normal text-sm sm:text-base tracking-wider">
              BOT/AI
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-3 lg:gap-4">
            {renderNavLinks()}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3">
            {session?.user ? (
              <div className="hidden md:flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-2">
                  <img
                    src={session.user.image || "/default-avatar.png"}
                    alt="User Avatar"
                    className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50"
                  />
                  <span className="text-white font-medium text-sm">{session.user.name}</span>
                </div>
                <Link href="/dashboard/servers" className={userActionClasses} title="Dashboard">
                  <LayoutDashboard className="w-5 h-5" />
                  <span className="hidden sm:inline">Dashboard</span>
                </Link>
                <button
                  onClick={() => signOut()}
                  className={`${userActionClasses} hover:bg-red-500/40`}
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </div>
            ) : (
              <div className="hidden md:block">
                <button
                  onClick={() => signIn()}
                  className="text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg hover:shadow-purple-500/30 text-sm"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              </div>
            )}

            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/10 focus:outline-none"
                aria-controls="mobile-menu"
                aria-expanded={isMenuOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <X className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Menu className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <nav className="md:hidden" id="mobile-menu">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {renderNavLinks(true)}

            {session?.user ? (
              <>
                <div className="border-t border-white/10 my-3"></div>
                <Link
                  href="/dashboard/servers"
                  onClick={() => setIsMenuOpen(false)}
                  className={`${userActionClasses} w-full`}
                >
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                  className={`${userActionClasses} w-full justify-start hover:bg-red-500/40`}
                >
                  <LogOut className="w-5 h-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
               <>
                <div className="border-t border-white/10 my-3"></div>
                <button
                  onClick={() => {
                    signIn();
                    setIsMenuOpen(false);
                  }}
                  className="w-full text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg text-sm"
                >
                  <LogIn className="w-5 h-5" />
                  Sign In
                </button>
              </>
            )}
          </div>
        </nav>
      )}

      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B123F3] to-[#2684FF] opacity-80"></div>
    </header>
  );
};

export default Header;
