import { useEffect } from "react";

const SHOPIFY_CHAT_SCRIPT_URL = "https://cdn.shopify.com/shopifycloud/shopify_chat/storefront/shopifyChatV1Widget.js?api_env=development&c=undefined&shop_id=undefined&button_icon=chat_bubble&button_text=chat_with_us&s=undefined&p=bottom_right&vp=lowest&v=1";

export const ShopifyInboxChat = () => {
  useEffect(() => {
    // Load Shopify Inbox script
    const script = document.createElement("script");
    script.type = "text/javascript";
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
