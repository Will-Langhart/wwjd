import { useEffect, useState } from "react";
import { OrnamentRule } from "@/components/marks";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { Loader2 } from "lucide-react";

const Shop = () => {
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
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-secondary/10">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5" />
        <div className="relative container text-center">
          <span className="label-caps">The Collection</span>
          <h1 className="mt-4 font-heading text-4xl md:text-5xl font-semibold text-foreground">
            The Foundation
          </h1>
          <p className="mt-5 font-serif text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Marks that predate every division, worn by those who keep them still.
          </p>
          <OrnamentRule className="mt-8" />
        </div>
      </section>

      {/* Products Section */}
      <section className="container pb-20">
        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 bg-card rounded-2xl shadow-[var(--shadow-soft)]">
            <div className="max-w-md mx-auto px-6">
              <h3 className="text-2xl font-semibold mb-4 text-foreground">No products found</h3>
              <p className="text-muted-foreground mb-8">
                We're working on adding products to our store. Check back soon!
              </p>
              <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  Tell us what products you'd like to see, and we'll add them for you.
                </p>
              </div>
            </div>
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

export default Shop;
