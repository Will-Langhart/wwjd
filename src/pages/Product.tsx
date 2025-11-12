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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const addItem = useCartStore(state => state.addItem);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!handle) return;
      setLoading(true);
      try {
        const data = await getProductByHandle(handle);
        setProduct(data);
        
        // Set default selected options to first available variant
        if (data && data.node.options.length > 0) {
          const defaultOptions: Record<string, string> = {};
          data.node.options.forEach(option => {
            if (option.values.length > 0) {
              defaultOptions[option.name.toLowerCase()] = option.values[0];
            }
          });
          setSelectedOptions(defaultOptions);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        toast.error('Failed to load product');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [handle]);

  // Find the variant that matches the selected options
  const selectedVariant = product?.node.variants.edges.find(({ node }) => {
    return node.selectedOptions.every(option => 
      selectedOptions[option.name.toLowerCase()] === option.value
    );
  })?.node;

  const handleAddToCart = () => {
    if (!product || !selectedVariant) return;

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
  const price = selectedVariant ? parseFloat(selectedVariant.price.amount).toFixed(2) : '0.00';
  const currency = selectedVariant?.price.currencyCode || 'USD';
  
  // Always display all product images
  const displayImages = node.images.edges;

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

        <div className="max-w-6xl mx-auto">
          {/* Image Carousel */}
          <div className="mb-6">
            {displayImages.length > 0 ? (
              <Carousel className="w-full relative" key={selectedVariant?.id}>
                <CarouselContent>
                  {displayImages.map((image, index) => (
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
                {displayImages.length > 1 && (
                  <>
                    <CarouselPrevious className="!left-4 bg-background/90 hover:bg-background border-2 shadow-lg" />
                    <CarouselNext className="!right-4 bg-background/90 hover:bg-background border-2 shadow-lg" />
                  </>
                )}
              </Carousel>
            ) : (
              <div className="aspect-square overflow-hidden rounded-lg bg-secondary/10 flex items-center justify-center">
                <span className="text-muted-foreground">No image</span>
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{node.title}</h1>
              <p className="text-2xl md:text-3xl font-bold text-primary">
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

            {/* Variant Selectors */}
            {node.options.length > 0 && (
              <div className="space-y-4 border-t pt-6">
                {node.options.map((option) => (
                  <div key={option.name}>
                    <label className="text-sm font-semibold mb-2 block">
                      {option.name.charAt(0).toUpperCase() + option.name.slice(1)}
                    </label>
                    <Select
                      value={selectedOptions[option.name.toLowerCase()] || ''}
                      onValueChange={(value) => 
                        setSelectedOptions(prev => ({
                          ...prev,
                          [option.name.toLowerCase()]: value
                        }))
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder={`Select ${option.name}`} />
                      </SelectTrigger>
                      <SelectContent>
                        {option.values.map((value) => (
                          <SelectItem key={value} value={value}>
                            {value}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                ))}
              </div>
            )}
            
            {/* Add to Cart Button */}
            <Button
              size="lg" 
              className="w-full sticky bottom-4 md:static shadow-lg md:shadow-none"
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
