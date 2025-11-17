import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByHandle, ShopifyProduct } from "@/lib/shopify";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ArrowLeft, Loader2, Heart, ZoomIn } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { useWishlist } from "@/hooks/useWishlist";

const Product = () => {
  const { handle } = useParams<{ handle: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<ShopifyProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>({});
  const [zoomImageUrl, setZoomImageUrl] = useState<string | null>(null);
  const addItem = useCartStore(state => state.addItem);
  const { isInWishlist, toggleWishlist } = useWishlist();

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

  const handleWishlistToggle = () => {
    if (!product) return;
    const firstImage = node.images.edges[0]?.node.url;
    toggleWishlist({
      id: node.id,
      handle: node.handle,
      title: node.title,
      imageUrl: firstImage,
      priceAmount: node.priceRange.minVariantPrice.amount,
      priceCurrency: node.priceRange.minVariantPrice.currencyCode,
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
  
  // Display variant image first if it exists, then all product images
  const displayImages = (() => {
    if (selectedVariant?.image) {
      // Filter out the variant image from product images to avoid duplicates
      const otherImages = node.images.edges.filter(
        img => img.node.url !== selectedVariant.image!.url
      );
      // Put variant image first
      return [
        { node: selectedVariant.image },
        ...otherImages
      ];
    }
    return node.images.edges;
  })();

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
          {/* Left Column - Image + Product Details */}
          <div className="space-y-6">
            {/* Image Carousel */}
            {displayImages.length > 0 ? (
              <Carousel className="w-full relative" key={selectedVariant?.id}>
                <CarouselContent>
                  {displayImages.map((image, index) => (
                    <CarouselItem key={index}>
                      <div 
                        className="aspect-square overflow-hidden rounded-lg bg-secondary/10 relative group cursor-pointer"
                        onClick={() => setZoomImageUrl(image.node.url)}
                      >
                        <img
                          src={image.node.url}
                          alt={image.node.altText || `${node.title} - Image ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <ZoomIn className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
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

            {/* Product Info Below Image */}
            <div className="space-y-12 md:space-y-6">
              <div>
                <h1 className="text-6xl md:text-3xl font-bold mb-5 md:mb-3 leading-tight">{node.title}</h1>
                <p className="text-5xl md:text-2xl font-bold text-primary">
                  {currency} ${price}
                </p>
              </div>

              {/* Variant Selectors */}
              {node.options.length > 0 && (
                <div className="space-y-10 md:space-y-4">
                  {node.options.map((option) => (
                    <div key={option.name}>
                      <label className="text-2xl md:text-base font-semibold mb-5 md:mb-3 block">
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
                        <SelectTrigger className="w-full h-20 md:h-12 text-2xl md:text-base">
                          <SelectValue placeholder={`Select ${option.name}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {option.values.map((value) => (
                            <SelectItem key={value} value={value} className="text-2xl md:text-base py-5 md:py-2">
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add to Cart & Wishlist Buttons */}
              <div className="flex gap-3">
                <Button
                  size="lg" 
                  onClick={handleAddToCart}
                  disabled={!selectedVariant?.availableForSale}
                  className="flex-1 h-24 md:h-14 text-2xl md:text-base font-semibold"
                >
                  <ShoppingCart className="w-8 h-8 md:w-5 md:h-5 mr-3 md:mr-2" />
                  {selectedVariant?.availableForSale ? 'Add to Cart' : 'Out of Stock'}
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={handleWishlistToggle}
                  className="h-24 md:h-14 w-24 md:w-14 flex-shrink-0"
                >
                  <Heart 
                    className={`w-8 h-8 md:w-5 md:h-5 ${isInWishlist(node.id) ? 'fill-primary text-primary' : ''}`} 
                  />
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column - Description Only */}
          <div className="space-y-6">
            {node.descriptionHtml && (
              <div className="prose prose-xl md:prose-sm max-w-none">
                <div 
                  className="product-description space-y-4 text-xl md:text-base"
                  dangerouslySetInnerHTML={{ __html: node.descriptionHtml }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Image Zoom Modal */}
        <Dialog open={!!zoomImageUrl} onOpenChange={() => setZoomImageUrl(null)}>
          <DialogContent className="max-w-4xl p-2">
            <img
              src={zoomImageUrl || ''}
              alt={node.title}
              className="w-full h-auto"
            />
          </DialogContent>
        </Dialog>
    </main>
  );
};

export default Product;
