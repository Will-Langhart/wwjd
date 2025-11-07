import { CartDrawer } from "./CartDrawer";
import { Link } from "react-router-dom";
import wwjdLogo from "@/assets/wwjd_logo.png";

export const Header = () => {
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
          <CartDrawer />
        </nav>
      </div>
    </header>
  );
};
