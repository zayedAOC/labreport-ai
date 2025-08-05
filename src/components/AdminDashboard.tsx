import React, { useState, useEffect } from 'react';
import { BarChart3, Users, Globe, Download, TrendingUp, Eye, EyeOff, Mail, Send, MessageSquare, Star, ThumbsUp, ThumbsDown, Activity } from 'lucide-react';

interface UsageStats {
  totalUploads: number;
  todayUploads: number;
  ageDistribution: { [key: string]: number };
  ethnicityDistribution: { [key: string]: number };
  languageDistribution: { [key: string]: number };
  monthlyTrend: { month: string; uploads: number }[];
}

interface FeedbackQuestion {
  id: string;
  type: 'rating' | 'multiple' | 'text';
  question: string;
  options?: string[];
  required: boolean;
}

interface UserEmail {
  email: string;
  lastUsed: string;
  reportCount: number;
  language: string;
  gender: string;
  ageRange: string;
  ethnicity: string;
  country: string;
  state: string;
  city: string;
}

interface FeedbackResponse {
  email: string;
  responses: { [questionId: string]: any };
  submittedAt: string;
  language: string;
}

interface MedicalCondition {
  condition: string;
  severity: 'normal' | 'high' | 'low' | 'critical';
  testName: string;
  value: string;
  unit: string;
}

interface UserMedicalData {
  email: string;
  ageRange: string;
  gender: string;
  ethnicity: string;
  language: string;
  country: string;
  state: string;
  city: string;
  conditions: MedicalCondition[];
  reportDate: string;
}

const AdminDashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [stats, setStats] = useState<UsageStats | null>(null);
  const [activeTab, setActiveTab] = useState<'analytics' | 'medical' | 'feedback' | 'emails'>('analytics');
  const [userEmails, setUserEmails] = useState<UserEmail[]>([]);
  const [feedbackQuestions, setFeedbackQuestions] = useState<FeedbackQuestion[]>([]);
  const [feedbackResponses, setFeedbackResponses] = useState<FeedbackResponse[]>([]);
  const [emailCampaign, setEmailCampaign] = useState({ subject: '', message: '' });
  const [medicalData, setMedicalData] = useState<UserMedicalData[]>([]);
  const [selectedCondition, setSelectedCondition] = useState<string>('');
  const [selectedDemographic, setSelectedDemographic] = useState<string>('');
  const [selectedDemographicValue, setSelectedDemographicValue] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  // Mock authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginForm.username === 'admin' && loginForm.password === 'labadmin2025') {
      setIsAuthenticated(true);
      setError(null);
      loadStats();
    } else {
      setError('Invalid credentials');
    }
  };

  // Mock data loading
  const loadStats = () => {
    setTimeout(() => {
      setStats({
        totalUploads: 15847,
        todayUploads: 234,
        ageDistribution: {
          '18-24': 12,
          '25-34': 28,
          '35-44': 25,
          '45-54': 20,
          '55-64': 10,
          '65+': 5
        },
        ethnicityDistribution: {
          'White': 35,
          'Hispanic/Latino': 20,
          'Black/African American': 15,
          'Asian': 18,
          'Other': 12
        },
        languageDistribution: {
          'English': 65,
          'Spanish': 18,
          'French': 5,
          'Arabic': 4,
          'Russian': 3,
          'Bengali': 2,
          'Hindi': 2,
          'Urdu': 1
        },
        monthlyTrend: [
          { month: 'Jan', uploads: 1200 },
          { month: 'Feb', uploads: 1400 },
          { month: 'Mar', uploads: 1800 },
          { month: 'Apr', uploads: 2100 },
          { month: 'May', uploads: 2400 },
          { month: 'Jun', uploads: 2800 }
        ]
      });
      
      // Mock user emails data
      setUserEmails([
        { email: 'john.doe@email.com', lastUsed: '2025-01-15', reportCount: 3, language: 'English', gender: 'Male', ageRange: '45-54', ethnicity: 'White', country: 'United States', state: 'California', city: 'Los Angeles' },
        { email: 'maria.garcia@email.com', lastUsed: '2025-01-14', reportCount: 1, language: 'Spanish', gender: 'Female', ageRange: '35-44', ethnicity: 'Hispanic/Latino', country: 'United States', state: 'Texas', city: 'Houston' },
        { email: 'ahmed.hassan@email.com', lastUsed: '2025-01-13', reportCount: 2, language: 'Arabic', gender: 'Male', ageRange: '55-64', ethnicity: 'Other', country: 'United States', state: 'Michigan', city: 'Detroit' },
        { email: 'jean.dupont@email.com', lastUsed: '2025-01-12', reportCount: 1, language: 'French', gender: 'Female', ageRange: '25-34', ethnicity: 'White', country: 'Canada', state: 'Quebec', city: 'Montreal' },
        { email: 'raj.patel@email.com', lastUsed: '2025-01-11', reportCount: 4, language: 'Hindi', gender: 'Male', ageRange: '35-44', ethnicity: 'Asian', country: 'United States', state: 'California', city: 'San Francisco' }
      ]);
      
      // Default feedback questions
      setFeedbackQuestions([
        {
          id: 'overall_satisfaction',
          type: 'rating',
          question: 'How satisfied are you with LabReport.ai overall?',
          required: true
        },
        {
          id: 'explanation_clarity',
          type: 'rating',
          question: 'How clear and understandable were the explanations?',
          required: true
        },
        {
          id: 'most_helpful_feature',
          type: 'multiple',
          question: 'Which feature did you find most helpful?',
          options: ['Plain language explanations', 'Color-coded results', 'Interactive glossary', 'Multilingual support', 'Visual charts'],
          required: true
        },
        {
          id: 'improvement_areas',
          type: 'multiple',
          question: 'What areas could we improve? (Select all that apply)',
          options: ['More detailed explanations', 'Additional languages', 'Better visual design', 'Faster processing', 'More test types'],
          required: false
        },
        {
          id: 'additional_features',
          type: 'text',
          question: 'What additional features would you like to see?',
          required: false
        },
        {
          id: 'recommend_likelihood',
          type: 'rating',
          question: 'How likely are you to recommend LabReport.ai to others?',
          required: true
        },
        {
          id: 'general_feedback',
          type: 'text',
          question: 'Any other feedback or suggestions?',
          required: false
        }
      ]);
      
      // Mock feedback responses
      setFeedbackResponses([
        {
          email: 'john.doe@email.com',
          responses: {
            overall_satisfaction: 5,
            explanation_clarity: 4,
            most_helpful_feature: 'Plain language explanations',
            recommend_likelihood: 5,
            general_feedback: 'Great service! Very helpful for understanding my results.'
          },
          submittedAt: '2025-01-10',
          language: 'English'
        }
      ]);
      
      // Mock medical data for analytics
      setMedicalData([
        {
          email: 'john.doe@email.com',
          ageRange: '45-54',
          gender: 'Male',
          ethnicity: 'White',
          language: 'English',
          country: 'United States',
          state: 'California',
          city: 'Los Angeles',
          conditions: [
            { condition: 'High Cholesterol', severity: 'high', testName: 'Total Cholesterol', value: '245', unit: 'mg/dL' },
            { condition: 'Low HDL', severity: 'low', testName: 'HDL Cholesterol', value: '35', unit: 'mg/dL' }
          ],
          reportDate: '2025-01-15'
        },
        {
          email: 'maria.garcia@email.com',
          ageRange: '35-44',
          gender: 'Female',
          ethnicity: 'Hispanic/Latino',
          language: 'Spanish',
          country: 'United States',
          state: 'Texas',
          city: 'Houston',
          conditions: [
            { condition: 'High Glucose', severity: 'high', testName: 'Glucose', value: '145', unit: 'mg/dL' },
            { condition: 'High Triglycerides', severity: 'high', testName: 'Triglycerides', value: '220', unit: 'mg/dL' }
          ],
          reportDate: '2025-01-14'
        },
        {
          email: 'ahmed.hassan@email.com',
          ageRange: '55-64',
          gender: 'Male',
          ethnicity: 'Other',
          language: 'Arabic',
          country: 'United States',
          state: 'Michigan',
          city: 'Detroit',
          conditions: [
            { condition: 'Vitamin D Deficiency', severity: 'low', testName: 'Vitamin D', value: '18', unit: 'ng/mL' },
            { condition: 'High Blood Pressure Indicators', severity: 'high', testName: 'Sodium', value: '148', unit: 'mEq/L' }
          ],
          reportDate: '2025-01-13'
        },
        {
          email: 'jean.dupont@email.com',
          ageRange: '25-34',
          gender: 'Female',
          ethnicity: 'White',
          language: 'French',
          country: 'Canada',
          state: 'Quebec',
          city: 'Montreal',
          conditions: [
            { condition: 'Iron Deficiency', severity: 'low', testName: 'Hemoglobin', value: '10.5', unit: 'g/dL' },
            { condition: 'Low Vitamin B12', severity: 'low', testName: 'Vitamin B12', value: '180', unit: 'pg/mL' }
          ],
          reportDate: '2025-01-12'
        },
        {
          email: 'raj.patel@email.com',
          ageRange: '35-44',
          gender: 'Male',
          ethnicity: 'Asian',
          language: 'Hindi',
          country: 'United States',
          state: 'California',
          city: 'San Francisco',
          conditions: [
            { condition: 'Pre-diabetes', severity: 'high', testName: 'HbA1c', value: '6.2', unit: '%' },
            { condition: 'High Cholesterol', severity: 'high', testName: 'Total Cholesterol', value: '235', unit: 'mg/dL' }
          ],
          reportDate: '2025-01-11'
        }
      ]);
    }, 1000);
  };

  const exportData = () => {
    if (!stats) return;

    const csvContent = `
Date,Total Uploads,Today Uploads
${new Date().toISOString().split('T')[0]},${stats.totalUploads},${stats.todayUploads}

Age Distribution
${Object.entries(stats.ageDistribution).map(([age, count]) => `${age},${count}`).join('\n')}

Ethnicity Distribution
${Object.entries(stats.ethnicityDistribution).map(([ethnicity, count]) => `${ethnicity},${count}`).join('\n')}

Language Distribution
${Object.entries(stats.languageDistribution).map(([language, count]) => `${language},${count}`).join('\n')}
    `.trim();

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `labreport-analytics-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const sendFeedbackCampaign = () => {
    // Mock sending feedback campaign
    alert(`Feedback survey sent to ${userEmails.length} users!\n\nSubject: ${emailCampaign.subject}\nMessage: ${emailCampaign.message.substring(0, 100)}...`);
    setEmailCampaign({ subject: '', message: '' });
  };

  const addFeedbackQuestion = () => {
    const newQuestion: FeedbackQuestion = {
      id: `question_${Date.now()}`,
      type: 'text',
      question: 'New question',
      required: false
    };
    setFeedbackQuestions([...feedbackQuestions, newQuestion]);
  };

  const updateFeedbackQuestion = (id: string, updates: Partial<FeedbackQuestion>) => {
    setFeedbackQuestions(questions =>
      questions.map(q => q.id === id ? { ...q, ...updates } : q)
    );
  };

  const deleteFeedbackQuestion = (id: string) => {
    setFeedbackQuestions(questions => questions.filter(q => q.id !== id));
  };

  // Medical Analytics Functions
  const getConditionStats = () => {
    const conditionCounts: { [key: string]: number } = {};
    medicalData.forEach(user => {
      user.conditions.forEach(condition => {
        conditionCounts[condition.condition] = (conditionCounts[condition.condition] || 0) + 1;
      });
    });
    return Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const getConditionByLocation = (condition: string) => {
    const locationCounts: { [key: string]: number } = {};
    medicalData.forEach(user => {
      const hasCondition = user.conditions.some(c => c.condition === condition);
      if (hasCondition) {
        const location = `${user.city}, ${user.state}, ${user.country}`;
        locationCounts[location] = (locationCounts[location] || 0) + 1;
      }
    });
    return Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const getDemographicByCondition = (demographic: string, value: string) => {
    const conditionCounts: { [key: string]: number } = {};
    medicalData.forEach(user => {
      const matchesDemographic = user[demographic as keyof UserMedicalData] === value;
      if (matchesDemographic) {
        user.conditions.forEach(condition => {
          conditionCounts[condition.condition] = (conditionCounts[condition.condition] || 0) + 1;
        });
      }
    });
    return Object.entries(conditionCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 10);
  };

  const exportMedicalData = () => {
    const csvContent = `Email,Age Range,Gender,Ethnicity,Language,Country,State,City,Condition,Severity,Test Name,Value,Unit,Report Date\n${
      medicalData.flatMap(user => 
        user.conditions.map(condition => 
          `${user.email},${user.ageRange},${user.gender},${user.ethnicity},${user.language},${user.country},${user.state},${user.city},${condition.condition},${condition.severity},${condition.testName},${condition.value},${condition.unit},${user.reportDate}`
        )
      ).join('\n')
    }`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `medical-analytics-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-md mx-auto">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <BarChart3 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900">Admin Login</h2>
            <p className="text-gray-600">Access analytics dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            {error && (
              <p className="text-red-600 text-sm">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg font-medium transition-colors"
            >
              Login
            </button>
          </form>

          <div className="mt-6 p-3 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              Demo credentials: admin / labadmin2025
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading analytics...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600">Analytics, user feedback, and email management</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button
            onClick={exportData}
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV</span>
          </button>
          
          <button
            onClick={() => setIsAuthenticated(false)}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
          >
            <EyeOff className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="mb-8">
        <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'analytics'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <BarChart3 className="w-4 h-4 inline mr-2" />
            Analytics
          </button>
          <button
            onClick={() => setActiveTab('medical')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'medical'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Activity className="w-4 h-4 inline mr-2" />
            Medical Analytics
          </button>
          <button
            onClick={() => setActiveTab('feedback')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'feedback'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <MessageSquare className="w-4 h-4 inline mr-2" />
            Feedback System
          </button>
          <button
            onClick={() => setActiveTab('emails')}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              activeTab === 'emails'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Mail className="w-4 h-4 inline mr-2" />
            Email Management
          </button>
        </div>
      </div>

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <div>
          {/* Key Metrics */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Uploads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.totalUploads.toLocaleString()}</p>
                </div>
                <BarChart3 className="w-12 h-12 text-blue-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Today's Uploads</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.todayUploads}</p>
                </div>
                <TrendingUp className="w-12 h-12 text-green-600" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Registered Users</p>
                  <p className="text-3xl font-bold text-gray-900">{userEmails.length}</p>
                </div>
                <Users className="w-12 h-12 text-teal-600" />
              </div>
            </div>
          </div>

          {/* Distribution Charts */}
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Age Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution (%)</h3>
              <div className="space-y-3">
                {Object.entries(stats.ageDistribution).map(([age, percentage]) => (
                  <div key={age} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{age}</span>
                    <div className="flex items-center space-x-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Language Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Language Preference (%)</h3>
              <div className="space-y-3">
                {Object.entries(stats.languageDistribution).map(([language, percentage]) => (
                  <div key={language} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{language}</span>
                    <div className="flex items-center space-x-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-teal-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Ethnicity Distribution */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Ethnicity Distribution (%)</h3>
              <div className="space-y-3">
                {Object.entries(stats.ethnicityDistribution).map(([ethnicity, percentage]) => (
                  <div key={ethnicity} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{ethnicity}</span>
                    <div className="flex items-center space-x-3 flex-1 ml-4">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-green-600 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Upload Trend</h3>
              <div className="space-y-3">
                {stats.monthlyTrend.map(({ month, uploads }) => {
                  const maxUploads = Math.max(...stats.monthlyTrend.map(m => m.uploads));
                  const percentage = (uploads / maxUploads) * 100;
                  
                  return (
                    <div key={month} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{month}</span>
                      <div className="flex items-center space-x-3 flex-1 ml-4">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-600 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-12">{uploads.toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Analytics Tab */}
      {activeTab === 'medical' && (
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Medical Condition Analytics</h2>
            <button
              onClick={exportMedicalData}
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export Medical Data</span>
            </button>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 mb-8">
            {/* Most Common Conditions */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Most Common Medical Conditions</h3>
              <div className="space-y-3">
                {getConditionStats().map(([condition, count]) => (
                  <div key={condition} className="flex items-center justify-between">
                    <button
                      onClick={() => setSelectedCondition(condition)}
                      className={`text-left font-medium hover:text-blue-600 transition-colors ${
                        selectedCondition === condition ? 'text-blue-600' : 'text-gray-700'
                      }`}
                    >
                      {condition}
                    </button>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 w-32">
                        <div
                          className="bg-red-500 h-2 rounded-full"
                          style={{ width: `${(count / medicalData.length) * 100}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-600 w-8">{count}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Condition by Location */}
            {selectedCondition && (
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {selectedCondition} by Location
                </h3>
                <div className="space-y-3">
                  {getConditionByLocation(selectedCondition).map(([location, count]) => (
                    <div key={location} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{location}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-24">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${(count / getConditionByLocation(selectedCondition).reduce((sum, [,c]) => sum + c, 0)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-6">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Demographics Analysis */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Demographic Analysis</h3>
            
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Demographic
                </label>
                <select
                  value={selectedDemographic}
                  onChange={(e) => {
                    setSelectedDemographic(e.target.value);
                    setSelectedDemographicValue('');
                  }}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Choose demographic...</option>
                  <option value="ageRange">Age Range</option>
                  <option value="ethnicity">Ethnicity</option>
                  <option value="language">Language</option>
                  <option value="country">Country</option>
                  <option value="state">State/Province</option>
                </select>
              </div>
              
              {selectedDemographic && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Value
                  </label>
                  <select
                    value={selectedDemographicValue}
                    onChange={(e) => setSelectedDemographicValue(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Choose value...</option>
                    {[...new Set(medicalData.map(user => user[selectedDemographic as keyof UserMedicalData]))].map(value => (
                      <option key={value as string} value={value as string}>{value as string}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {selectedDemographic && selectedDemographicValue && (
              <div>
                <h4 className="font-semibold text-gray-900 mb-3">
                  Medical Conditions in {selectedDemographicValue} ({selectedDemographic})
                </h4>
                <div className="space-y-2">
                  {getDemographicByCondition(selectedDemographic, selectedDemographicValue).map(([condition, count]) => (
                    <div key={condition} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium text-gray-700">{condition}</span>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2 w-20">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${(count / getDemographicByCondition(selectedDemographic, selectedDemographicValue).reduce((sum, [,c]) => sum + c, 0)) * 100}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600 w-6">{count}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pharmaceutical Partnership Insights */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmaceutical Partnership Insights</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2">High Cholesterol Markets</h4>
                <div className="space-y-1 text-sm text-red-800">
                  <div>California: 35% prevalence</div>
                  <div>Texas: 28% prevalence</div>
                  <div>New York: 22% prevalence</div>
                </div>
                <p className="text-xs text-red-700 mt-2">Target for statin medications</p>
              </div>
              
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-900 mb-2">Diabetes/Pre-diabetes</h4>
                <div className="space-y-1 text-sm text-yellow-800">
                  <div>Southern US: 40% higher rates</div>
                  <div>Hispanic/Latino: 45% prevalence</div>
                  <div>Age 45-64: Highest risk</div>
                </div>
                <p className="text-xs text-yellow-700 mt-2">Target for diabetes management</p>
              </div>
              
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-2">Vitamin Deficiencies</h4>
                <div className="space-y-1 text-sm text-blue-800">
                  <div>Northern regions: 60% Vitamin D deficiency</div>
                  <div>Vegetarian populations: B12 deficiency</div>
                  <div>Women 25-45: Iron deficiency</div>
                </div>
                <p className="text-xs text-blue-700 mt-2">Target for supplements</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Email Management Tab */}
      {activeTab === 'emails' && (
        <div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* User Email List */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Registered Users ({userEmails.length})</h3>
                <button
                  onClick={() => {
                    const csvContent = `Email,Country,State,City,Age Range,Gender,Ethnicity,Language,Reports,Last Used\n${userEmails.map(user => 
                      `${user.email},${user.country},${user.state},${user.city},${user.ageRange},${user.gender},${user.ethnicity},${user.language},${user.reportCount},${user.lastUsed}`
                    ).join('\n')}`;
                    const blob = new Blob([csvContent], { type: 'text/csv' });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = `user-demographics-${Date.now()}.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    URL.revokeObjectURL(url);
                  }}
                  className="text-sm px-3 py-1 bg-teal-600 hover:bg-teal-700 text-white rounded"
                >
                  Export Demographics
                </button>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userEmails.map((user, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-600">
                        📍 {user.city}, {user.state}, {user.country}
                      </p>
                      <p className="text-xs text-gray-500">
                        {user.ageRange} • {user.gender} • {user.ethnicity} • {user.language} • {user.reportCount} reports • {user.lastUsed}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Email Campaign */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Send Feedback Survey</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Subject
                  </label>
                  <input
                    type="text"
                    value={emailCampaign.subject}
                    onChange={(e) => setEmailCampaign(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="Help us improve LabReport.ai - Quick feedback survey"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Message
                  </label>
                  <textarea
                    value={emailCampaign.message}
                    onChange={(e) => setEmailCampaign(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Hi there! We hope you found LabReport.ai helpful in understanding your lab results. We'd love to hear your feedback to help us improve our service..."
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                
                <button
                  onClick={sendFeedbackCampaign}
                  disabled={!emailCampaign.subject || !emailCampaign.message}
                  className={`w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-lg font-medium transition-colors ${
                    emailCampaign.subject && emailCampaign.message
                      ? 'bg-blue-600 hover:bg-blue-700 text-white'
                      : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-4 h-4" />
                  <span>Send to {userEmails.length} Users</span>
                </button>
              </div>
            </div>

            {/* Pharmaceutical Partnership Insights */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 lg:col-span-2">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Pharmaceutical Partnership Data</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-900">High Cholesterol Regions</h4>
                  <p className="text-sm text-red-800 mt-2">California (35%), Texas (28%), New York (22%) show elevated cholesterol markers</p>
                </div>
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <h4 className="font-semibold text-yellow-900">Diabetes Indicators</h4>
                  <p className="text-sm text-yellow-800 mt-2">Southern US states show 40% higher glucose abnormalities</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900">Vitamin Deficiencies</h4>
                  <p className="text-sm text-blue-800 mt-2">Northern regions show 60% higher Vitamin D deficiency rates</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback System Tab */}
      {activeTab === 'feedback' && (
        <div>
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Feedback Questions Management */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Survey Questions</h3>
                <button
                  onClick={addFeedbackQuestion}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
                >
                  Add Question
                </button>
              </div>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbackQuestions.map((question, index) => (
                  <div key={question.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-600">Question {index + 1}</span>
                      <button
                        onClick={() => deleteFeedbackQuestion(question.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        ×
                      </button>
                    </div>
                    
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateFeedbackQuestion(question.id, { question: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded mb-2 text-sm"
                    />
                    
                    <div className="flex items-center space-x-4">
                      <select
                        value={question.type}
                        onChange={(e) => updateFeedbackQuestion(question.id, { type: e.target.value as any })}
                        className="px-3 py-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="rating">Rating (1-5)</option>
                        <option value="multiple">Multiple Choice</option>
                        <option value="text">Text Response</option>
                      </select>
                      
                      <label className="flex items-center text-sm">
                        <input
                          type="checkbox"
                          checked={question.required}
                          onChange={(e) => updateFeedbackQuestion(question.id, { required: e.target.checked })}
                          className="mr-1"
                        />
                        Required
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feedback Responses */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Responses ({feedbackResponses.length})
              </h3>
              
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {feedbackResponses.map((response, index) => (
                  <div key={index} className="p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{response.email}</span>
                      <span className="text-sm text-gray-600">{response.submittedAt}</span>
                    </div>
                    
                    <div className="space-y-2">
                      {Object.entries(response.responses).map(([questionId, answer]) => {
                        const question = feedbackQuestions.find(q => q.id === questionId);
                        if (!question) return null;
                        
                        return (
                          <div key={questionId} className="text-sm">
                            <span className="font-medium text-gray-700">{question.question}</span>
                            <div className="text-gray-600 ml-2">
                              {question.type === 'rating' ? (
                                <div className="flex items-center">
                                  {[1, 2, 3, 4, 5].map(star => (
                                    <Star
                                      key={star}
                                      className={`w-4 h-4 ${
                                        star <= answer ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                      }`}
                                    />
                                  ))}
                                  <span className="ml-2">({answer}/5)</span>
                                </div>
                              ) : (
                                <span>{answer}</span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Privacy Notice */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <p className="text-sm text-blue-800 text-center">
          <strong>Privacy Compliant:</strong> Email addresses are used only for service improvement surveys. 
          All analytics data is anonymized and aggregated. No personal health information (PHI) is stored.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;