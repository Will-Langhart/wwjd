import { useEffect } from "react";

interface QuickCEPChatProps {
  widgetId?: string;
  scriptUrl?: string;
}

export const QuickCEPChat = ({ 
  widgetId = "YOUR_QUICKCEP_WIDGET_ID", 
  scriptUrl = "https://app.quickcep.com/widget.js" 
}: QuickCEPChatProps) => {
  useEffect(() => {
    // Load QuickCEP script
    const script = document.createElement("script");
    script.src = scriptUrl;
    script.async = true;
    script.defer = true;
    
    // Add widget configuration
    script.onload = () => {
      // Initialize QuickCEP widget
      if (window.QuickCEP) {
        window.QuickCEP.init({
          widgetId: widgetId,
          position: "bottom-right",
        });
      }
    };

    document.body.appendChild(script);

    // Cleanup
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      // Remove QuickCEP widget if cleanup method exists
      if (window.QuickCEP?.destroy) {
        window.QuickCEP.destroy();
      }
    };
  }, [widgetId, scriptUrl]);

  return null; // QuickCEP injects its own widget
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    QuickCEP?: {
      init: (config: { widgetId: string; position: string }) => void;
      destroy?: () => void;
    };
  }
}
