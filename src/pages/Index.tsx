import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2, ArrowDown, Cross, Sparkles } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(20);
        const uniqueProducts = data.filter((product, index, self) => 
          index === self.findIndex(p => p.node.title === product.node.title)
        );
        setProducts(uniqueProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <main className="flex-1">
      {/* Hero Section */}
      <section className="relative h-[calc(100vh-4rem)] min-h-[600px] overflow-hidden">
        {/* Background with parallax effect */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed scale-105" 
          style={{ backgroundImage: `url(${heroImage})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-accent/70 via-transparent to-background/95" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,hsl(var(--background)/0.8)_100%)]" />
        </div>
        
        {/* Floating decorative elements - ocean wave inspired */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-10 w-32 h-32 border-2 border-primary/30 rounded-full animate-pulse" style={{ animationDuration: '4s' }} />
          <div className="absolute bottom-1/3 right-16 w-24 h-24 border-2 border-accent/20 rounded-full animate-pulse" style={{ animationDuration: '5s', animationDelay: '1s' }} />
          <Cross className="absolute top-1/3 right-1/4 w-8 h-8 text-primary/30 animate-pulse" style={{ animationDuration: '3s' }} />
          <div className="absolute bottom-1/4 left-1/4 w-16 h-16 border border-muted/30 rounded-full animate-pulse" style={{ animationDuration: '6s', animationDelay: '2s' }} />
        </div>

        <div className="relative container h-full flex flex-col px-4">
          {/* Top centered content - above the cross */}
          <div className="flex flex-col items-center text-center pt-8 md:pt-12 space-y-4">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm font-medium text-foreground/80 animate-fade-in">
              <Sparkles className="w-4 h-4 text-primary" />
              Faith-Forward Fashion
            </div>

            {/* Main heading */}
            <h1 className="animate-fade-in stagger-1" style={{ animationFillMode: 'both' }}>
              <span className="block text-5xl sm:text-7xl md:text-8xl font-heading text-foreground tracking-tight mb-1">
                WWJD
              </span>
              <span className="block text-2xl sm:text-4xl md:text-5xl font-heading text-gradient tracking-wide">
                THE NARROW PATH
              </span>
            </h1>

          </div>

          {/* Spacer to let the cross show in the middle */}
          <div className="flex-1" />

          {/* Bottom centered content - below the cross */}
          <div className="flex flex-col items-center text-center pb-24 md:pb-28 space-y-5">
            {/* Scripture quote */}
            <div className="max-w-lg px-5 py-3 rounded-lg glass animate-fade-in stagger-3" style={{ animationFillMode: 'both' }}>
              <p className="text-sm text-muted-foreground italic font-serif leading-relaxed">
                "Enter through the narrow gate. For wide is the gate and broad is the road that leads to destruction."
              </p>
              <p className="text-xs text-muted-foreground/70 mt-2 font-medium tracking-wide">— MATTHEW 7:13</p>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 animate-fade-in stagger-4" style={{ animationFillMode: 'both' }}>
              <a 
                href="/shop" 
                className="group inline-flex items-center justify-center px-6 py-3 text-base font-semibold bg-primary text-primary-foreground rounded-lg btn-glow transition-all duration-300 hover:scale-[1.02]"
              >
                Shop Collection
                <ArrowDown className="ml-2 w-4 h-4 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
              </a>
              <a 
                href="#featured" 
                className="inline-flex items-center justify-center px-6 py-3 text-base font-semibold text-foreground glass rounded-lg hover:bg-background/90 transition-all duration-300"
              >
                View Featured
              </a>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 animate-bounce">
            <a href="#featured" className="flex flex-col items-center gap-2 text-muted-foreground/60 hover:text-foreground transition-colors">
              <span className="text-xs font-medium tracking-widest uppercase">Scroll</span>
              <ArrowDown className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section id="featured" className="relative py-24 md:py-32">
        {/* Subtle background pattern */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.08)_0%,transparent_50%)]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.05)_0%,transparent_50%)]" />
        </div>

        <div className="container relative">
          {/* Section header */}
          <div className="text-center mb-16 space-y-4">
            <span className="inline-block text-sm font-medium text-primary tracking-widest uppercase">
              Our Collection
            </span>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading tracking-tight">
              The Foundation
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Grounded in Scripture. Designed for the journey ahead.
            </p>
            <div className="section-divider mt-6" />
          </div>
          
          {/* Products grid */}
          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] gap-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping" />
                <Loader2 className="w-10 h-10 animate-spin text-primary relative" />
              </div>
              <p className="text-muted-foreground text-sm">Loading products...</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 max-w-md mx-auto">
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
                <Cross className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-2xl font-semibold mb-3">No products found</h3>
              <p className="text-muted-foreground">
                We're working on adding products to our store. Check back soon!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.node.id} 
                  className="animate-fade-in"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {/* View all link */}
          {products.length > 0 && (
            <div className="text-center mt-16">
              <a 
                href="/shop" 
                className="inline-flex items-center gap-2 text-foreground font-medium hover:text-primary transition-colors group"
              >
                View All Products
                <ArrowDown className="w-4 h-4 rotate-[-90deg] transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;