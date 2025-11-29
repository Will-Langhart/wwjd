import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getSupabaseClient } from "@/integrations/supabase/safeClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, ShoppingCart } from "lucide-react";
import { useCartStore } from "@/stores/cartStore";

interface WishlistProps {
  userId: string;
}

interface WishlistItem {
  id: string;
  product_id: string;
  product_handle: string;
  product_title: string;
  product_image_url: string;
  product_price_amount: string;
  product_price_currency: string;
}

export const Wishlist = ({ userId }: WishlistProps) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    fetchWishlist();
  }, [userId]);

  const fetchWishlist = async () => {
    try {
      const supabase = await getSupabaseClient();
      if (!supabase) return;

      const { data, error } = await supabase
        .from("wishlist")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error: any) {
      console.error("Failed to load wishlist", error);
      toast.error("Failed to load wishlist");
    }
  };

  const handleRemove = async (itemId: string) => {
    try {
      const supabase = await getSupabaseClient();
      if (!supabase) {
        toast.error("Wishlist service is unavailable");
        return;
      }

      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("id", itemId);

      if (error) throw error;
      toast.success("Removed from wishlist");
      fetchWishlist();
    } catch (error: any) {
      console.error("Failed to remove item", error);
      toast.error("Failed to remove item");
    }
  };

  const handleAddToCart = (item: WishlistItem) => {
    // This is a simplified version - you'd need to fetch full product details
    toast.info("Please visit the product page to add to cart");
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">My Wishlist</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-8 text-center text-muted-foreground">
              Your wishlist is empty
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <Link to={`/product/${item.product_handle}`}>
                {item.product_image_url && (
                  <div className="aspect-square overflow-hidden">
                    <img
                      src={item.product_image_url}
                      alt={item.product_title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform"
                    />
                  </div>
                )}
              </Link>
              <CardContent className="p-4 space-y-3">
                <Link to={`/product/${item.product_handle}`}>
                  <h3 className="font-medium hover:text-primary transition-colors">
                    {item.product_title}
                  </h3>
                </Link>
                <p className="font-semibold">
                  {item.product_price_currency} {parseFloat(item.product_price_amount).toFixed(2)}
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    asChild
                  >
                    <Link to={`/product/${item.product_handle}`}>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      View
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="w-4 h-4 text-destructive" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};