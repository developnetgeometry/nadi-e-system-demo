
import React from 'react';
import { Server, Cpu, HardDrive, Clock } from 'lucide-react';

interface StatusItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  color?: string;
}

const StatusItem: React.FC<StatusItemProps> = ({ icon, label, value, color = 'text-gray-700' }) => {
  return (
    <div className="flex items-center space-x-3">
      <div className={`${color}`}>
        {icon}
      </div>
      <div>
        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{label}</div>
        <div className="text-sm font-semibold dark:text-white">{value}</div>
      </div>
    </div>
  );
};

const SystemStatus: React.FC = () => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-5 shadow-sm animate-fade-in dark:border dark:border-gray-700">
      <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-4">System Status</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatusItem 
          icon={<Server size={20} />} 
          label="Server Status" 
          value="Operational" 
          color="text-green-500" 
        />
        
        <StatusItem 
          icon={<Cpu size={20} />} 
          label="CPU Usage" 
          value="45%" 
          color="text-yellow-500" 
        />
        
        <StatusItem 
          icon={<HardDrive size={20} />} 
          label="Memory Usage" 
          value="62%" 
          color="text-purple-500" 
        />
        
        <StatusItem 
          icon={<Clock size={20} />} 
          label="Last Backup" 
          value="2 hours ago" 
          color="text-orange-500" 
        />
      </div>
    </div>
  );
};

export default SystemStatus;
