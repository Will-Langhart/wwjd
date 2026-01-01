import { CartDrawer } from "./CartDrawer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/integrations/supabase/safeClient";
import { User } from "lucide-react";
import wwjdLogo from "@/assets/wwjd_logo.png";
import { Button } from "@/components/ui/button";

export const Header = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initAuth = async () => {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase || !isMounted) return;

        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;
        setUser(session?.user ?? null);

        const { data } = supabase.auth.onAuthStateChange((_event, session) => {
          if (!isMounted) return;
          setUser(session?.user ?? null);
        });
        subscription = data.subscription;
      } catch (error) {
        console.error("Failed to initialize auth header:", error);
      }
    };

    initAuth();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  const NavLinks = ({ onClick }: { onClick?: () => void }) => (
    <>
      <Link 
        to="/" 
        className="text-base font-medium hover:text-primary transition-colors py-2"
        onClick={onClick}
      >
        Home
      </Link>
      <Link 
        to="/shop" 
        className="text-base font-medium hover:text-primary transition-colors py-2"
        onClick={onClick}
      >
        Shop
      </Link>
      {user ? (
        <Link 
          to="/profile" 
          className="text-base font-medium hover:text-primary transition-colors flex items-center gap-2 py-2"
          onClick={onClick}
        >
          <User className="w-4 h-4" />
          Profile
        </Link>
      ) : (
        <Link 
          to="/auth" 
          className="text-base font-medium hover:text-primary transition-colors py-2"
          onClick={onClick}
        >
          Login
        </Link>
      )}
    </>
  );

  return (
    <header className="fixed top-0 inset-x-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img
            src={wwjdLogo}
            alt="WWJD Logo"
            className="h-10 w-auto hover:opacity-80 transition-opacity dark:invert"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
          <CartDrawer />
        </nav>

        {/* Mobile Navigation */}
        <div className="flex md:hidden items-center gap-2">
          <CartDrawer />
          <Link to={user ? "/profile" : "/auth"} aria-label={user ? "Profile" : "Login"}>
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <User className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};