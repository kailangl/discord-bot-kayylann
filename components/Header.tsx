import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import {
  HandHelping,
  GitGraph,
  Info,
  LogOut,
  LayoutDashboard,
  LogIn,
} from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  const navLinkClasses =
    "text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2";
  const userActionClasses =
    "text-white hover:text-purple-500 hover:bg-white/10 transition-all duration-200 flex items-center gap-2 py-1.5 px-3 rounded-md";

  return (
    <header className="w-full bg-vsfbg relative z-10 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link href="/" className="text-white font-bold text-xl flex items-center gap-2">
          <img
            src="/logo.png" 
            alt="Logo"
            className="w-8 h-8"
          />
          Kayylann
          <span className="text-gray-300 font-medium ">BOT</span>
         <p className="text-gray-400 font-medium">V0.5</p>
        </Link>
         
        <nav className="flex gap-8">
          <Link href="/help" className={navLinkClasses}>
            <HandHelping className="w-4 h-4" />
            <span>Help</span>
          </Link>
          <Link href="/commands" className={navLinkClasses}>
            <GitGraph className="w-4 h-4" />
            <span>Commands</span>
          </Link>
          <Link href="/about" className={navLinkClasses}>
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </Link>
        </nav>

        {session?.user ? (
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <img
                src={session.user.image || "/default-avatar.png"}
                alt="User Avatar"
                className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-purple-500"
              />
              <span className="text-white font-medium">{session.user.name}</span>
            </div>
            <Link
              href="/dashboard/servers"
              className={userActionClasses}
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" />
              <span>Manage Server</span>
            </Link>
            <button
              onClick={() => signOut()}
              className={userActionClasses}
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all duration-200 bg-gradient-to-r from-[#B123F3] to-[#2684FF] shadow-[0_2px_4px_rgba(0,0,0,0.2)] hover:opacity-95 hover:shadow-lg"
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        )}
      </div>

      <div
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md bg-gradient-to-r from-[#B123F3] to-[#2684FF]"
      ></div>
    </header>
  );
};

export default Header;