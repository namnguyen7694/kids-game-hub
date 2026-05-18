"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white py-4 shadow-sm sticky top-0 z-[100]">
      <div className="container flex justify-between items-center">
        <Link href="/" className="text-2xl font-extrabold flex items-center gap-2 text-foreground">
          <span className="text-4xl animate-bounce">🎮</span>
          Kids<span className="text-primary">Learn</span>Hub
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="/" className="font-semibold text-foreground transition-colors duration-300 hover:text-primary">Trang chủ</Link>
          <Link href="/games/memory-match" className="font-semibold text-foreground transition-colors duration-300 hover:text-primary">Trò chơi</Link>
          <button className="bg-primary text-white px-6 py-3 rounded-full font-bold transition-all duration-200 shadow-[0_4px_0_#D14D4D] hover:-translate-y-[2px] hover:shadow-[0_6px_0_#D14D4D] active:translate-y-[2px] active:shadow-[0_2px_0_#D14D4D]">Bắt đầu học!</button>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden text-3xl focus:outline-none"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-t border-[#EEE] py-6 px-6 flex flex-col gap-6 shadow-xl animate-slideDown">
          <Link 
            href="/" 
            className="text-lg font-bold text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Trang chủ
          </Link>
          <Link 
            href="/games/memory-match" 
            className="text-lg font-bold text-foreground"
            onClick={() => setIsMenuOpen(false)}
          >
            Trò chơi
          </Link>
          <button className="bg-primary text-white px-6 py-4 rounded-full font-bold shadow-[0_4px_0_#D14D4D]">
            Bắt đầu học!
          </button>
        </div>
      )}
    </nav>
  );
}


