import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";
import heroImage from "@/assets/hero-image.jpg";

const Index = () => {
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(20);
        // Deduplicate products by title, keeping the first occurrence
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
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-background" />
          </div>
          
          <div className="relative container h-full flex flex-col items-center justify-center text-center px-4">
            <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
              <h1 className="text-6xl md:text-8xl lg:text-9xl font-heading text-white mb-6 drop-shadow-2xl tracking-wider">
                <div className="mb-2">WWJD</div>
                <div>THE NARROW PATH</div>
              </h1>
              <p className="text-xl md:text-2xl lg:text-3xl text-white/95 font-light max-w-3xl mx-auto drop-shadow-lg leading-relaxed">
                Faith-inspired fashion for the journey ahead
              </p>
              <div className="pt-4 pb-8 space-y-4">
                <p className="text-base md:text-lg text-white/90 italic drop-shadow-md font-serif">
                  "Enter through the narrow gate. For wide is the gate and broad is the road that leads to destruction, and many enter through it."
                </p>
                <p className="text-lg md:text-xl text-white/95 drop-shadow-lg font-serif">
                  <span className="font-bold text-white text-xl md:text-2xl">Jesus Christ</span> is the Way, the Truth and the Life
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
                <a 
                  href="/shop"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-primary hover:bg-primary/90 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                >
                  Shop The Collection
                </a>
                <a 
                  href="#featured"
                  className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm border-2 border-white/30 rounded-lg shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Explore
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section id="featured" className="container py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">The Foundation</h2>
            <p className="text-muted-foreground">Grounded in Scripture. Designed for the Journey.</p>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16">
              <h3 className="text-2xl font-semibold mb-4">No products found</h3>
              <p className="text-muted-foreground mb-8">
                We're working on adding products to our store. Check back soon!
              </p>
              <p className="text-sm text-muted-foreground">
                Tell us what products you'd like to see, and we'll add them for you.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.node.id} product={product} />
              ))}
            </div>
          )}
        </section>
      </main>
  );
};

export default Index;
