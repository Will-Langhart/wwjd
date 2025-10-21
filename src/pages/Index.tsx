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
        setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <main className="min-h-screen">
        {/* Hero Section */}
        <section className="relative h-[60vh] overflow-hidden">
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImage})` }}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-primary/60 via-primary/40 to-background" />
          </div>
          
          <div className="relative container h-full flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg">
              WWJD: The Narrow Path
            </h1>
            <p className="text-xl md:text-2xl text-white/90 mb-8 max-w-2xl drop-shadow-md">
              Faith-inspired fashion for the journey ahead
            </p>
            <p className="text-lg text-white/80 italic drop-shadow-md">
              "Enter through the narrow gate" - Matthew 7:13
            </p>
          </div>
        </section>

        {/* Products Section */}
        <section className="container py-16">
          <h2 className="text-3xl font-bold text-center mb-12">Our Collection</h2>
          
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
