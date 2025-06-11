import React from "react";
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
} from "lucide-react";

const Header = () => {
  const { data: session } = useSession();
  const router = useRouter(); 

  const navItems = [
    { href: "/", label: "Home", icon: <HomeIcon className="w-4 h-4" /> },
    { href: "/help", label: "Help", icon: <HandHelping className="w-4 h-4" /> },
    { href: "/commands", label: "Commands", icon: <GitGraph className="w-4 h-4" /> },
    { href: "/about", label: "About Us", icon: <Info className="w-4 h-4" /> },
  ];

  const userActionClasses =
    "text-gray-300 hover:text-white hover:text-gradient-to-r transition-all duration-200 flex items-center gap-2 py-2 px-3 rounded-lg text-sm";

  return (
    <header className="w-full bg-vsfbg relative z-10 py-4 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl flex items-center gap-2 shrink-0">
          <img
            src="/logo.png"
            alt="Kayylann Logo"
            className="w-9 h-9" 
          />
          Kayylann
          <span className="text-gray-400 font-normal text-sm sm:text-base tracking-wider">
            BOT/AI
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-3 lg:gap-4"> 
          {navItems.map((item) => {
            const isActive = router.pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`
                  font-medium transition-all duration-200 ease-in-out
                  flex items-center gap-1.5 sm:gap-2 py-2 px-3 sm:px-4 rounded-lg text-sm
                  ${isActive
                    ? "bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-md scale-105" 
                    : "text-gray-300 hover:text-white hover:bg-white/10 focus:bg-white/10 focus:text-white outline-none"
                  }
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

       
        <div className="flex items-center gap-2 sm:gap-3">
          {session?.user ? (
            <>
              <div className="hidden sm:flex items-center gap-2"> 
                <img
                  src={session.user.image || "/default-avatar.png"}
                  alt="User Avatar"
                  className="w-8 h-8 rounded-full object-cover border-2 border-purple-500/50"
                />
                <span className="text-white font-medium text-sm">{session.user.name}</span>
              </div>
              <Link
                href="/dashboard/servers"
                className={userActionClasses}
                title="Dashboard"
              >
                <LayoutDashboard className="w-4 h-4 sm:w-5 sm:h-5" />
                <span className="hidden sm:inline">Dashboard</span> 
              </Link>
              <button
                onClick={() => signOut()}
                className={`${userActionClasses} hover:bg-red-500/40`}
                title="Logout"
              >
                <LogOut className="w-4 h-4 sm:w-5 sm:h-5" />
                 <span className="hidden sm:inline">Logout</span> 
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn()}
              className="text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-500 hover:to-blue-400 shadow-lg hover:shadow-purple-500/30 text-sm"
            >
              <LogIn className="w-5 h-5" />
              Sign In to see all features
            </button>
          )}
        </div>
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#B123F3] to-[#2684FF] opacity-80" 
      ></div>
    </header>
  );
};

export default Header;