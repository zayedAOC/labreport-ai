import React, { useState } from 'react';
import { FileText, Shield, Globe, BarChart3 } from 'lucide-react';
import UploadInterface from './components/UploadInterface';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import Footer from './components/Footer';

type ViewType = 'upload' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<ViewType>('upload');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="container mx-auto px-4 py-8">
        {currentView === 'upload' ? (
          <div>
            {/* Hero Section */}
            <div className="text-center mb-12 max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Take your health into your own hands
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Upload your lab reports and get instant, easy-to-understand explanations in your preferred language. 
                Your privacy is our priority - no personal information is stored.
              </p>
              
              {/* Key Features */}
              <div className="grid md:grid-cols-3 gap-6 mb-12">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <FileText className="w-12 h-12 text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Smart Analysis</h3>
                  <p className="text-gray-600">AI-powered extraction and explanation of your lab values</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <Shield className="w-12 h-12 text-teal-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Privacy First</h3>
                  <p className="text-gray-600">Personal information is automatically removed and never stored</p>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                  <Globe className="w-12 h-12 text-green-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">8 Languages Available</h3>
                  <p className="text-gray-600">Get clear, human-friendly explanations in your preferred language</p>
                </div>
              </div>
            </div>

            {/* Key Benefits Section */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 mb-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Get Clear, Human-Friendly Explanations</h2>
                <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                  Instantly receive a plain-language summary of your lab results — easy to understand, 
                  even without a medical background.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">🌍 Available in 8 Languages</h3>
                  <p className="text-gray-600 mb-4">Your report summary is available in:</p>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>English</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Spanish</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>French</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Arabic</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Russian</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Bengali</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Hindi</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                      <span>Urdu</span>
                    </div>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-3">Example Summary:</h4>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="italic">"Your blood sugar levels are in the normal range, which is great! Your cholesterol is slightly higher than recommended - this might mean eating more vegetables and less fried food could help."</p>
                    <p className="text-xs text-gray-500 mt-3">
                      ✓ No medical jargon<br/>
                      ✓ Clear recommendations<br/>
                      ✓ Easy to understand
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <UploadInterface />
          </div>
        ) : (
          <AdminDashboard />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;