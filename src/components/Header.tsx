import { CartDrawer } from "./CartDrawer";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { User } from "lucide-react";
import wwjdLogo from "@/assets/wwjd_logo.png";

export const Header = () => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <img 
            src={wwjdLogo} 
            alt="WWJD" 
            className="h-10 w-auto opacity-70 hover:opacity-90 transition-opacity mix-blend-multiply dark:mix-blend-screen"
          />
        </Link>
        
        <nav className="flex items-center gap-6">
          <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
            Home
          </Link>
          <Link to="/shop" className="text-sm font-medium hover:text-primary transition-colors">
            Shop
          </Link>
          {user ? (
            <Link to="/profile" className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2">
              <User className="w-4 h-4" />
              Profile
            </Link>
          ) : (
            <Link to="/auth" className="text-sm font-medium hover:text-primary transition-colors">
              Login
            </Link>
          )}
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
};
