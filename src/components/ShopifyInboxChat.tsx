import { useEffect } from "react";

const SHOPIFY_CHAT_SCRIPT_URL = "https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopifyChatV1.js";

export const ShopifyInboxChat = () => {
  useEffect(() => {
    // Load Shopify Inbox script
    const script = document.createElement("script");
    script.src = SHOPIFY_CHAT_SCRIPT_URL;
    script.async = true;

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
