import React from 'react';
import { Activity, Settings } from 'lucide-react';

interface HeaderProps {
  currentView: 'upload' | 'admin';
  onViewChange: (view: 'upload' | 'admin') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-100">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-8 h-8 text-blue-600" />
            <span className="text-2xl font-bold text-gray-900">LabReport.ai</span>
          </div>
          
          <nav className="flex items-center space-x-4">
            <button
              onClick={() => onViewChange('upload')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'upload'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Upload Tool
            </button>
            <button
              onClick={() => onViewChange('admin')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                currentView === 'admin'
                  ? 'bg-blue-100 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              <Settings className="w-4 h-4" />
              <span>Admin</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;