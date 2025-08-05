import React, { useState, useEffect } from 'react';
import { Shield, RefreshCw, Check } from 'lucide-react';

interface CaptchaVerificationProps {
  onSuccess: () => void;
}

const CaptchaVerification: React.FC<CaptchaVerificationProps> = ({ onSuccess }) => {
  const [captchaImages, setCaptchaImages] = useState<string[]>([]);
  const [selectedImages, setSelectedImages] = useState<number[]>([]);
  const [targetObject, setTargetObject] = useState<string>('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const objects = ['cars', 'traffic lights', 'crosswalks', 'bicycles', 'buses'];
  const sampleImages = [
    'https://images.pexels.com/photos/170811/cars-road-street-vehicles-170811.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/261985/pexels-photo-261985.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/1004409/pexels-photo-1004409.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/1149831/pexels-photo-1149831.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/544966/pexels-photo-544966.jpeg?w=200&h=200&fit=crop',
    'https://images.pexels.com/photos/170811/cars-road-street-vehicles-170811.jpeg?w=200&h=200&fit=crop'
  ];

  const generateCaptcha = () => {
    const randomObject = objects[Math.floor(Math.random() * objects.length)];
    setTargetObject(randomObject);
    setCaptchaImages(sampleImages);
    setSelectedImages([]);
    setError(null);
    setIsVerified(false);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleImageClick = (index: number) => {
    if (isVerified) return;
    
    setSelectedImages(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const handleVerify = () => {
    // Simple mock verification - in real app, this would validate against actual image content
    if (selectedImages.length > 0 && selectedImages.length <= 3) {
      setIsVerified(true);
      setError(null);
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      setError('Please select the images that contain the specified object.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto text-center">
      <Shield className="w-12 h-12 text-blue-600 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Security Verification</h2>
      <p className="text-gray-600 mb-8">
        Please complete this verification to prevent automated abuse
      </p>

      <div className="bg-gray-50 p-6 rounded-lg mb-6">
        <div className="flex items-center justify-between mb-4">
          <p className="text-sm font-medium text-gray-700">
            Select all images with <strong>{targetObject}</strong>
          </p>
          <button
            onClick={generateCaptcha}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm"
          >
            <RefreshCw className="w-4 h-4" />
            <span>New images</span>
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-4">
          {captchaImages.map((image, index) => (
            <div
              key={index}
              onClick={() => handleImageClick(index)}
              className={`relative cursor-pointer rounded-lg overflow-hidden transition-all ${
                selectedImages.includes(index)
                  ? 'ring-2 ring-blue-500 ring-offset-2'
                  : 'hover:opacity-80'
              } ${isVerified ? 'cursor-not-allowed' : ''}`}
            >
              <img
                src={image}
                alt={`Captcha option ${index + 1}`}
                className="w-full h-20 object-cover"
              />
              {selectedImages.includes(index) && (
                <div className="absolute inset-0 bg-blue-500 bg-opacity-30 flex items-center justify-center">
                  <Check className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm mb-4">{error}</p>
        )}

        {isVerified ? (
          <div className="flex items-center justify-center space-x-2 text-green-600">
            <Check className="w-5 h-5" />
            <span className="font-medium">Verified successfully!</span>
          </div>
        ) : (
          <button
            onClick={handleVerify}
            disabled={selectedImages.length === 0}
            className={`px-6 py-2 rounded-lg font-medium transition-colors ${
              selectedImages.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Verify
          </button>
        )}
      </div>

      <p className="text-xs text-gray-500">
        This helps us protect against automated systems and ensures the security of our service.
      </p>
    </div>
  );
};

export default CaptchaVerification;