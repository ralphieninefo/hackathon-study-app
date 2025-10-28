"use client";

import { useEffect } from "react";

interface DOComparisonChatbotProps {
  context?: string;
  awsServices?: string[];
  priorities?: string[];
}

export default function DOComparisonChatbot({ 
  context, 
  awsServices = [], 
  priorities = [] 
}: DOComparisonChatbotProps = {}) {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[data-chatbot-id="do-comparison-agent"]')) {
      return;
    }

    // Create and configure the script element for DO comparison
    const script = document.createElement("script");
    script.async = true;
    
    // Use your DO Gradient agent credentials here
    script.src = process.env.NEXT_PUBLIC_DO_CHATBOT_SCRIPT_URL || 
      "https://your-do-gradient-agent-url.com/static/chatbot/widget.js";
    
    // You'll need to replace these with your actual DO Gradient agent IDs
    const agentId = process.env.NEXT_PUBLIC_DO_AGENT_ID || "your-do-agent-id";
    const chatbotId = process.env.NEXT_PUBLIC_DO_CHATBOT_ID || "do-comparison-agent";
    
    script.setAttribute("data-agent-id", agentId);
    script.setAttribute("data-chatbot-id", chatbotId);
    script.setAttribute("data-name", "DigitalOcean AWS Comparison Expert");
    script.setAttribute("data-primary-color", "#0080FF"); // DO blue
    script.setAttribute("data-secondary-color", "#FFFFFF");
    script.setAttribute("data-button-background-color", "#0080FF");
    
    // Build context-aware starting message
    let startingMessage = "I can help you compare AWS services to DigitalOcean alternatives and answer any migration questions!";
    
    if (context) {
      startingMessage = context;
    } else if (awsServices.length > 0) {
      const servicesList = awsServices.join(", ");
      const prioritiesList = priorities.length > 0 ? priorities.join(", ") : "general migration";
      startingMessage = `You're interested in migrating from AWS to DigitalOcean. AWS services: ${servicesList}. Priorities: ${prioritiesList}. How can I help you get started?`;
    }
    
    script.setAttribute("data-starting-message", startingMessage);

    // Add script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const existingScript = document.querySelector('script[data-chatbot-id="do-comparison-agent"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [context, awsServices, priorities]);

  // This component doesn't render anything directly
  // The chatbot widget is injected by the external script
  return null;
}

