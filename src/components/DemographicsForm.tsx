import React, { useState } from 'react';
import { User, Mail, MapPin, Globe } from 'lucide-react';
import type { DemographicsData } from './UploadInterface';

interface DemographicsFormProps {
  onSubmit: (data: DemographicsData) => void;
  fileName: string;
  gender: string;
}

const DemographicsForm: React.FC<DemographicsFormProps> = ({ onSubmit, fileName }) => {
  const [formData, setFormData] = useState<DemographicsData>({
    ageRange: '',
    ethnicity: '',
    language: 'English',
    email: '',
    country: '',
    state: '',
    city: '',
    gender: ''
  });

  const ageRanges = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+'];
  const ethnicities = ['White', 'Black/African American', 'Hispanic/Latino', 'Asian', 'Native American', 'Pacific Islander', 'Mixed/Other', 'Prefer not to say'];
  const languages = ['English', 'Spanish', 'French', 'Arabic', 'Russian', 'Bengali', 'Hindi', 'Urdu'];
  const genders = ['Male', 'Female', 'Prefer not to say'];
  
  const countries = [
    'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France', 'Spain', 'Italy', 
    'Netherlands', 'Belgium', 'Switzerland', 'Austria', 'Sweden', 'Norway', 'Denmark', 'Finland',
    'Mexico', 'Brazil', 'Argentina', 'Colombia', 'Chile', 'Peru', 'Venezuela', 'Ecuador',
    'India', 'China', 'Japan', 'South Korea', 'Singapore', 'Malaysia', 'Thailand', 'Philippines',
    'Indonesia', 'Vietnam', 'Bangladesh', 'Pakistan', 'Sri Lanka', 'Nepal', 'Myanmar',
    'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait', 'Bahrain', 'Oman', 'Jordan', 'Lebanon', 'Egypt',
    'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Morocco', 'Tunisia', 'Algeria', 'Ethiopia',
    'Russia', 'Ukraine', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria', 'Croatia',
    'Israel', 'Turkey', 'Iran', 'Iraq', 'Afghanistan', 'Other'
  ];

  const usStates = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky',
    'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi',
    'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico',
    'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
    'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah', 'Vermont',
    'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming', 'District of Columbia'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.ageRange && formData.ethnicity && formData.language && formData.email && formData.country && formData.state && formData.city) {
      onSubmit(formData);
    }
  };

  const isFormValid = formData.ageRange && formData.ethnicity && formData.language && formData.email && formData.country && formData.state && formData.city && formData.gender;

  const getStateLabel = () => {
    if (formData.country === 'United States') return 'State *';
    if (formData.country === 'Canada') return 'Province *';
    if (formData.country === 'United Kingdom') return 'County *';
    if (formData.country === 'Australia') return 'State/Territory *';
    if (formData.country === 'Germany') return 'State (Länder) *';
    if (formData.country === 'India') return 'State *';
    if (formData.country === 'Brazil') return 'State *';
    return 'State/Province/Region *';
  };

  return (
    <div>
      <div className="text-center mb-8">
        <div className="flex items-center justify-center space-x-2 mb-4">
          <User className="w-12 h-12 text-blue-600" />
          <MapPin className="w-8 h-8 text-teal-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
        <p className="text-gray-600">
          This helps us provide personalized explanations and improve healthcare insights for <strong>{fileName}</strong>
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md mx-auto">
        <div>
          <label htmlFor="ageRange" className="block text-sm font-medium text-gray-700 mb-2">
            Age Range *
          </label>
          <select
            id="ageRange"
            required
            value={formData.ageRange}
            onChange={(e) => setFormData(prev => ({ ...prev, ageRange: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select age range</option>
            {ageRanges.map(range => (
              <option key={range} value={range}>{range}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
            Gender *
          </label>
          <select
            id="gender"
            required
            value={formData.gender}
            onChange={(e) => setFormData(prev => ({ ...prev, gender: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select gender</option>
            {genders.map(gender => (
              <option key={gender} value={gender}>{gender}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="ethnicity" className="block text-sm font-medium text-gray-700 mb-2">
            Race/Ethnicity *
          </label>
          <select
            id="ethnicity"
            required
            value={formData.ethnicity}
            onChange={(e) => setFormData(prev => ({ ...prev, ethnicity: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select ethnicity</option>
            {ethnicities.map(ethnicity => (
              <option key={ethnicity} value={ethnicity}>{ethnicity}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-2">
            Preferred Language *
          </label>
          <select
            id="language"
            required
            value={formData.language}
            onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {languages.map(language => (
              <option key={language} value={language}>{language}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-2">
            <Globe className="w-4 h-4 inline mr-1" />
            Country *
          </label>
          <select
            id="country"
            required
            value={formData.country}
            onChange={(e) => setFormData(prev => ({ ...prev, country: e.target.value, state: '', city: '' }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select country</option>
            {countries.map(country => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        {formData.country && (
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              {getStateLabel()}
            </label>
            {formData.country === 'United States' ? (
              <select
                id="state"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select state</option>
                {usStates.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id="state"
                required
                value={formData.state}
                onChange={(e) => setFormData(prev => ({ ...prev, state: e.target.value }))}
                placeholder={
                  formData.country === 'Canada' ? 'e.g., Ontario, Quebec, British Columbia' :
                  formData.country === 'United Kingdom' ? 'e.g., London, Manchester, Birmingham' :
                  formData.country === 'Australia' ? 'e.g., New South Wales, Victoria, Queensland' :
                  formData.country === 'Germany' ? 'e.g., Bavaria, North Rhine-Westphalia' :
                  formData.country === 'India' ? 'e.g., Maharashtra, Karnataka, Tamil Nadu' :
                  formData.country === 'Brazil' ? 'e.g., São Paulo, Rio de Janeiro, Minas Gerais' :
                  'Enter your state/province/region'
                }
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
          </div>
        )}

        {formData.country && formData.state && (
          <div>
            <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-2">
              <MapPin className="w-4 h-4 inline mr-1" />
              City *
            </label>
            <input
              type="text"
              id="city"
              required
              value={formData.city}
              onChange={(e) => setFormData(prev => ({ ...prev, city: e.target.value }))}
              placeholder="Enter your city"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        )}

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            required
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="your@email.com"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <p className="text-xs text-gray-500 mt-1">Required for service improvements and follow-up surveys (never shared with third parties)</p>
        </div>

        <button
          type="submit"
          disabled={!isFormValid}
          className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
            isFormValid
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Verification
        </button>
      </form>

      <div className="mt-8 p-4 bg-teal-50 rounded-lg">
        <p className="text-sm text-teal-800 text-center">
          <strong>Privacy Protected:</strong> Your email is used only for service improvement surveys and important updates. 
          Location and demographic data helps us improve healthcare insights and connect patients with relevant medical resources in their area.
          All personal health information (PHI) is automatically removed and never stored.
        </p>
      </div>
    </div>
  );
};

export default DemographicsForm;