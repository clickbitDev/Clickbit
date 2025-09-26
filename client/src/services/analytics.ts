// Analytics service for ClickBit application
export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;

  private constructor() {}

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  public initialize(): void {
    if (this.isInitialized) return;

    // Initialize Google Analytics if available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      this.isInitialized = true;
    }

    // Set up global tracking functions
    if (typeof window !== 'undefined') {
      window.trackEvent = this.trackEvent.bind(this);
      window.trackConversion = this.trackConversion.bind(this);
      window.trackPurchase = this.trackPurchase.bind(this);
      window.trackLead = this.trackLead.bind(this);
      window.trackServiceInterest = this.trackServiceInterest.bind(this);
      window.trackQuoteRequest = this.trackQuoteRequest.bind(this);
      window.analytics = this;
    }
  }

  public trackEvent(eventName: string, parameters?: any): void {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }
    console.log('Analytics Event:', eventName, parameters);
  }

  public trackConversion(eventName: string, value?: number, currency: string = 'AUD'): void {
    this.trackEvent(eventName, {
      value,
      currency,
      event_category: 'conversion'
    });
  }

  public trackPurchase(transactionId: string, value: number, currency: string = 'AUD', items?: any[]): void {
    this.trackEvent('purchase', {
      transaction_id: transactionId,
      value,
      currency,
      items
    });
  }

  public trackLead(leadSource?: string): void {
    this.trackEvent('generate_lead', {
      event_category: 'lead',
      lead_source: leadSource
    });
  }

  public trackServiceInterest(serviceName: string): void {
    this.trackEvent('service_interest', {
      event_category: 'engagement',
      service_name: serviceName
    });
  }

  public trackQuoteRequest(serviceType: string): void {
    this.trackEvent('quote_request', {
      event_category: 'lead',
      service_type: serviceType
    });
  }
}

// Initialize analytics service
const analytics = AnalyticsService.getInstance();
analytics.initialize();

export default analytics;
