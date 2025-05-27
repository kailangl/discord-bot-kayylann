import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { HandHelping, GitGraph, Info, LogOut, LayoutDashboard, LogIn } from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-vsfbg relative z-10 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <nav className="flex gap-8">
          <Link
            href="/help"
            className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2"
          >
            <HandHelping className="w-4 h-4" />
            <span>Help</span>
          </Link>
          <Link
            href="/commands"
            className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2"
          >
            <GitGraph className="w-4 h-4" />
            <span>Commands</span>
          </Link>
          <Link
            href="/about"
            className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2"
          >
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
                className="w-8 h-8 rounded-full object-cover"
              />
              <span className="text-white font-medium">{session.user.name}</span>
            </div>
            <Link
              href="/dashboard/servers"
              className="text-white hover:text-purple-500 transition-colors flex items-center gap-1"
              title="Dashboard"
            >
              <LayoutDashboard className="w-5 h-5" /> Manage Server
            </Link>
            <button
              onClick={() => signOut()}
              className="text-white hover:text-purple-500 transition-colors flex items-center gap-1"
              title="Logout"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => signIn()}
            className="text-white font-medium py-2 px-4 rounded-lg flex items-center gap-2 transition-all"
            style={{
              background: 'linear-gradient(to right, #B123F3, #2684FF)',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
            }}
          >
            <LogIn className="w-5 h-5" />
            Sign In
          </button>
        )}
      </div>

      <div 
        className="absolute bottom-0 left-0 right-0 h-1 rounded-b-md"
        style={{
          background: 'linear-gradient(to right, #B123F3, #2684FF)'
        }}
      ></div>
    </header>
  );
};

export default Header;