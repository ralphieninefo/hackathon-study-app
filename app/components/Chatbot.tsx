"use client";

import { useEffect } from "react";

interface ChatbotProps {
  context?: string;
  score?: number;
  totalQuestions?: number;
  examType?: string;
  domainBreakdown?: Record<string, { correct: number; total: number }>;
}

export default function Chatbot({ context, score, totalQuestions, examType, domainBreakdown }: ChatbotProps = {}) {
  useEffect(() => {
    // Check if script already exists
    if (document.querySelector('script[data-chatbot-id="ShoCYH4W_g1G_Y53bOnKZAs3_eFwrwVJ"]')) {
      return;
    }

    // Create and configure the script element
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://g47d2k63ws4ynv3cb44olxel.agents.do-ai.run/static/chatbot/widget.js";
    script.setAttribute("data-agent-id", "266c0f22-af0f-11f0-b074-4e013e2ddde4");
    script.setAttribute("data-chatbot-id", "ShoCYH4W_g1G_Y53bOnKZAs3_eFwrwVJ");
    script.setAttribute("data-name", "HelpMeStudyforAWS Chatbot");
    script.setAttribute("data-primary-color", "#031B4E");
    script.setAttribute("data-secondary-color", "#E5E8ED");
    script.setAttribute("data-button-background-color", "#0061EB");
    
    // Build context-aware starting message
    let startingMessage = "What's your question? Together we will crush!";
    
    if (context) {
      startingMessage = context;
    } else if (score !== undefined && totalQuestions !== undefined && examType) {
      const percentage = Math.round((score / totalQuestions) * 100);
      const domainInfo = domainBreakdown 
        ? Object.entries(domainBreakdown)
            .map(([domain, stats]) => `${domain}: ${stats.correct}/${stats.total}`)
            .join(", ")
        : "";
      
      startingMessage = `You scored ${score}/${totalQuestions} (${percentage}%) on the ${examType.toUpperCase()} exam. Topics covered: ${domainInfo}. How can I help you improve?`;
    }
    
    script.setAttribute("data-starting-message", startingMessage);
    script.setAttribute("data-logo", "/static/chatbot/icons/default-agent.svg");

    // Add script to document head
    document.head.appendChild(script);

    // Cleanup function to remove script on unmount
    return () => {
      const existingScript = document.querySelector('script[data-chatbot-id="ShoCYH4W_g1G_Y53bOnKZAs3_eFwrwVJ"]');
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [context, score, totalQuestions, examType, domainBreakdown]);

  // Programmatic opener to surface the widget when requested
  useEffect(() => {
    function tryOpen(): boolean {
      try { if ((window as any).doAI?.open) { (window as any).doAI.open(); return true; } } catch {}
      try { if ((window as any).DOAI?.open) { (window as any).DOAI.open(); return true; } } catch {}

      try {
        const btns = Array.from(document.querySelectorAll('button')) as HTMLButtonElement[];
        const candidate = btns.find((b) => {
          const label = (b.getAttribute('title') || b.getAttribute('aria-label') || b.textContent || '').toLowerCase();
          const style = window.getComputedStyle(b);
          const isFixed = style.position === 'fixed';
          const nearBR = isFixed && (parseInt(style.right || '0', 10) >= 0) && (parseInt(style.bottom || '0', 10) >= 0);
          return label.includes('chat') || label.includes('help') || nearBR;
        });
        if (candidate) { candidate.click(); return true; }
      } catch {}

      return false;
    }

    (window as any).openStudyChatbot = () => {
      if (!tryOpen()) {
        const observer = new MutationObserver((_m, obs) => {
          if (tryOpen()) obs.disconnect();
        });
        observer.observe(document.body, { childList: true, subtree: true });
        setTimeout(() => observer.disconnect(), 5000);
      }
    };

    const onOpen = () => (window as any).openStudyChatbot?.();
    window.addEventListener('open-chatbot', onOpen);
    return () => window.removeEventListener('open-chatbot', onOpen);
  }, []);

  // This component doesn't render anything directly
  // The chatbot widget is injected by the external script
  return null;
}
