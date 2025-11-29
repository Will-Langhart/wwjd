import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSupabaseClient } from "@/integrations/supabase/safeClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "@supabase/supabase-js";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { AccountDetails } from "@/components/profile/AccountDetails";
import { ShippingAddresses } from "@/components/profile/ShippingAddresses";
import { OrderHistory } from "@/components/profile/OrderHistory";
import { Wishlist } from "@/components/profile/Wishlist";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const initProfile = async () => {
      try {
        const supabase = await getSupabaseClient();
        if (!supabase || !isMounted) return;

        // Check if user is logged in
        const { data: { session } } = await supabase.auth.getSession();
        if (!isMounted) return;

        if (!session) {
          navigate("/auth");
        } else {
          setUser(session.user);
          setIsLoading(false);
        }

        // Listen for auth changes
        const { data } = supabase.auth.onAuthStateChange((event, session) => {
          if (!isMounted) return;
          if (event === "SIGNED_OUT") {
            navigate("/auth");
          } else if (session) {
            setUser(session.user);
          }
        });
        subscription = data.subscription;
      } catch (error) {
        console.error("Failed to initialize profile page", error);
        setIsLoading(false);
      }
    };

    initProfile();

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, [navigate]);

  const handleLogout = async () => {
    try {
      const supabase = await getSupabaseClient();
      if (!supabase) {
        toast.error("Logout is unavailable");
        return;
      }

      await supabase.auth.signOut();
      toast.success("Logged out successfully");
      navigate("/");
    } catch (error: any) {
      console.error("Failed to log out", error);
      toast.error("Failed to log out");
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 container py-12 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </main>
    );
  }

  if (!user) return null;

  return (
    <main className="flex-1 container py-12">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">My Account</h1>
            <p className="text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Log Out
          </Button>
        </div>

        <Tabs defaultValue="account" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="addresses">Addresses</TabsTrigger>
            <TabsTrigger value="orders">Orders</TabsTrigger>
            <TabsTrigger value="wishlist">Wishlist</TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-4">
            <AccountDetails userId={user.id} />
          </TabsContent>

          <TabsContent value="addresses" className="space-y-4">
            <ShippingAddresses userId={user.id} />
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <OrderHistory userId={user.id} />
          </TabsContent>

          <TabsContent value="wishlist" className="space-y-4">
            <Wishlist userId={user.id} />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default Profile;