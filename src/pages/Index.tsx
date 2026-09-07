import { useEffect, useState } from "react";
import { getProducts, ShopifyProduct } from "@/lib/shopify";
import { ProductCard } from "@/components/ProductCard";
import { OrnamentRule, OrnamentGlyph, OrnamentField } from "@/components/marks";
import wwjdLogo from "@/assets/wwjd_logo.png";
import { Loader2, ArrowRight } from "lucide-react";

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
      {/* ============================================================
          HERO — typographic, on parchment ground.
          No photograph: the type system is the brand. The Chi-Rho and
          the Nicene line are held in common by every tradition we serve.
          ============================================================ */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center ground-parchment overflow-hidden">
        {/* --- Hero ground, in layers --------------------------------
            1. the drifting ornament lattice
            2. a slow gilt bloom
            3. a vignette that sinks the edges and lifts the centre    */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
          <div className="absolute -inset-32 text-foreground opacity-[0.055] animate-drift">
            <OrnamentField className="w-full h-full" />
          </div>
          <div
            className="absolute inset-0 animate-breathe"
            style={{
              background:
                'radial-gradient(ellipse 70% 55% at 50% 42%, hsl(var(--ochre) / 0.16) 0%, transparent 70%)',
            }}
          />
          <div
            className="absolute inset-0"
            style={{
              background:
                'radial-gradient(ellipse 78% 62% at 50% 44%, transparent 18%, hsl(var(--background) / 0.72) 62%, hsl(var(--background)) 100%)',
            }}
          />
        </div>

        {/* Ruled margins, as on a codex page */}
        <div
          className="pointer-events-none absolute inset-y-0 left-6 sm:left-12 w-px bg-foreground/[0.07]"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-y-0 right-6 sm:right-12 w-px bg-foreground/[0.07]"
          aria-hidden="true"
        />

        <div className="container relative px-6 py-20 md:py-24">
          <div className="mx-auto max-w-3xl text-center">

            {/* --- The mark, flanked by Alpha and Omega --- */}
            <div className="flex items-center justify-center gap-5 sm:gap-8 animate-rise">
              <span className="font-serif text-2xl sm:text-3xl text-accent select-none" aria-hidden="true">
                Α
              </span>
              <img
                src={wwjdLogo}
                alt="The Narrow Path"
                width={1024}
                height={1024}
                className="h-20 sm:h-28 w-auto dark:invert"
              />
              <span className="font-serif text-2xl sm:text-3xl text-accent select-none" aria-hidden="true">
                Ω
              </span>
            </div>

            {/* --- Wordmark --- */}
            <h1 className="mt-10 sm:mt-12 animate-rise stagger-1" style={{ animationFillMode: 'both' }}>
              <span className="block font-heading text-4xl sm:text-6xl md:text-7xl font-semibold tracking-wordmark text-foreground">
                THE
              </span>
              <span className="block font-heading text-4xl sm:text-6xl md:text-7xl font-semibold tracking-wordmark text-foreground mt-1 sm:mt-2">
                NARROW PATH
              </span>
            </h1>

            <OrnamentRule className="mt-8 sm:mt-10 animate-rise stagger-2" />

            {/* --- The Nicene line. 325/381 — before every division. --- */}
            <div className="mt-8 sm:mt-10 animate-rise stagger-3" style={{ animationFillMode: 'both' }}>
              <p className="font-serif text-base sm:text-lg text-accent tracking-inscription">
                Φῶς ἐκ Φωτός
              </p>
              <p className="mt-2 font-serif italic text-lg sm:text-xl md:text-2xl text-foreground/85 leading-relaxed">
                Light of Light, very God of very God,<br className="hidden sm:block" />
                {" "}begotten, not made.
              </p>
              <p className="mt-3 label-caps">The Nicene Creed · 325</p>
            </div>

            {/* --- Calls to action --- */}
            <div
              className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 animate-rise stagger-4"
              style={{ animationFillMode: 'both' }}
            >
              <a
                href="/shop"
                className="btn-ink group w-full sm:w-auto px-9 py-4 text-xs bg-primary text-primary-foreground rounded-sm"
              >
                Shop the Collection
                <ArrowRight className="ml-3 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
              <a
                href="#featured"
                className="btn-outline-ink w-full sm:w-auto px-9 py-4 text-xs rounded-sm"
              >
                What We Make
              </a>
            </div>

            {/* --- Positioning line: says who this is for, plainly. --- */}
            <p
              className="mt-14 font-serif text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed animate-rise stagger-5"
              style={{ animationFillMode: 'both' }}
            >
              Drawn from the inheritance held in common before the divisions —
              the Creed, the catacomb marks, the cross in its many forms,
              and the martyrs of the early Church.
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED
          ============================================================ */}
      <section id="featured" className="relative py-20 md:py-28 bg-background">
        <div className="container px-6">
          <div className="text-center mb-14 md:mb-16">
            <span className="label-caps">The Collection</span>
            <h2 className="mt-4 font-heading text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground">
              The Foundation
            </h2>
            <p className="mt-5 font-serif text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
              Marks that predate every division, worn by those who keep them still.
            </p>
            <OrnamentRule className="mt-8" />
          </div>

          {loading ? (
            <div className="flex flex-col justify-center items-center min-h-[400px] gap-5">
              <Loader2 className="w-7 h-7 animate-spin text-primary" />
              <p className="label-caps">Loading</p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20 max-w-md mx-auto">
              <OrnamentGlyph className="w-6 h-6 mx-auto mb-6 text-muted-foreground" />
              <h3 className="font-heading text-2xl mb-3">Nothing here yet</h3>
              <p className="font-serif text-muted-foreground">
                The collection is being prepared. Return soon.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {products.map((product, index) => (
                <div
                  key={product.node.id}
                  className="animate-fade-in"
                  style={{
                    animationDelay: `${Math.min(index, 8) * 0.06}s`,
                    animationFillMode: 'both'
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          )}

          {products.length > 0 && (
            <div className="text-center mt-16">
              <a
                href="/shop"
                className="btn-outline-ink inline-flex px-8 py-3.5 text-xs rounded-sm group"
              >
                View All
                <ArrowRight className="ml-3 w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </a>
            </div>
          )}
        </div>
      </section>
    </main>
  );
};

export default Index;
