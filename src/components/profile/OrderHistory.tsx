import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { format } from "date-fns";

interface OrderHistoryProps {
  userId: string;
}

interface Order {
  id: string;
  order_number: string | null;
  total_amount: string;
  currency: string;
  status: string;
  items: any;
  created_at: string;
}

export const OrderHistory = ({ userId }: OrderHistoryProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    fetchOrders();
  }, [userId]);

  const fetchOrders = async () => {
    try {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      console.error("Failed to load orders", error);
      toast.error("Failed to load orders");
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Order History</h2>
      <div className="space-y-4">
        {orders.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No orders yet
            </CardContent>
          </Card>
        ) : (
          orders.map((order) => (
            <Card key={order.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Order #{order.order_number || order.id.slice(0, 8)}</CardTitle>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(order.created_at), "MMMM d, yyyy")}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">
                      {order.currency} {order.total_amount}
                    </p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {order.status}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.isArray(order.items) && order.items.map((item: any, index: number) => (
                    <div key={index} className="text-sm">
                      {item.title} × {item.quantity}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};