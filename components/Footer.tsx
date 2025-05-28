// components/Footer.tsx
import React from 'react';
import Link from 'next/link';
import { UserSearch } from 'lucide-react'; 
import { FaDiscord } from "react-icons/fa6";
const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-mainbg text-neutral-400 pt-12 pb-8"> {/* Cor de fundo similar à imagem (um cinza bem escuro/quase preto) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Linha Separadora Superior */}
        <div className="border-t border-neutral-700 mb-10"></div>

        {/* Seção de Links Principais (Discord, Contato) */}
        <div className="flex flex-col sm:flex-row justify-center items-center gap-10 sm:gap-16 mb-12 text-center">
          <Link href="https://discord.gg/yourserver" legacyBehavior>
            <a
              target="_blank" // Abrir em nova aba para link externo
              rel="noopener noreferrer" // Boas práticas para links externos
              className="flex flex-col items-center group"
            >
              <FaDiscord size={30} className="mb-2 text-neutral-300 group-hover:text-white transition-colors duration-200" />
              <span className="text-sm font-medium group-hover:text-white transition-colors duration-200">
                Official Discord Server
              </span>
            </a>
          </Link>
          <Link href="/contact" legacyBehavior>
            <a className="flex flex-col items-center group">
              <UserSearch size={30} className="mb-2 text-neutral-300 group-hover:text-white transition-colors duration-200" />
              <span className="text-sm font-medium group-hover:text-white transition-colors duration-200">
                Contact
              </span>
            </a>
          </Link>
        </div>

        {/* Seção de Links Inferiores (Termos, Privacidade, Cookies) */}
        <nav className="flex flex-wrap justify-center items-center gap-x-6 sm:gap-x-8 gap-y-2 mb-8 text-xs sm:text-sm">
          <Link href="/terms-and-conditions" legacyBehavior>
            <a className="hover:text-white transition-colors duration-200">Terms and Conditions</a>
          </Link>
          <Link href="/privacy-policy" legacyBehavior>
            <a className="hover:text-white transition-colors duration-200">Privacy Policy</a>
          </Link>
          <Link href="/cookie-policy" legacyBehavior>
            <a className="hover:text-white transition-colors duration-200">Cookie Policy</a>
          </Link>
        </nav>

        {/* Texto de Copyright */}
        <div className="text-center text-xs text-neutral-500">
          <p>
            © {currentYear} BlayyDeveloper - Co-owner of GlitchCode Studio. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;