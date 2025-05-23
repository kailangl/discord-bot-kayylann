import React from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import {
  HandHelping,
  GitGraph,
  Info
} from "lucide-react";

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full bg-gray-900 relative z-10 py-4">
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <div className="flex flex-col">
          <h1 className="text-white text-xl font-bold tracking-wide">Drex Colin</h1>
          <span className="text-gray-400 text-sm mt-1">Manage Server</span>
        </div>

        <nav className="flex gap-8">
          <Link href="/help" className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2">
            <HandHelping className="w-4 h-4" />
            <span>Help</span>
          </Link>
          <Link href="/commands" className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2">
            <GitGraph className="w-4 h-4" />
            <span>Commands</span>
          </Link>
          <Link href="/about" className="text-white font-medium hover:text-purple-500 transition-colors flex items-center gap-2">
            <Info className="w-4 h-4" />
            <span>About Us</span>
          </Link>
        </nav>

        {session?.user && (
          <div className="flex items-center gap-2">
            <img
              src={session.user.image || '/default-avatar.png'}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <span className="text-white font-medium">{session.user.name}</span>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-500 to-blue-500 rounded-b-md"></div>
    </header>
  );
};

export default Header;