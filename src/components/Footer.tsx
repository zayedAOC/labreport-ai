import React from 'react';
import { Shield, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200 mt-16">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Medical Disclaimer</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                This tool provides educational information only and is not intended as medical advice, 
                diagnosis, or treatment. Always consult with a qualified healthcare provider for medical decisions.
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Privacy Protection</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                We automatically remove all personal health information (PHI) including names, dates of birth, 
                and medical record numbers. No personal data is stored on our servers.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            © 2025 LabReport.ai. Built with privacy and security in mind.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;