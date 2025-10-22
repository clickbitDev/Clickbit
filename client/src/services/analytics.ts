// Analytics service for ClickBit application
import api from './api';

export class AnalyticsService {
  private static instance: AnalyticsService;
  private isInitialized = false;
  private sessionId: string;

  private constructor() {
    this.sessionId = this.generateSessionId();
  }

  public static getInstance(): AnalyticsService {
    if (!AnalyticsService.instance) {
      AnalyticsService.instance = new AnalyticsService();
    }
    return AnalyticsService.instance;
  }

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getUserAgent(): string {
    return typeof window !== 'undefined' ? window.navigator.userAgent : '';
  }

  private getDeviceType(): string {
    if (typeof window === 'undefined') return 'other';
    
    const userAgent = window.navigator.userAgent;
    if (/tablet|ipad|playbook|silk/i.test(userAgent)) return 'tablet';
    if (/mobile|iphone|ipod|android|blackberry|opera|mini|windows\sce|palm|smartphone|iemobile/i.test(userAgent)) return 'mobile';
    return 'desktop';
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

  public async trackEvent(eventName: string, parameters?: any): Promise<void> {
    // Track to Google Analytics if available
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', eventName, parameters);
    }

    // Track to backend analytics API
    try {
      const eventData = {
        event_type: this.getEventType(eventName),
        event_name: eventName,
        user_id: this.getCurrentUserId(),
        session_id: this.sessionId,
        page_url: typeof window !== 'undefined' ? window.location.href : '',
        page_title: typeof window !== 'undefined' ? document.title : '',
        referrer_url: typeof window !== 'undefined' ? document.referrer : '',
        user_agent: this.getUserAgent(),
        device_type: this.getDeviceType(),
        event_data: parameters || {},
        ...parameters
      };

      await api.post('/analytics/track', eventData);
    } catch (error) {
      console.error('Failed to track event to backend:', error);
    }

    console.log('Analytics Event:', eventName, parameters);
  }

  private getEventType(eventName: string): string {
    const eventTypeMap: { [key: string]: string } = {
      'page_view': 'page_view',
      'click': 'click',
      'form_submit': 'form_submit',
      'purchase': 'purchase',
      'signup': 'signup',
      'login': 'login',
      'search': 'search',
      'download': 'download',
      'generate_lead': 'custom',
      'service_interest': 'custom',
      'quote_request': 'custom'
    };
    
    return eventTypeMap[eventName] || 'custom';
  }

  private getCurrentUserId(): number | null {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        return user.id || null;
      }
    } catch (error) {
      console.error('Error getting user ID:', error);
    }
    return null;
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

  public trackPageView(pageUrl?: string, pageTitle?: string): void {
    const url = pageUrl || (typeof window !== 'undefined' ? window.location.href : '');
    const title = pageTitle || (typeof window !== 'undefined' ? document.title : '');
    
    this.trackEvent('page_view', {
      page_url: url,
      page_title: title,
      event_category: 'page_view'
    });
  }
}

// Initialize analytics service
const analytics = AnalyticsService.getInstance();
analytics.initialize();

export default analytics;
