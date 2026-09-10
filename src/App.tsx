import React, { useState, useEffect } from "react";
import { Navbar } from "./components/Navbar";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AuthModal } from "./components/AuthModal";
import { AuthUser } from "./types";
import { ThemeLanguageProvider, useThemeLanguage } from "./context/ThemeLanguageContext";

function MainApp() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const { t } = useThemeLanguage();

  // Check auth status on load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (res.ok) {
          const data = await res.json();
          if (data.isAuthenticated && data.user) {
            setUser(data.user);
          } else {
            setUser(null);
          }
        }
      } catch (err) {
        console.error("Auth check failed:", err);
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkAuth();
  }, []);

  // Handle Logout
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      setActiveTab("content");
    } catch (err) {
      console.error("Logout failed:", err);
      setUser(null);
    }
  };

  // Handle successful login
  const handleLoginSuccess = (authenticatedUser: AuthUser) => {
    setUser(authenticatedUser);
    setIsAuthModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 font-sans flex flex-col antialiased transition-colors duration-200">
      {/* Navbar */}
      <Navbar
        user={user}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        isDashboard={Boolean(user)}
      />

      {/* Main Content Area */}
      {isCheckingAuth ? (
        <div className="flex-1 flex items-center justify-center p-12">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-3 border-amber-500/20 border-t-amber-600 rounded-full animate-spin" />
            <span className="text-xs font-medium text-stone-500 dark:text-stone-400">
              {t("checkingAuth")}
            </span>
          </div>
        </div>
      ) : user ? (
        /* Halaman Dashboard (Tampilan Pasca-Login) */
        <Dashboard
          user={user}
          activeTab={activeTab}
          onSelectTab={setActiveTab}
        />
      ) : (
        /* Halaman Landing Page (Tampilan Pra-Login) */
        <LandingPage onOpenAuth={() => setIsAuthModalOpen(true)} />
      )}

      {/* Google OAuth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccess={handleLoginSuccess}
      />
    </div>
  );
}

export default function App() {
  return (
    <ThemeLanguageProvider>
      <MainApp />
    </ThemeLanguageProvider>
  );
}
