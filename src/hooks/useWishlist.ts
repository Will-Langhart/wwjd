import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const useWishlist = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    // Get current user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchWishlist(session.user.id);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserId(session.user.id);
        fetchWishlist(session.user.id);
      } else {
        setUserId(null);
        setWishlistItems([]);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchWishlist = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from("wishlist")
        .select("product_id")
        .eq("user_id", uid);

      if (error) throw error;
      setWishlistItems(data?.map((item) => item.product_id) || []);
    } catch (error) {
      console.error("Failed to fetch wishlist:", error);
    }
  };

  const isInWishlist = (productId: string) => {
    return wishlistItems.includes(productId);
  };

  const addToWishlist = async (product: {
    id: string;
    handle: string;
    title: string;
    imageUrl?: string;
    priceAmount: string;
    priceCurrency: string;
  }) => {
    if (!userId) {
      toast.error("Please log in to add items to your wishlist");
      return false;
    }

    try {
      const { error } = await supabase.from("wishlist").insert({
        user_id: userId,
        product_id: product.id,
        product_handle: product.handle,
        product_title: product.title,
        product_image_url: product.imageUrl,
        product_price_amount: product.priceAmount,
        product_price_currency: product.priceCurrency,
      });

      if (error) throw error;
      setWishlistItems([...wishlistItems, product.id]);
      toast.success("Added to wishlist");
      return true;
    } catch (error: any) {
      toast.error("Failed to add to wishlist");
      return false;
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!userId) return false;

    try {
      const { error } = await supabase
        .from("wishlist")
        .delete()
        .eq("user_id", userId)
        .eq("product_id", productId);

      if (error) throw error;
      setWishlistItems(wishlistItems.filter((id) => id !== productId));
      toast.success("Removed from wishlist");
      return true;
    } catch (error: any) {
      toast.error("Failed to remove from wishlist");
      return false;
    }
  };

  const toggleWishlist = async (product: {
    id: string;
    handle: string;
    title: string;
    imageUrl?: string;
    priceAmount: string;
    priceCurrency: string;
  }) => {
    if (isInWishlist(product.id)) {
      return await removeFromWishlist(product.id);
    } else {
      return await addToWishlist(product);
    }
  };

  return {
    userId,
    wishlistItems,
    isInWishlist,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
  };
};