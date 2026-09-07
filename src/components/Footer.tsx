import { Link } from "react-router-dom";
import { Facebook, Instagram, Twitter, Mail } from "lucide-react";
import { OrnamentRule } from "@/components/marks";
import wwjdLogo from "@/assets/wwjd_logo.png";

export const Footer = () => {
  return (
    <footer className="ground-parchment border-t border-foreground/10 mt-auto">
      <div className="container py-14 px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-4 col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <img src={wwjdLogo} alt="" width={1024} height={1024} className="h-7 w-auto dark:invert" />
              <h3 className="font-heading text-sm font-semibold tracking-inscription">
                THE NARROW PATH
              </h3>
            </div>
            <p className="font-serif text-sm text-muted-foreground italic leading-relaxed">
              &ldquo;Strait is the gate, and narrow is the way, which leadeth unto life,
              and few there be that find it.&rdquo;
            </p>
            <p className="label-caps !text-[0.65rem]">Matthew 7:14 · KJV</p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="label-caps">Explore</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/auth" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/profile" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies */}
          <div className="space-y-3">
            <h4 className="label-caps">Help &amp; Info</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="/policies/refund-policy" target="_blank" rel="noopener noreferrer" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Return & Refund Policy
                </a>
              </li>
              <li>
                <a href="/policies/privacy-policy" target="_blank" rel="noopener noreferrer" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="/policies/terms-of-service" target="_blank" rel="noopener noreferrer" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="/policies/shipping-policy" target="_blank" rel="noopener noreferrer" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Shipping
                </a>
              </li>
              <li>
                <a href="/pages/contact" target="_blank" rel="noopener noreferrer" className="font-serif text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-3">
            <h4 className="label-caps">Follow</h4>
            <div className="flex gap-3">
              <a 
                href="#" 
                className="font-serif text-muted-foreground hover:text-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="font-serif text-muted-foreground hover:text-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="font-serif text-muted-foreground hover:text-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="font-serif text-muted-foreground hover:text-primary transition-colors"
                aria-label="Email"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12">
          <OrnamentRule />
          <p className="mt-6 text-center label-caps !text-[0.65rem]">
            © {new Date().getFullYear()} The Narrow Path
          </p>
        </div>
      </div>
    </footer>
  );
};
