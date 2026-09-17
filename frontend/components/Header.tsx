"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { useLanguage } from "@/lib/language-context";
import { Shield, Menu, X, Moon, Sun, Globe } from "lucide-react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Shield className="w-7 h-7 text-[#1a2a3a] dark:text-white" />
            <div>
              <span className="text-[#1a2a3a] dark:text-white font-bold text-lg">
                Prison Visitor
              </span>
              <span className="hidden sm:block text-xs text-gray-500 dark:text-gray-400">
                Rwanda Correctional Service
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-6">
            <button
              onClick={() => scrollToSection("home")}
              className="text-gray-700 dark:text-gray-300 hover:text-[#1a2a3a] dark:hover:text-white font-medium text-sm"
            >
              {t("home")}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="text-gray-700 dark:text-gray-300 hover:text-[#1a2a3a] dark:hover:text-white font-medium text-sm"
            >
              {t("about")}
            </button>
            <button
              onClick={() => scrollToSection("how")}
              className="text-gray-700 dark:text-gray-300 hover:text-[#1a2a3a] dark:hover:text-white font-medium text-sm"
            >
              {t("howItWorks")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="text-gray-700 dark:text-gray-300 hover:text-[#1a2a3a] dark:hover:text-white font-medium text-sm"
            >
              {t("services")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="text-gray-700 dark:text-gray-300 hover:text-[#1a2a3a] dark:hover:text-white font-medium text-sm"
            >
              {t("contact")}
            </button>
          </nav>

          {/* Right side - Theme + Language + Auth */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}

            {/* Language Toggle */}
            <button
              onClick={() => setLanguage(language === "en" ? "rw" : "en")}
              className="flex items-center gap-1 px-3 py-2 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 text-sm font-medium"
              aria-label="Toggle language"
            >
              <Globe size={16} />
              {language === "en" ? "RW" : "EN"}
            </button>

            {/* Auth Buttons */}
            <Link
              href="/login"
              className="text-[#1a2a3a] dark:text-white border border-[#1a2a3a] dark:border-white px-5 py-2 rounded-md font-medium text-sm hover:bg-[#1a2a3a] dark:hover:bg-white hover:text-white dark:hover:text-[#1a2a3a] transition"
            >
              {t("login")}
            </Link>
            <Link
              href="/signup"
              className="bg-[#1a2a3a] dark:bg-white text-white dark:text-[#1a2a3a] px-5 py-2 rounded-md font-medium text-sm hover:bg-[#243b4f] dark:hover:bg-gray-200 transition"
            >
              {t("register")}
            </Link>
          </div>

          {/* Mobile right side - Theme + Language + Hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            {mounted && (
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
              </button>
            )}
            <button
              onClick={() => setLanguage(language === "en" ? "rw" : "en")}
              className="p-2 rounded-md text-gray-700 dark:text-gray-300 text-xs font-bold"
              aria-label="Toggle language"
            >
              {language === "en" ? "RW" : "EN"}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-[#1a2a3a] dark:text-white p-2"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <nav className="px-4 py-4 space-y-2">
            <button
              onClick={() => scrollToSection("home")}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {t("home")}
            </button>
            <button
              onClick={() => scrollToSection("about")}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {t("about")}
            </button>
            <button
              onClick={() => scrollToSection("how")}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {t("howItWorks")}
            </button>
            <button
              onClick={() => scrollToSection("services")}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {t("services")}
            </button>
            <button
              onClick={() => scrollToSection("contact")}
              className="block w-full text-left px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md"
            >
              {t("contact")}
            </button>
            <div className="pt-2 space-y-2">
              <Link
                href="/login"
                className="block w-full text-center border border-[#1a2a3a] dark:border-white text-[#1a2a3a] dark:text-white px-4 py-2 rounded-md font-medium"
              >
                {t("login")}
              </Link>
              <Link
                href="/signup"
                className="block w-full text-center bg-[#1a2a3a] dark:bg-white text-white dark:text-[#1a2a3a] px-4 py-2 rounded-md font-medium"
              >
                {t("register")}
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}