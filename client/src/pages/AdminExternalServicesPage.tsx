import React from 'react';
import { Link } from 'react-router-dom';
import { Database, Users, Activity, Cloud, Zap, Server, HardDrive, Cpu } from 'lucide-react';

const AdminExternalServicesPage: React.FC = () => {
  return (
    <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            External Services
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Access external services and tools for managing your business operations.
          </p>
        </div>

        {/* External Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a 
            href="https://crm.clickbit.com.au/app-admin" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Database className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">CRM Admin</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Customer Management</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Manage customer relationships and sales pipeline</p>
          </a>

          <a 
            href="https://team.crm.clickbit.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <Users className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Team CRM</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Team Collaboration</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Team access to CRM system and shared data</p>
          </a>

          <Link 
            to="/admin/uptime-kuma"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">Uptime Kuma</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">System Monitor</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Monitor system status and uptime</p>
          </Link>

          <a 
            href="https://cloud.clickbit.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
                <Cloud className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">ClickCloud</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Cloud Services</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Cloud infrastructure and hosting management</p>
          </a>

          <a 
            href="https://automation.clickbit.com.au" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-teal-100 dark:bg-teal-900/30 rounded-lg">
                <Zap className="h-6 w-6 text-teal-600 dark:text-teal-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">N8N</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Workflow Automation</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Automate workflows and business processes</p>
          </a>

          <a 
            href="https://192.168.1.182/login.html" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                <Server className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">R730</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Server Management</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Dell PowerEdge R730 server interface</p>
          </a>

          <a 
            href="http://192.168.1.119" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
                <HardDrive className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">R730XD</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Server Management</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Dell PowerEdge R730XD server interface</p>
          </a>

          <a 
            href="http://192.168.1.96" 
            target="_blank" 
            rel="noopener noreferrer"
            className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 hover:scale-105"
          >
            <div className="flex items-center mb-3">
              <div className="p-3 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                <Cpu className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-3">
                <h3 className="font-semibold text-gray-900 dark:text-white">SR650</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">Server Management</p>
              </div>
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-300">Lenovo ThinkSystem SR650 server interface</p>
          </a>
        </div>
      </div>
    </div>
  );
};

export default AdminExternalServicesPage;

