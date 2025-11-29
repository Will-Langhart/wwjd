import { useState, useEffect } from "react";
import { getSupabaseClient } from "@/integrations/supabase/safeClient";
import { toast } from "sonner";

export const useWishlist = () => {
  const [userId, setUserId] = useState<string | null>(null);
  const [wishlistItems, setWishlistItems] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      const supabase = await getSupabaseClient();
      if (!supabase || !isMounted) return;

      // Get current user
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user && isMounted) {
        setUserId(session.user.id);
        fetchWishlist(session.user.id, supabase);
      }

      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        if (!isMounted) return;
        if (session?.user) {
          setUserId(session.user.id);
          fetchWishlist(session.user.id, supabase);
        } else {
          setUserId(null);
          setWishlistItems([]);
        }
      });

      return () => subscription.unsubscribe();
    };

    init().catch((error) => {
      console.error("Failed to initialize wishlist hook", error);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  const fetchWishlist = async (uid: string, client?: any) => {
    try {
      const supabase = client || (await getSupabaseClient());
      if (!supabase) return;

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
      const supabase = await getSupabaseClient();
      if (!supabase) {
        toast.error("Wishlist service is unavailable");
        return false;
      }

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
      
      // Send wishlist notification email
      const { data: profile } = await supabase
        .from('profiles')
        .select('email')
        .eq('id', userId)
        .single();

      if (profile?.email) {
        try {
          await supabase.functions.invoke('send-notification', {
            body: {
              type: 'wishlist',
              to: profile.email,
              data: { productTitle: product.title }
            }
          });
        } catch (emailError) {
          console.error('Failed to send wishlist email:', emailError);
        }
      }
      
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
      const supabase = await getSupabaseClient();
      if (!supabase) {
        toast.error("Wishlist service is unavailable");
        return false;
      }

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
      console.error("Failed to remove from wishlist", error);
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