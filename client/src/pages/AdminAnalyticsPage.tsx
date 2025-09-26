import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Users, 
  MousePointer, 
  DollarSign, 
  Globe, 
  Smartphone, 
  Monitor,
  BarChart3,
  Calendar,
  Target
} from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-toastify';

interface AnalyticsDashboard {
  pageViews: number;
  topPages: any[];
  topReferrers: any[];
  conversionStats: any[];
  utmStats: any[];
  deviceStats: any[];
  geographicStats: any[];
}

interface BigQueryStatus {
  configured: boolean;
  dashboard_url?: string;
  setup_instructions?: any;
}

const AdminAnalyticsPage: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<AnalyticsDashboard | null>(null);
  const [realtimeData, setRealtimeData] = useState<any[]>([]);
  const [bigQueryStatus, setBigQueryStatus] = useState<BigQueryStatus | null>(null);
  const [audiences, setAudiences] = useState<any>(null);
  const [recommendations, setRecommendations] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    fetchDashboardData();
    fetchRealtimeData();
    fetchBigQueryStatus();
    fetchAudiences();
    fetchRecommendations();
    
    // Set up real-time data refresh
    const interval = setInterval(fetchRealtimeData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [period]);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get(`/analytics/dashboard?period=${period}`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching analytics dashboard:', error);
      toast.error('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealtimeData = async () => {
    try {
      const response = await api.get('/analytics/realtime');
      setRealtimeData(response.data.data || []);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const fetchBigQueryStatus = async () => {
    try {
      const response = await api.get('/analytics/bigquery/status');
      setBigQueryStatus(response.data.data);
    } catch (error) {
      console.error('Error fetching BigQuery status:', error);
    }
  };

  const fetchAudiences = async () => {
    try {
      const response = await api.get('/analytics/audiences');
      setAudiences(response.data.data);
    } catch (error) {
      console.error('Error fetching audiences:', error);
    }
  };

  const fetchRecommendations = async () => {
    try {
      const response = await api.get(`/analytics/recommendations?period=${period}`);
      setRecommendations(response.data.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    }
  };

  const handleBigQueryExport = async () => {
    try {
      const response = await api.post('/analytics/export/bigquery');
      toast.success(`Exported ${response.data.exported_count} events to BigQuery`);
    } catch (error) {
      toast.error('BigQuery export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const StatCard: React.FC<{ title: string; value: string | number; icon: React.ElementType; color: string }> = 
    ({ title, value, icon: Icon, color }) => (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="flex items-center">
        <div className={`flex items-center justify-center w-12 h-12 ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Analytics Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Website traffic and user behavior insights
          </p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={period}
            onChange={(e) => setPeriod(Number(e.target.value))}
            className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm"
          >
            <option value={7}>Last 7 days</option>
            <option value={30}>Last 30 days</option>
            <option value={90}>Last 90 days</option>
            <option value={365}>Last year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Page Views"
          value={dashboardData?.pageViews || 0}
          icon={TrendingUp}
          color="bg-blue-500"
        />
        <StatCard
          title="Unique Visitors"
          value={realtimeData.length}
          icon={Users}
          color="bg-green-500"
        />
        <StatCard
          title="Conversions"
          value={dashboardData?.conversionStats?.reduce((acc, stat) => acc + (stat.conversions || 0), 0) || 0}
          icon={Target}
          color="bg-purple-500"
        />
        <StatCard
          title="Total Revenue"
          value={`$${dashboardData?.conversionStats?.reduce((acc, stat) => acc + (parseFloat(stat.total_value) || 0), 0)?.toFixed(2) || '0.00'}`}
          icon={DollarSign}
          color="bg-yellow-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Real-time Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2" />
            Real-time Activity (Last 30 min)
          </h3>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {realtimeData.slice(0, 10).map((event, index) => (
              <div key={index} className="flex items-center justify-between text-sm border-b border-gray-200 dark:border-gray-700 pb-2">
                <div>
                  <span className="font-medium text-gray-900 dark:text-white">{event.event_name}</span>
                  <p className="text-gray-600 dark:text-gray-400">{event.page_url}</p>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(event.created_at).toLocaleTimeString()}
                </span>
              </div>
            ))}
            {realtimeData.length === 0 && (
              <p className="text-gray-500 text-center py-4">No recent activity</p>
            )}
          </div>
        </div>

        {/* Top Pages */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Top Pages</h3>
          <div className="space-y-3">
            {dashboardData?.topPages?.slice(0, 5).map((page, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="font-medium text-gray-900 dark:text-white text-sm truncate">
                    {page.page_title || page.page_url}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">{page.page_url}</p>
                </div>
                <span className="text-sm font-medium text-blue-600 ml-2">
                  {page.views} views
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Device Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Smartphone className="w-5 h-5 mr-2" />
            Device Breakdown
          </h3>
          <div className="space-y-3">
            {dashboardData?.deviceStats?.map((device, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center">
                  {device.device_type === 'mobile' ? (
                    <Smartphone className="w-4 h-4 mr-2 text-gray-600" />
                  ) : (
                    <Monitor className="w-4 h-4 mr-2 text-gray-600" />
                  )}
                  <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                    {device.device_type}
                  </span>
                </div>
                <span className="text-sm text-blue-600 font-medium">{device.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geographic Stats */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2" />
            Top Locations
          </h3>
          <div className="space-y-3">
            {dashboardData?.geographicStats?.slice(0, 5).map((location, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {location.city}, {location.country}
                </span>
                <span className="text-sm text-blue-600 font-medium">{location.visits}</span>
              </div>
            ))}
          </div>
        </div>

        {/* UTM Campaign Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Campaign Performance</h3>
          <div className="space-y-3">
            {dashboardData?.utmStats?.slice(0, 5).map((utm, index) => (
              <div key={index} className="border-b border-gray-200 dark:border-gray-700 pb-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {utm.utm_campaign || 'Direct'}
                  </span>
                  <span className="text-sm text-blue-600 font-medium">{utm.visits}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {utm.utm_source} / {utm.utm_medium}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Performance */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Conversion Performance
          </h3>
          <div className="space-y-3">
            {dashboardData?.conversionStats?.map((conversion, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                  {conversion.event_type.replace('_', ' ')}
                </span>
                <div className="text-right">
                  <span className="text-sm text-green-600 font-medium block">
                    {conversion.conversions} conversions
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    ${parseFloat(conversion.total_value || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Advanced Features */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BigQuery Integration */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">BigQuery Integration</h3>
          {bigQueryStatus ? (
            <div className="space-y-3">
              <div className={`flex items-center ${bigQueryStatus.configured ? 'text-green-600' : 'text-yellow-600'}`}>
                <div className={`w-3 h-3 rounded-full mr-2 ${bigQueryStatus.configured ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                <span className="text-sm font-medium">
                  {bigQueryStatus.configured ? 'Configured' : 'Not Configured'}
                </span>
              </div>
              {bigQueryStatus.configured ? (
                <div className="space-y-2">
                  <button 
                    onClick={handleBigQueryExport}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Export to BigQuery
                  </button>
                  {bigQueryStatus.dashboard_url && (
                    <button 
                      onClick={() => window.open(bigQueryStatus.dashboard_url, '_blank')}
                      className="w-full px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Open Data Studio
                    </button>
                  )}
                </div>
              ) : (
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  <p>Set environment variables to enable BigQuery export:</p>
                  <ul className="list-disc list-inside mt-2 text-xs">
                    <li>GOOGLE_CLOUD_PROJECT_ID</li>
                    <li>GOOGLE_CLOUD_KEY_FILE</li>
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </div>

        {/* Audience Analytics */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Custom Audiences</h3>
          {audiences ? (
            <div className="space-y-3">
              {Object.entries(audiences).slice(0, 4).map(([key, audience]: [string, any]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="font-medium text-gray-900 dark:text-white">
                    {audience.name}
                  </span>
                  <span className="text-blue-600 font-medium">
                    {audience.count} users
                  </span>
                </div>
              ))}
              <button 
                onClick={() => window.open('/admin/analytics/audiences', '_blank')}
                className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm"
              >
                Manage Audiences
              </button>
            </div>
          ) : (
            <div className="animate-pulse">Loading...</div>
          )}
        </div>
      </div>

      {/* Optimization Recommendations */}
      {recommendations?.recommendations && recommendations.recommendations.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
            <Target className="w-5 h-5 mr-2" />
            Optimization Recommendations
          </h3>
          <div className="space-y-4">
            {recommendations.recommendations.map((rec: any, index: number) => (
              <div key={index} className={`border-l-4 p-4 ${
                rec.severity === 'critical' ? 'border-red-500 bg-red-50 dark:bg-red-900/20' :
                rec.severity === 'warning' ? 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20' :
                'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
              }`}>
                <h4 className="font-semibold text-gray-900 dark:text-white">{rec.title}</h4>
                <p className="text-sm text-gray-700 dark:text-gray-300 mt-1">{rec.description}</p>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-2 font-medium">
                  Action: {rec.action}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Export Options */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Export & Integration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button 
            onClick={() => window.open('https://analytics.google.com/', '_blank')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            View in GA4
          </button>
          <button 
            onClick={() => window.open('https://datastudio.google.com/', '_blank')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Data Studio
          </button>
          <button 
            onClick={() => window.open('https://ads.google.com/', '_blank')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Google Ads
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminAnalyticsPage;
