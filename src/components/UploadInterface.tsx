import React, { useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import FileUploader from './FileUploader';
import DemographicsForm from './DemographicsForm';
import CaptchaVerification from './CaptchaVerification';
import ResultsDisplay from './ResultsDisplay';
import LabReportEncryption from '../utils/encryption';

export interface DemographicsData {
  ageRange: string;
  ethnicity: string;
  language: string;
  email: string;
  country: string;
  state: string;
  city: string;
  gender: string;
}

type Step = 'upload' | 'demographics' | 'captcha' | 'processing' | 'results';

const UploadInterface: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<Step>('upload');
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [demographics, setDemographics] = useState<DemographicsData | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [encryptionKey, setEncryptionKey] = useState<CryptoKey | null>(null);

  const handleFileUpload = useCallback((file: File) => {
    setUploadedFile(file);
    setCurrentStep('demographics');
  }, []);

  const handleDemographicsSubmit = async (data: DemographicsData) => {
    setDemographics(data);
    
    // Generate encryption key and securely store demographics
    try {
      const key = await LabReportEncryption.generateKey();
      setEncryptionKey(key);
      
      // Store encrypted demographics data
      await LabReportEncryption.secureStore('user_demographics', data, key);
      
      // Store anonymized hash for admin analytics (non-reversible)
      const analyticsHash = await LabReportEncryption.hashForAnalytics(data.email);
      console.log('User analytics hash stored:', analyticsHash);
      
    } catch (error) {
      console.error('Encryption setup failed:', error);
    }
    
    setCurrentStep('captcha');
  };

  const handleCaptchaSuccess = async () => {
    setCurrentStep('processing');
    
    // Simulate processing with encrypted storage
    setTimeout(() => {
      // Comprehensive lab results based on typical comprehensive metabolic panel + CBC + lipid panel
      const results = {
        summary: getTranslatedSummary(demographics?.language || 'English'),
        overallStatus: 'attention',
        categories: [
          {
            name: getTranslatedCategoryName('Basic Metabolic Panel', demographics?.language || 'English'),
            chartData: [85, 88, 92, 95, 98],
            results: [
              {
                category: 'metabolic',
                name: getTranslatedTestName('Glucose', demographics?.language || 'English'),
                value: '98',
                unit: 'mg/dL',
                status: 'normal',
                range: '70-100 mg/dL',
                explanation: getTranslatedExplanation('glucose_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('glucose', demographics?.language || 'English'),
                importance: getTranslatedImportance('glucose', demographics?.language || 'English')
              },
              {
                category: 'metabolic',
                name: getTranslatedTestName('Creatinine', demographics?.language || 'English'),
                value: '0.9',
                unit: 'mg/dL',
                status: 'normal',
                range: '0.6-1.3 mg/dL',
                explanation: getTranslatedExplanation('creatinine_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('creatinine', demographics?.language || 'English'),
                importance: getTranslatedImportance('creatinine', demographics?.language || 'English')
              },
              {
                category: 'metabolic',
                name: getTranslatedTestName('Sodium', demographics?.language || 'English'),
                value: '142',
                unit: 'mEq/L',
                status: 'normal',
                range: '136-145 mEq/L',
                explanation: getTranslatedExplanation('sodium_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('sodium', demographics?.language || 'English'),
                importance: getTranslatedImportance('sodium', demographics?.language || 'English')
              }
            ]
          },
          {
            name: getTranslatedCategoryName('Complete Blood Count', demographics?.language || 'English'),
            chartData: [12.5, 13.1, 13.8, 14.2, 14.5],
            results: [
              {
                category: 'blood',
                name: getTranslatedTestName('Hemoglobin', demographics?.language || 'English'),
                value: '14.2',
                unit: 'g/dL',
                status: 'normal',
                range: '12.0-16.0 g/dL',
                explanation: getTranslatedExplanation('hemoglobin_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('hemoglobin', demographics?.language || 'English'),
                importance: getTranslatedImportance('hemoglobin', demographics?.language || 'English')
              },
              {
                category: 'blood',
                name: getTranslatedTestName('White Blood Cells', demographics?.language || 'English'),
                value: '7.2',
                unit: 'K/uL',
                status: 'normal',
                range: '4.0-11.0 K/uL',
                explanation: getTranslatedExplanation('wbc_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('wbc', demographics?.language || 'English'),
                importance: getTranslatedImportance('wbc', demographics?.language || 'English')
              },
              {
                category: 'blood',
                name: getTranslatedTestName('Platelets', demographics?.language || 'English'),
                value: '285',
                unit: 'K/uL',
                status: 'normal',
                range: '150-450 K/uL',
                explanation: getTranslatedExplanation('platelets_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('platelets', demographics?.language || 'English'),
                importance: getTranslatedImportance('platelets', demographics?.language || 'English')
              }
            ]
          },
          {
            name: getTranslatedCategoryName('Lipid Panel', demographics?.language || 'English'),
            chartData: [180, 195, 210, 225, 240],
            results: [
              {
                category: 'lipids',
                name: getTranslatedTestName('Total Cholesterol', demographics?.language || 'English'),
                value: '225',
                unit: 'mg/dL',
                status: 'high',
                range: '<200 mg/dL',
                explanation: getTranslatedExplanation('cholesterol_high', demographics?.language || 'English'),
                definition: getTranslatedDefinition('cholesterol', demographics?.language || 'English'),
                importance: getTranslatedImportance('cholesterol', demographics?.language || 'English')
              },
              {
                category: 'lipids',
                name: getTranslatedTestName('HDL (Good Cholesterol)', demographics?.language || 'English'),
                value: '45',
                unit: 'mg/dL',
                status: 'low',
                range: '>40 mg/dL (men), >50 mg/dL (women)',
                explanation: getTranslatedExplanation('hdl_low', demographics?.language || 'English'),
                definition: getTranslatedDefinition('hdl', demographics?.language || 'English'),
                importance: getTranslatedImportance('hdl', demographics?.language || 'English')
              },
              {
                category: 'lipids',
                name: getTranslatedTestName('Triglycerides', demographics?.language || 'English'),
                value: '180',
                unit: 'mg/dL',
                status: 'high',
                range: '<150 mg/dL',
                explanation: getTranslatedExplanation('triglycerides_high', demographics?.language || 'English'),
                definition: getTranslatedDefinition('triglycerides', demographics?.language || 'English'),
                importance: getTranslatedImportance('triglycerides', demographics?.language || 'English')
              }
            ]
          },
          {
            name: getTranslatedCategoryName('Liver Function', demographics?.language || 'English'),
            chartData: [25, 28, 32, 35, 38],
            results: [
              {
                category: 'liver',
                name: getTranslatedTestName('ALT (Liver Enzyme)', demographics?.language || 'English'),
                value: '32',
                unit: 'U/L',
                status: 'normal',
                range: '7-56 U/L',
                explanation: getTranslatedExplanation('alt_normal', demographics?.language || 'English'),
                definition: getTranslatedDefinition('alt', demographics?.language || 'English'),
                importance: getTranslatedImportance('alt', demographics?.language || 'English')
              }
            ]
          }
        ]
      };
      
      // Encrypt and store results if encryption key is available
      if (encryptionKey) {
        LabReportEncryption.secureStore('lab_results', results, encryptionKey)
          .catch(error => console.error('Failed to encrypt lab results:', error));
      }
      
      setAnalysisResults(results);
      setCurrentStep('results');
    }, 3000);
  };

  // Translation helper functions
  const getTranslatedSummary = (language: string) => {
    const summaries = {
      'English': 'Your lab results show an overall good picture with some areas needing attention. Your kidney and liver function are excellent. Your blood count is in normal ranges. However, your cholesterol and triglycerides are elevated, suggesting dietary and exercise changes. Your blood sugar is at the upper normal limit.',
      'Spanish': 'Sus resultados de laboratorio muestran un panorama general bueno con algunas áreas que necesitan atención. Su función renal y hepática están excelentes. Su recuento sanguíneo está en rangos normales. Sin embargo, su colesterol y triglicéridos están elevados, lo que sugiere hacer cambios en la dieta y ejercicio. Su azúcar en sangre está en el límite superior normal.',
      'French': 'Vos résultats de laboratoire montrent un tableau général bon avec quelques domaines nécessitant une attention. Votre fonction rénale et hépatique sont excellentes. Votre numération sanguine est dans les plages normales. Cependant, votre cholestérol et triglycérides sont élevés, suggérant des changements alimentaires et d\'exercice. Votre glycémie est à la limite supérieure normale.',
      'Arabic': 'تُظهر نتائج فحوصاتك المخبرية صورة عامة جيدة مع بعض المناطق التي تحتاج إلى انتباه. وظائف الكلى والكبد ممتازة. تعداد الدم في المعدلات الطبيعية. ومع ذلك، الكوليسترول والدهون الثلاثية مرتفعة، مما يشير إلى ضرورة تغيير النظام الغذائي والتمارين. سكر الدم في الحد الأعلى الطبيعي.',
      'Russian': 'Ваши результаты анализов показывают в целом хорошую картину с некоторыми областями, требующими внимания. Функция почек и печени отличная. Показатели крови в норме. Однако холестерин и триглицериды повышены, что предполагает изменения в диете и физических упражнениях. Уровень сахара в крови на верхней границе нормы.',
      'Bengali': 'আপনার ল্যাব ফলাফল সামগ্রিকভাবে ভাল চিত্র দেখায় কিছু ক্ষেত্রে মনোযোগের প্রয়োজন। আপনার কিডনি এবং লিভারের কার্যকারিতা চমৎকার। আপনার রক্তের সংখ্যা স্বাভাবিক পরিসরে। তবে, আপনার কোলেস্টেরল এবং ট্রাইগ্লিসারাইড বৃদ্ধি পেয়েছে, যা খাদ্যাভ্যাস এবং ব্যায়ামের পরিবর্তনের পরামর্শ দেয়। আপনার রক্তের চিনি উচ্চ স্বাভাবিক সীমায়।',
      'Hindi': 'आपके लैब परिणाम कुछ क्षेत्रों में ध्यान देने की आवश्यकता के साथ समग्र रूप से अच्छी तस्वीर दिखाते हैं। आपकी किडनी और लिवर का कार्य उत्कृष्ट है। आपका रक्त गिनती सामान्य सीमा में है। हालांकि, आपका कोलेस्ट्रॉल और ट्राइग्लिसराइड्स बढ़े हुए हैं, जो आहार और व्यायाम में बदलाव का सुझाव देते हैं। आपका रक्त शर्करा उच्च सामान्य सीमा पर है।',
      'Urdu': 'آپ کے لیب کے نتائج کچھ علاقوں میں توجہ کی ضرورت کے ساتھ مجموعی طور پر اچھی تصویر دکھاتے ہیں۔ آپ کے گردے اور جگر کا کام بہترین ہے۔ آپ کا خون کی گنتی عام حد میں ہے۔ تاہم، آپ کا کولیسٹرول اور ٹرائگلیسرائیڈز بلند ہیں، جو غذا اور ورزش میں تبدیلیوں کا مشورہ دیتے ہیں۔ آپ کا خون کی شکر اعلیٰ عام حد پر ہے۔'
    };
    return summaries[language] || summaries['English'];
  };

  const getTranslatedCategoryName = (category: string, language: string) => {
    const translations = {
      'Basic Metabolic Panel': {
        'English': 'Basic Metabolic Panel',
        'Spanish': 'Panel Metabólico Básico',
        'French': 'Panel Métabolique de Base',
        'Arabic': 'الفحص الأيضي الأساسي',
        'Russian': 'Основная метаболическая панель',
        'Bengali': 'মৌলিক বিপাকীয় প্যানেল',
        'Hindi': 'बुनियादी चयापचय पैनल',
        'Urdu': 'بنیادی میٹابولک پینل'
      },
      'Complete Blood Count': {
        'English': 'Complete Blood Count',
        'Spanish': 'Recuento Sanguíneo Completo',
        'French': 'Numération Sanguine Complète',
        'Arabic': 'تعداد الدم الكامل',
        'Russian': 'Общий анализ крови',
        'Bengali': 'সম্পূর্ণ রক্ত গণনা',
        'Hindi': 'पूर्ण रक्त गणना',
        'Urdu': 'مکمل خون کی گنتی'
      },
      'Lipid Panel': {
        'English': 'Lipid Panel',
        'Spanish': 'Panel de Lípidos',
        'French': 'Panel Lipidique',
        'Arabic': 'فحص الدهون',
        'Russian': 'Липидная панель',
        'Bengali': 'লিপিড প্যানেল',
        'Hindi': 'लिपिड पैनल',
        'Urdu': 'لپڈ پینل'
      },
      'Liver Function': {
        'English': 'Liver Function',
        'Spanish': 'Función Hepática',
        'French': 'Fonction Hépatique',
        'Arabic': 'وظائف الكبد',
        'Russian': 'Функция печени',
        'Bengali': 'লিভার ফাংশন',
        'Hindi': 'लिवर फंक्शन',
        'Urdu': 'جگر کا فنکشن'
      }
    };
    return translations[category]?.[language] || translations[category]?.['English'] || category;
  };

  const getTranslatedTestName = (test: string, language: string) => {
    const translations = {
      'Glucose': {
        'English': 'Glucose',
        'Spanish': 'Glucosa',
        'French': 'Glucose',
        'Arabic': 'الجلوكوز',
        'Russian': 'Глюкоза',
        'Bengali': 'গ্লুকোজ',
        'Hindi': 'ग्लूकोज',
        'Urdu': 'گلوکوز'
      },
      'Creatinine': {
        'English': 'Creatinine',
        'Spanish': 'Creatinina',
        'French': 'Créatinine',
        'Arabic': 'الكرياتينين',
        'Russian': 'Креатинин',
        'Bengali': 'ক্রিয়েটিনিন',
        'Hindi': 'क्रिएटिनिन',
        'Urdu': 'کریٹینین'
      },
      'Sodium': {
        'English': 'Sodium',
        'Spanish': 'Sodio',
        'French': 'Sodium',
        'Arabic': 'الصوديوم',
        'Russian': 'Натрий',
        'Bengali': 'সোডিয়াম',
        'Hindi': 'सोडियम',
        'Urdu': 'سوڈیم'
      },
      'Hemoglobin': {
        'English': 'Hemoglobin',
        'Spanish': 'Hemoglobina',
        'French': 'Hémoglobine',
        'Arabic': 'الهيموجلوبين',
        'Russian': 'Гемоглобин',
        'Bengali': 'হিমোগ্লোবিন',
        'Hindi': 'हीमोग्लोबिन',
        'Urdu': 'ہیموگلوبن'
      },
      'White Blood Cells': {
        'English': 'White Blood Cells',
        'Spanish': 'Glóbulos Blancos',
        'French': 'Globules Blancs',
        'Arabic': 'خلايا الدم البيضاء',
        'Russian': 'Лейкоциты',
        'Bengali': 'শ্বেত রক্তকণিকা',
        'Hindi': 'श्वेत रक्त कोशिकाएं',
        'Urdu': 'سفید خون کے خلیے'
      },
      'Platelets': {
        'English': 'Platelets',
        'Spanish': 'Plaquetas',
        'French': 'Plaquettes',
        'Arabic': 'الصفائح الدموية',
        'Russian': 'Тромбоциты',
        'Bengali': 'প্লেটলেট',
        'Hindi': 'प्लेटलेट्स',
        'Urdu': 'پلیٹلیٹس'
      },
      'Total Cholesterol': {
        'English': 'Total Cholesterol',
        'Spanish': 'Colesterol Total',
        'French': 'Cholestérol Total',
        'Arabic': 'الكوليسترول الكلي',
        'Russian': 'Общий холестерин',
        'Bengali': 'মোট কোলেস্টেরল',
        'Hindi': 'कुल कोलेस्ट्रॉल',
        'Urdu': 'کل کولیسٹرول'
      },
      'HDL (Good Cholesterol)': {
        'English': 'HDL (Good Cholesterol)',
        'Spanish': 'HDL (Colesterol Bueno)',
        'French': 'HDL (Bon Cholestérol)',
        'Arabic': 'الكوليسترول الجيد',
        'Russian': 'ЛПВП (хороший холестерин)',
        'Bengali': 'এইচডিএল (ভাল কোলেস্টেরল)',
        'Hindi': 'एचडीएल (अच्छा कोलेस्ट्रॉल)',
        'Urdu': 'ایچ ڈی ایل (اچھا کولیسٹرول)'
      },
      'Triglycerides': {
        'English': 'Triglycerides',
        'Spanish': 'Triglicéridos',
        'French': 'Triglycérides',
        'Arabic': 'الدهون الثلاثية',
        'Russian': 'Триглицериды',
        'Bengali': 'ট্রাইগ্লিসারাইড',
        'Hindi': 'ट्राइग्लिसराइड्स',
        'Urdu': 'ٹرائگلیسرائیڈز'
      },
      'ALT (Liver Enzyme)': {
        'English': 'ALT (Liver Enzyme)',
        'Spanish': 'ALT (Enzima Hepática)',
        'French': 'ALT (Enzyme Hépatique)',
        'Arabic': 'إنزيم الكبد',
        'Russian': 'АЛТ (печеночный фермент)',
        'Bengali': 'এএলটি (লিভার এনজাইম)',
        'Hindi': 'एएलटी (लिवर एंजाइम)',
        'Urdu': 'اے ایل ٹی (جگر کا انزائم)'
      }
    };
    return translations[test]?.[language] || translations[test]?.['English'] || test;
  };

  const getTranslatedExplanation = (key: string, language: string) => {
    const explanations = {
      'glucose_normal': {
        'English': 'Your sugar is at the upper normal limit. Consider reducing refined sugars.',
        'Spanish': 'Su azúcar está en el límite superior normal. Considere reducir azúcares refinados.',
        'French': 'Votre sucre est à la limite supérieure normale. Considérez réduire les sucres raffinés.',
        'Arabic': 'السكر في الحد الأعلى الطبيعي. فكر في تقليل السكريات المكررة.',
        'Russian': 'Ваш сахар на верхней границе нормы. Рассмотрите возможность сокращения рафинированных сахаров.',
        'Bengali': 'আপনার চিনি উচ্চ স্বাভাবিক সীমায়। পরিশোধিত চিনি কমানোর কথা বিবেচনা করুন।',
        'Hindi': 'आपकी चीनी उच्च सामान्य सीमा पर है। परिष्कृत चीनी कम करने पर विचार करें।',
        'Urdu': 'آپ کی شکر اعلیٰ عام حد پر ہے۔ صاف شدہ چینی کم کرنے پر غور کریں۔'
      },
      'creatinine_normal': {
        'English': 'Excellent - your kidneys are filtering waste perfectly.',
        'Spanish': 'Excelente - sus riñones están filtrando los desechos perfectamente.',
        'French': 'Excellent - vos reins filtrent parfaitement les déchets.',
        'Arabic': 'ممتاز - كليتاك تقومان بترشيح الفضلات بشكل مثالي.',
        'Russian': 'Отлично - ваши почки идеально фильтруют отходы.',
        'Bengali': 'চমৎকার - আপনার কিডনি বর্জ্য নিখুঁতভাবে ফিল্টার করছে।',
        'Hindi': 'उत्कृष्ट - आपकी किडनी अपशिष्ट को पूर्ণ रूप से फिल्टर कर रही है।',
        'Urdu': 'بہترین - آپ کے گردے فضلہ کو بالکل ٹھیک سے فلٹر کر رہے ہیں۔'
      },
      'sodium_normal': {
        'English': 'Perfect - the salt balance in your body is well regulated.',
        'Spanish': 'Perfecto - el equilibrio de sal en su cuerpo está bien regulado.',
        'French': 'Parfait - l\'équilibre du sel dans votre corps est bien régulé.',
        'Arabic': 'مثالي - توازن الملح في جسمك منظم بشكل جيد.',
        'Russian': 'Идеально - солевой баланс в вашем организме хорошо регулируется.',
        'Bengali': 'নিখুঁত - আপনার শরীরে লবণের ভারসাম্য ভালভাবে নিয়ন্ত্রিত।',
        'Hindi': 'परफेक्ट - आपके शरीर में नमक का संतुलन अच्छी तरह से नियंत्रित है।',
        'Urdu': 'بہترین - آپ کے جسم میں نمک کا توازن اچھی طرح سے منظم ہے۔'
      },
      'hemoglobin_normal': {
        'English': 'Excellent - your red blood cells are carrying oxygen efficiently.',
        'Spanish': 'Excelente - sus glóbulos rojos están transportando oxígeno eficientemente.',
        'French': 'Excellent - vos globules rouges transportent efficacement l\'oxygène.',
        'Arabic': 'ممتاز - خلايا الدم الحمراء تنقل الأكسجين بكفاءة.',
        'Russian': 'Отлично - ваши эритроциты эффективно переносят кислород.',
        'Bengali': 'চমৎকার - আপনার লাল রক্তকণিকা দক্ষতার সাথে অক্সিজেন বহন করছে।',
        'Hindi': 'उत्कृष्ট - आपकी लाल रक्त कोशिकाएं कुशलता से ऑक्सीजन ले जा रही हैं।',
        'Urdu': 'بہترین - آپ کے سرخ خون کے خلیے مؤثر طریقے سے آکسیجن لے جا رہے ہیں۔'
      },
      'wbc_normal': {
        'English': 'Normal - your immune system is working well.',
        'Spanish': 'Normal - su sistema inmunológico está funcionando bien.',
        'French': 'Normal - votre système immunitaire fonctionne bien.',
        'Arabic': 'طبيعي - جهازك المناعي يعمل بشكل جيد.',
        'Russian': 'Нормально - ваша иммунная система работает хорошо.',
        'Bengali': 'স্বাভাবিক - আপনার রোগ প্রতিরোধ ব্যবস্থা ভালভাবে কাজ করছে।',
        'Hindi': 'सामान्य - आपकी प्रतिरक्षा प्रणाली अच्छी तरह से काम कर रही है।',
        'Urdu': 'عام - آپ کا مدافعتی نظام اچھی طرح کام کر رہا ہے۔'
      },
      'platelets_normal': {
        'English': 'Perfect - your blood can clot normally to stop bleeding.',
        'Spanish': 'Perfecto - su sangre puede coagular normalmente para detener el sangrado.',
        'French': 'Parfait - votre sang peut coaguler normalement pour arrêter les saignements.',
        'Arabic': 'مثالي - دمك يمكن أن يتجلط بشكل طبيعي لوقف النزيف.',
        'Russian': 'Идеально - ваша кровь может нормально свертываться, чтобы остановить кровотечение.',
        'Bengali': 'নিখুঁত - আপনার রক্ত রক্তপাত বন্ধ করতে স্বাভাবিকভাবে জমাট বাঁধতে পারে।',
        'Hindi': 'परफेक्ट - आपका खून रक्तस्राव रोकने के लिए सामान्य रूप से जम सकता है।',
        'Urdu': 'بہترین - آپ کا خون خون بہنا رोکنے کے لیے عام طور پر جم سکتا ہے۔'
      },
      'cholesterol_high': {
        'English': 'High - consider a diet low in saturated fats and more cardiovascular exercise.',
        'Spanish': 'Alto - considere una dieta baja en grasas saturadas y más ejercicio cardiovascular.',
        'French': 'Élevé - considérez un régime pauvre en graisses saturées et plus d\'exercice cardiovasculaire.',
        'Arabic': 'مرتفع - فكر في نظام غذائي قليل الدهون المشبعة والمزيد من التمارين القلبية.',
        'Russian': 'Высокий - рассмотрите диету с низким содержанием насыщенных жиров и больше кардиоупражнений.',
        'Bengali': 'উচ্চ - স্যাচুরেটেড ফ্যাট কম এবং আরও কার্ডিওভাসকুলার ব্যায়াম সহ একটি ডায়েট বিবেচনা করুন।',
        'Hindi': 'उच्च - संतृप्त वसा में कम आहार और अधिक हृदय व्यायाम पर विचार करें।',
        'Urdu': 'زیادہ - سیر شدہ چکنائی میں کم غذا اور زیادہ دل کی ورزش پر غور کریں۔'
      },
      'hdl_low': {
        'English': 'Low - try to increase with regular exercise and healthy fats like avocado and nuts.',
        'Spanish': 'Bajo - trate de aumentar con ejercicio regular y grasas saludables como aguacate y nueces.',
        'French': 'Bas - essayez d\'augmenter avec de l\'exercice régulier et des graisses saines comme l\'avocat et les noix.',
        'Arabic': 'منخفض - حاول الزيادة بالتمارين المنتظمة والدهون الصحية مثل الأفوكادو والمكسرات.',
        'Russian': 'Низкий - попробуйте увеличить регулярными упражнениями и здоровыми жирами, такими как авокадо и орехи.',
        'Bengali': 'কম - নিয়মিত ব্যায়াম এবং অ্যাভোকাডো এবং বাদামের মতো স্বাস্থ্যকর চর্বি দিয়ে বাড়ানোর চেষ্টা করুন।',
        'Hindi': 'कम - नियमित व्यायाम और एवोकाडो और नट्स जैसी स्वस्थ वसा के साथ बढ़ाने की कोशिश करें।',
        'Urdu': 'کم - باقاعدگی سے ورزش اور ایوکاڈو اور گری دار میوے جیسی صحت مند چکنائی سے بڑھانے کی کوشش کریں۔'
      },
      'triglycerides_high': {
        'English': 'High - reduce sugars, refined carbs, and alcohol. Increase exercise.',
        'Spanish': 'Alto - reduzca azúcares, carbohidratos refinados y alcohol. Aumente el ejercicio.',
        'French': 'Élevé - réduisez les sucres, glucides raffinés et alcool. Augmentez l\'exercice.',
        'Arabic': 'مرتفع - قلل السكريات والكربوهيدرات المكررة والكحول. زد التمارين.',
        'Russian': 'Высокий - уменьшите сахара, рафинированные углеводы и алкоголь. Увеличьте физические упражнения.',
        'Bengali': 'উচ্চ - চিনি, পরিশোধিত কার্বোহাইড্রেট এবং অ্যালকোহল কমান। ব্যায়াম বাড়ান।',
        'Hindi': 'उच्च - चीनी, परिष्कृत कार्बोहाइड्रेट और शराब कम करें। व्यायाम बढ़ाएं।',
        'Urdu': 'زیادہ - چینی، صاف شدہ کاربوہائیڈریٹس اور شراب کم کریں۔ ورزش بڑھائیں۔'
      },
      'alt_normal': {
        'English': 'Normal - your liver is processing toxins and producing proteins efficiently.',
        'Spanish': 'Normal - su hígado está procesando toxinas y produciendo proteínas eficientemente.',
        'French': 'Normal - votre foie traite les toxines et produit des protéines efficacement.',
        'Arabic': 'طبيعي - كبدك يعالج السموم وينتج البروتينات بكفاءة.',
        'Russian': 'Нормально - ваша печень эффективно обрабатывает токсины и производит белки.',
        'Bengali': 'স্বাভাবিক - আপনার লিভার দক্ষতার সাথে বিষাক্ত পদার্থ প্রক্রিয়াজাত করছে এবং প্রোটিন উৎপাদন করছে।',
        'Hindi': 'सामान्य - आपका लिवर कुशलता से विषाक्त पदার्थों को संसाधित कर रहा है और प्रोटीन का उत्पादन कर रहा है।',
        'Urdu': 'عام - آپ کا جگر مؤثر طریقے سے زہریلے مادوں کو پروسیس کر رہا ہے اور پروٹین بنا رہا ہے۔'
      }
    };
    return explanations[key]?.[language] || explanations[key]?.['English'] || '';
  };

  const getTranslatedDefinition = (test: string, language: string) => {
    const definitions = {
      'glucose': {
        'English': 'Glucose is the main sugar in your blood that provides energy to your cells.',
        'Spanish': 'La glucosa es el azúcar principal en su sangre que proporciona energía a sus células.',
        'French': 'Le glucose est le sucre principal dans votre sang qui fournit de l\'énergie à vos cellules.',
        'Arabic': 'الجلوكوز هو السكر الرئيسي في دمك الذي يوفر الطاقة لخلاياك.',
        'Russian': 'Глюкоза - это основной сахар в вашей крови, который обеспечивает энергией ваши клетки.',
        'Bengali': 'গ্লুকোজ আপনার রক্তের প্রধান চিনি যা আপনার কোষগুলিতে শক্তি সরবরাহ করে।',
        'Hindi': 'ग्लूकोज आपके रक्त में मुख्य चीनी है जो आपकी कोशिकाओं को ऊर्जा प्रदान करती है।',
        'Urdu': 'گلوکوز آپ کے خون میں اصل چینی ہے جو آپ کے خلیوں کو توانائی فراہم کرتی ہے۔'
      },
      'creatinine': {
        'English': 'Creatinine is a muscle waste product that your kidneys filter from blood.',
        'Spanish': 'La creatinina es un producto de desecho muscular que sus riñones filtran de la sangre.',
        'French': 'La créatinine est un déchet musculaire que vos reins filtrent du sang.',
        'Arabic': 'الكرياتينين هو فضلات عضلية تقوم الكلى بترشيحها من الدم.',
        'Russian': 'Креатинин - это мышечный продукт отходов, который ваши почки фильтруют из крови.',
        'Bengali': 'ক্রিয়েটিনিন একটি পেশী বর্জ্য পণ্য যা আপনার কিডনি রক্ত থেকে ফিল্টার করে।',
        'Hindi': 'क्रिएटिनिन एक मांसपेशी अपशिष्ट उत्पाद है जिसे आपकी किडनी रक्त से फिल्टर करती है।',
        'Urdu': 'کریٹینین ایک پٹھوں کا فضلہ ہے جسے آپ کے گردے خون سے فلٹر کرتے ہیں۔'
      }
      // Add more definitions as needed...
    };
    return definitions[test]?.[language] || definitions[test]?.['English'] || '';
  };

  const getTranslatedImportance = (test: string, language: string) => {
    const importance = {
      'glucose': {
        'English': 'High levels may indicate diabetes or prediabetes. Low levels can cause symptoms like dizziness.',
        'Spanish': 'Niveles altos pueden indicar diabetes o prediabetes. Niveles bajos pueden causar síntomas como mareos.',
        'French': 'Des niveaux élevés peuvent indiquer le diabète ou le prédiabète. Des niveaux bas peuvent causer des symptômes comme des étourdissements.',
        'Arabic': 'المستويات العالية قد تشير إلى السكري أو ما قبل السكري. المستويات المنخفضة قد تسبب أعراضاً مثل الدوخة.',
        'Russian': 'Высокие уровни могут указывать на диабет или преддиабет. Низкие уровни могут вызывать симптомы, такие как головокружение.',
        'Bengali': 'উচ্চ মাত্রা ডায়াবেটিস বা প্রি-ডায়াবেটিস নির্দেশ করতে পারে। নিম্ন মাত্রা মাথা ঘোরার মতো লক্ষণ সৃষ্টি করতে পারে।',
        'Hindi': 'उच्च स्तर मधुमेह या प्री-डायबिटीज का संकेत दे सकते हैं। कम स्तर चक্कर आने जैसे लक्षण पैदा कर सकते हैं।',
        'Urdu': 'اعلیٰ سطح ذیابیطس یا پری ڈایابیٹس کا اشارہ دے سکتی ہے۔ کم سطح چکر آنے جیسی علامات پیدا کر سکتی ہے۔'
      },
      'creatinine': {
        'English': 'High levels may indicate kidney problems. It\'s a key marker of kidney function.',
        'Spanish': 'Niveles altos pueden indicar problemas renales. Es un marcador clave de la función renal.',
        'French': 'Des niveaux élevés peuvent indiquer des problèmes rénaux. C\'est un marqueur clé de la fonction rénale.',
        'Arabic': 'المستويات العالية قد تشير إلى مشاكل في الكلى. إنه مؤشر رئيسي لوظائف الكلى.',
        'Russian': 'Высокие уровни могут указывать на проблемы с почками. Это ключевой маркер функции почек.',
        'Bengali': 'উচ্চ মাত্রা কিডনির সমস্যা নির্দেশ করতে পারে। এটি কিডনি ফাংশনের একটি মূল চিহ্নিতকারী।',
        'Hindi': 'उच्च स्तर किडनी की समस्याओं का संकेत दे सकते हैं। यह किडनी फंक्शन का एक मुख्य मार्कर है।',
        'Urdu': 'اعلیٰ سطح گردے کے مسائل کا اشارہ دے سکتی ہے۔ یہ گردے کے فنکشن کا ایک اہم نشان ہے۔'
      }
      // Add more importance explanations as needed...
    };
    return importance[test]?.[language] || importance[test]?.['English'] || '';
  };

  const handleReset = () => {
    setCurrentStep('upload');
    setUploadedFile(null);
    setDemographics(null);
    setAnalysisResults(null);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-center space-x-4">
          {(['upload', 'demographics', 'captcha', 'results'] as const).map((step, index) => (
            <div key={step} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep === step
                  ? 'bg-blue-600 text-white'
                  : index < (['upload', 'demographics', 'captcha', 'processing', 'results'] as const).indexOf(currentStep)
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {index + 1}
              </div>
              {index < 3 && (
                <div className={`w-16 h-1 mx-2 ${
                  index < (['upload', 'demographics', 'captcha', 'processing', 'results'] as const).indexOf(currentStep)
                    ? 'bg-green-600'
                    : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-2">
          <span className="text-sm text-gray-600 capitalize">
            {currentStep === 'processing' ? 'Processing' : currentStep}
          </span>
        </div>
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
        {currentStep === 'upload' && (
          <FileUploader onFileUpload={handleFileUpload} />
        )}
        
        {currentStep === 'demographics' && uploadedFile && (
          <DemographicsForm 
            onSubmit={handleDemographicsSubmit}
            fileName={uploadedFile.name}
          />
        )}
        
        {currentStep === 'captcha' && (
          <CaptchaVerification onSuccess={handleCaptchaSuccess} />
        )}
        
        {currentStep === 'processing' && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Analyzing Your Lab Report</h3>
            <p className="text-gray-600">
              Our AI is extracting key values and preparing your personalized summary...
            </p>
          </div>
        )}
        
        {currentStep === 'results' && analysisResults && demographics && (
          <ResultsDisplay 
            results={analysisResults}
            language={demographics.language}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
};

export default UploadInterface;