// Global analytics function declarations
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
    trackEvent: (eventName: string, parameters?: any) => void;
    trackConversion: (eventName: string, value?: number, currency?: string) => void;
    trackPurchase: (transactionId: string, value: number, currency?: string, items?: any[]) => void;
    trackLead: (leadSource?: string) => void;
    trackServiceInterest: (serviceName: string) => void;
    trackQuoteRequest: (serviceType: string) => void;
    analytics: import('../services/analytics').default;
    tracked30s?: boolean;
    tracked60s?: boolean;
    tracked120s?: boolean;
    tracked300s?: boolean;
    // Meta Pixel
    fbq: (action: string, event: string, parameters?: any) => void;
  }
}

export {};
