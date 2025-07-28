import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import api from '../services/api';

interface ContentItem {
  id: string;
  type: 'text' | 'image' | 'rich_text';
  section: string;
  key: string;
  label: string;
  value: string;
  description?: string;
  page: string;
}

interface MissionPoint {
  icon: string;
  title: string;
  description: string;
}

interface ProcessPhase {
  id: number;
  mainIcon: string;
  title: string;
  subtitle: string;
  description: string;
  color: string;
  bgColor: string;
  darkBgColor: string;
  deliverables: Array<{
    text: string;
    icon: string;
  }>;
}

interface SiteIdentity {
  siteTitle: string;
  metaDescription: string;
  faviconUrl: string;
}

interface SocialLink {
  platform: string;
  url: string;
}

interface ContactInfo {
  phone1: string;
  phone2: string;
  email: string;
  address: string;
  businessHours: string;
  googleMapsUrl: string;
  socialLinks: SocialLink[];
}

interface FooterContent {
  companyDescription: string;
}

interface NavigationItem {
  label: string;
  path: string;
  order: number;
  hasDropdown?: boolean;
}

interface MarketingIntegrations {
  headerScripts: string;
  googleSearchConsoleTag: string;
  googleAnalyticsId: string;
  facebookPixelId: string;
  customMetaTags: string;
}


  interface ContentContextType {
  content: ContentItem[];
  missionPoints: MissionPoint[];
  processPhases: ProcessPhase[];
  siteIdentity: SiteIdentity;
  contactInfo: ContactInfo;
  footerContent: FooterContent;
  navigation: NavigationItem[];
  marketingIntegrations: MarketingIntegrations;
  loading: boolean;
  error: string | null;
  getContent: (page: string, section: string, key: string) => string;
  refreshContent: () => void;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};

interface ContentProviderProps {
  children: ReactNode;
}

export const ContentProvider: React.FC<ContentProviderProps> = ({ children }) => {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [missionPoints, setMissionPoints] = useState<MissionPoint[]>([]);
  const [processPhases, setProcessPhases] = useState<ProcessPhase[]>([]);
  const [siteIdentity, setSiteIdentity] = useState<SiteIdentity>({
    siteTitle: 'ClickBit - Custom Web & Software Solutions | Professional IT Services',
    metaDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.',
    faviconUrl: '/logo.svg'
  });
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    phone1: '+61 2 7229 9577',
    phone2: '+61 422 512 130',
    email: 'info@clickbit.com.au',
    address: '44 Shoreline Road\nMoorebank NSW 2170\nAustralia',
    businessHours: 'Monday - Friday: 9:00 AM - 6:00 PM\nWeekend: By appointment',
    googleMapsUrl: '',
    socialLinks: []
  });
  const [footerContent, setFooterContent] = useState<FooterContent>({
    companyDescription: 'Empowering businesses with innovative digital solutions to connect, engage, and grow.'
  });
  const [navigation, setNavigation] = useState<NavigationItem[]>([]);
  const [marketingIntegrations, setMarketingIntegrations] = useState<MarketingIntegrations>({
    headerScripts: '',
    googleSearchConsoleTag: '',
    googleAnalyticsId: '',
    facebookPixelId: '',
    customMetaTags: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch all content in parallel using public endpoints
      const [
        missionRes, 
        processRes, 
        siteIdentityRes, 
        contactInfoRes, 
        footerContentRes, 
        navigationRes,
        marketingRes
      ] = await Promise.allSettled([
        api.get('/public/mission-points'),
        api.get('/public/process-phases'),
        api.get('/public/site-identity'),
        api.get('/public/contact-info'),
        api.get('/public/footer-content'),
        api.get('/public/navigation'),
        api.get('/public/marketing-integrations')
      ]);

      // Content data is now handled via individual public endpoints
      // No longer need the admin content-management endpoint
      setContent([]);

      

      // Handle mission points data
      if (missionRes.status === 'fulfilled' && missionRes.value.data) {
        setMissionPoints(missionRes.value.data);
      }

      // Handle process phases data
      if (processRes.status === 'fulfilled' && processRes.value.data) {
        setProcessPhases(processRes.value.data);
      }

      // Handle site identity data
      if (siteIdentityRes.status === 'fulfilled' && siteIdentityRes.value.data) {
        console.log('Setting site identity:', siteIdentityRes.value.data);
        setSiteIdentity(siteIdentityRes.value.data);
      } else {
        console.log('Site identity fetch failed:', siteIdentityRes);
      }

      // Handle contact info data
      if (contactInfoRes.status === 'fulfilled' && contactInfoRes.value.data) {
        setContactInfo(contactInfoRes.value.data);
      }

      // Handle footer content data
      if (footerContentRes.status === 'fulfilled' && footerContentRes.value.data) {
        console.log('Setting footer content:', footerContentRes.value.data);
        setFooterContent(footerContentRes.value.data);
      } else {
        console.log('Footer content fetch failed:', footerContentRes);
      }

      // Handle navigation data
      if (navigationRes.status === 'fulfilled' && navigationRes.value.data) {
        setNavigation(navigationRes.value.data.sort((a: NavigationItem, b: NavigationItem) => a.order - b.order));
      }

      // Handle marketing integrations data
      if (marketingRes.status === 'fulfilled' && marketingRes.value.data) {
        setMarketingIntegrations(marketingRes.value.data);
      }

    } catch (err) {
      console.error('Failed to fetch content:', err);
      setError('Failed to load content');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  const getContent = (page: string, section: string, key: string): string => {
    const item = content.find(c => 
      c.page === page && c.section === section && c.key === key
    );
    return item?.value || '';
  };

  const refreshContent = () => {
    fetchContent();
  };

  const value: ContentContextType = {
    content,
    missionPoints,
    processPhases,
    siteIdentity,
    contactInfo,
    footerContent,
    navigation,
    marketingIntegrations,
    loading,
    error,
    getContent,
    refreshContent
  };

  return (
    <ContentContext.Provider value={value}>
      {children}
    </ContentContext.Provider>
  );
};