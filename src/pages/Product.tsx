import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Loader2 } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";
import { toast } from "sonner";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedVariant = product.node.variants.edges[selectedVariantIndex]?.node;
    if (!selectedVariant) return;

    const cartItem = {
      product,
      variantId: selectedVariant.id,
      variantTitle: selectedVariant.title,
      price: selectedVariant.price,
      quantity: 1,
      selectedOptions: selectedVariant.selectedOptions || []
    };
    
    addItem(cartItem);
    toast.success("Added to cart", {
      description: `${product.node.title} has been added to your cart`,
      position: "top-center",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => navigate('/')}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  const { node } = product;
  const selectedVariant = node.variants.edges[selectedVariantIndex]?.node;
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(2) : '0.00';
  const currency = selectedVariant?.price.currencyCode || 'USD';

  return (
    <main className="flex-1 container py-8">
        <Button 
          variant="ghost" 
          className="mb-6"
          onClick={() => navigate('/')}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shop
        </Button>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="w-full space-y-4">
            {node.images.edges.length > 0 ? (
              <Carousel className="w-full">
                <CarouselContent>
                  {node.images.edges.map((image, index) => (
                    <CarouselItem key={index}>
                      <div className="aspect-square overflow-hidden rounded-lg bg-secondary/10">
                        <img
                          src={image.node.url}
                          alt={image.node.altText || `${node.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                {node.images.edges.length > 1 && (
                  <>
                    <CarouselPrevious className="left-2" />
                    <CarouselNext className="right-2" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
            
            {node.variants.edges.length > 1 && (
              <div>
                <h2 className="text-lg font-semibold mb-2">Options</h2>
                <div className="flex flex-wrap gap-2">
                  {node.variants.edges.map((variant, index) => (
                    <Button
                      key={variant.node.id}
                      variant={selectedVariantIndex === index ? "default" : "outline"}
                      onClick={() => setSelectedVariantIndex(index)}
                    >
                      {variant.node.title}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{node.title}</h1>
              <p className="text-3xl font-bold text-primary">
                {currency} ${price}
              </p>
            </div>

            {node.descriptionHtml && (
              <div className="prose prose-sm max-w-none">
                <div 
                  className="product-description space-y-4"
                  dangerouslySetInnerHTML={{ __html: node.descriptionHtml }}
                />
              </div>
            )}

            <Button
              size="lg" 
              className="w-full"
              onClick={handleAddToCart}
              disabled={!selectedVariant?.availableForSale}
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
            </Button>
          </div>
        </div>
      </main>
  );
};

export default Product;
