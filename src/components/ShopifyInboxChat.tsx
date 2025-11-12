import { useEffect } from "react";

const SHOPIFY_STORE_DOMAIN = "narrow-path-shop-pwpob.myshopify.com";

export const ShopifyInboxChat = () => {
  useEffect(() => {
    // Load Shopify Inbox script
    const script = document.createElement("script");
    script.src = `https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopifyChatV1.js`;
    script.async = true;
    
    script.onload = () => {
      // Initialize Shopify Chat
      if (window.ShopifyChat) {
        window.ShopifyChat.init({
          shop: SHOPIFY_STORE_DOMAIN,
          buttonColor: "#ff9800",
          buttonIcon: "chat",
          horizontalPosition: "right",
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return null; // Shopify Inbox injects its own widget
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ShopifyChat?: {
      init: (config: {
        shop: string;
        buttonColor?: string;
        buttonIcon?: string;
        horizontalPosition?: string;
      }) => void;
    };
  }
}
