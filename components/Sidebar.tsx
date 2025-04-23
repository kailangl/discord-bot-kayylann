"use client"; 

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const menuItems = [
    { href: "/", icon: "🏠", label: "Início" },
    { href: "/commands", icon: "⌨️", label: "Comandos" },
    { href: "/settings", icon: "⚙️", label: "Configurações" },
    { href: "/stats", icon: "📊", label: "Estatísticas" },
    { href: "/logs", icon: "📝", label: "Logs" },
  ];

  return (
    <div className="fixed h-screen w-64 bg-gray-800 text-white p-4 flex flex-col">
      <div className="mb-8 p-4">
        <h1 className="text-2xl font-bold">Meu Bot</h1>
        <p className="text-gray-400 text-sm">Painel de controle</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  pathname === item.href
                    ? "bg-blue-600"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="mr-3 text-xl">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto p-4 border-t border-gray-700">
        <div className="flex items-center">
          <div className="bg-gray-600 rounded-full w-10 h-10 flex items-center justify-center">
            <span>👤</span>
          </div>
          <div className="ml-3">
            <p className="font-medium">Usuário</p>
            <p className="text-gray-400 text-sm">admin</p>
          </div>
        </div>
      </div>
    </div>
  );
}