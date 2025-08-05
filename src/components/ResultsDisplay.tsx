import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, Download, RotateCcw, Info, TrendingUp, TrendingDown, Minus, BarChart3, Activity, FileText, File, Database } from 'lucide-react';

interface LabResult {
  category: string;
  name: string;
  value: string;
  unit: string;
  status: 'normal' | 'high' | 'low' | 'critical';
  range: string;
  explanation: string;
  definition: string;
  importance: string;
}

interface ResultsDisplayProps {
  results: {
    summary: string;
    overallStatus: 'good' | 'attention' | 'concern';
    categories: {
      name: string;
      results: LabResult[];
      chartData?: number[];
    }[];
  };
  language: string;
  onReset: () => void;
}

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, language, onReset }) => {
  const [selectedTerm, setSelectedTerm] = useState<LabResult | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>(results.categories[0]?.name || '');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'normal':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'high':
        return <TrendingUp className="w-5 h-5 text-orange-600" />;
      case 'low':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-700" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'normal':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'high':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'low':
        return 'bg-red-50 border-red-200 text-red-800';
      case 'critical':
        return 'bg-red-100 border-red-300 text-red-900';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  const getOverallStatusColor = (status: string) => {
    switch (status) {
      case 'good':
        return 'bg-green-100 border-green-300 text-green-800';
      case 'attention':
        return 'bg-orange-100 border-orange-300 text-orange-800';
      case 'concern':
        return 'bg-red-100 border-red-300 text-red-800';
      default:
        return 'bg-gray-100 border-gray-300 text-gray-800';
    }
  };

  const SimpleChart: React.FC<{ data: number[]; status: string }> = ({ data, status }) => {
    const maxValue = Math.max(...data);
    const chartColor = status === 'normal' ? 'bg-green-500' : status === 'high' ? 'bg-orange-500' : 'bg-red-500';
    
    return (
      <div className="flex items-end space-x-1 h-12">
        {data.map((value, index) => (
          <div
            key={index}
            className={`${chartColor} rounded-t`}
            style={{
              height: `${(value / maxValue) * 100}%`,
              width: '8px'
            }}
          />
        ))}
      </div>
    );
  };

  const PieChart: React.FC<{ data: { normal: number; high: number; low: number; critical: number } }> = ({ data }) => {
    const total = data.normal + data.high + data.low + data.critical;
    const normalPercent = (data.normal / total) * 100;
    const highPercent = (data.high / total) * 100;
    const lowPercent = (data.low / total) * 100;
    const criticalPercent = (data.critical / total) * 100;

    return (
      <div className="flex items-center space-x-4">
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="40" fill="transparent" stroke="#e5e7eb" strokeWidth="8"/>
            <circle 
              cx="50" cy="50" r="40" fill="transparent" 
              stroke="#10b981" strokeWidth="8"
              strokeDasharray={`${normalPercent * 2.51} 251`}
              strokeDashoffset="0"
            />
            <circle 
              cx="50" cy="50" r="40" fill="transparent" 
              stroke="#f59e0b" strokeWidth="8"
              strokeDasharray={`${highPercent * 2.51} 251`}
              strokeDashoffset={`-${normalPercent * 2.51}`}
            />
            <circle 
              cx="50" cy="50" r="40" fill="transparent" 
              stroke="#ef4444" strokeWidth="8"
              strokeDasharray={`${lowPercent * 2.51} 251`}
              strokeDashoffset={`-${(normalPercent + highPercent) * 2.51}`}
            />
            <circle 
              cx="50" cy="50" r="40" fill="transparent" 
              stroke="#dc2626" strokeWidth="8"
              strokeDasharray={`${criticalPercent * 2.51} 251`}
              strokeDashoffset={`-${(normalPercent + highPercent + lowPercent) * 2.51}`}
            />
          </svg>
        </div>
        <div className="space-y-1 text-sm">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Normal ({data.normal})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>High ({data.high})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Low ({data.low})</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-700 rounded-full"></div>
            <span>Critical ({data.critical})</span>
          </div>
        </div>
      </div>
    );
  };

  const generateMedicalDisclaimer = (language: string) => {
    const disclaimers = {
      'English': 'IMPORTANT MEDICAL DISCLAIMER: This analysis is for educational purposes only and is not intended as medical advice, diagnosis, or treatment. The information provided should not replace professional medical consultation. Always consult with your qualified healthcare provider or primary care physician for medical decisions, treatment plans, and health concerns. Do not ignore professional medical advice or delay seeking treatment based on this educational content.',
      'Spanish': 'DESCARGO DE RESPONSABILIDAD MÉDICA IMPORTANTE: Este análisis es solo para fines educativos y no está destinado como consejo médico, diagnóstico o tratamiento. La información proporcionada no debe reemplazar la consulta médica profesional. Siempre consulte con su proveedor de atención médica calificado o médico de atención primaria para decisiones médicas, planes de tratamiento y problemas de salud. No ignore el consejo médico profesional ni retrase la búsqueda de tratamiento basándose en este contenido educativo.',
      'French': 'AVIS DE NON-RESPONSABILITÉ MÉDICALE IMPORTANT: Cette analyse est à des fins éducatives uniquement et n\'est pas destinée comme conseil médical, diagnostic ou traitement. Les informations fournies ne doivent pas remplacer une consultation médicale professionnelle. Consultez toujours votre fournisseur de soins de santé qualifié ou médecin de soins primaires pour les décisions médicales, les plans de traitement et les préoccupations de santé. N\'ignorez pas les conseils médicaux professionnels ou ne retardez pas la recherche de traitement basée sur ce contenu éducatif.',
      'Arabic': 'إخلاء مسؤولية طبية مهم: هذا التحليل لأغراض تعليمية فقط وليس المقصود منه كنصيحة طبية أو تشخيص أو علاج. المعلومات المقدمة لا يجب أن تحل محل الاستشارة الطبية المهنية. استشر دائماً مقدم الرعاية الصحية المؤهل أو طبيب الرعاية الأولية للقرارات الطبية وخطط العلاج والمخاوف الصحية. لا تتجاهل النصائح الطبية المهنية أو تؤخر طلب العلاج بناءً على هذا المحتوى التعليمي.',
      'Russian': 'ВАЖНОЕ МЕДИЦИНСКОЕ ПРЕДУПРЕЖДЕНИЕ: Этот анализ предназначен только для образовательных целей и не предназначен в качестве медицинской консультации, диагностики или лечения. Предоставленная информация не должна заменять профессиональную медицинскую консультацию. Всегда консультируйтесь с квалифицированным поставщиком медицинских услуг или врачом первичной медицинской помощи по медицинским решениям, планам лечения и проблемам со здоровьем. Не игнорируйте профессиональные медицинские советы и не откладывайте обращение за лечением на основе этого образовательного контента.',
      'Bengali': 'গুরুত্বপূর্ণ চিকিৎসা দাবিত্যাগ: এই বিশ্লেষণ শুধুমাত্র শিক্ষামূলক উদ্দেশ্যে এবং চিকিৎসা পরামর্শ, নির্ণয় বা চিকিৎসা হিসাবে উদ্দেশ্যে নয়। প্রদত্ত তথ্য পেশাদার চিকিৎসা পরামর্শ প্রতিস্থাপন করা উচিত নয়। চিকিৎসা সিদ্ধান্ত, চিকিৎসা পরিকল্পনা এবং স্বাস্থ্য উদ্বেগের জন্য সর্বদা আপনার যোগ্য স্বাস্থ্যসেবা প্রদানকারী বা প্রাথমিক যত্ন চিকিৎসকের সাথে পরামর্শ করুন। এই শিক্ষামূলক বিষয়বস্তুর ভিত্তিতে পেশাদার চিকিৎসা পরামর্শ উপেক্ষা করবেন না বা চিকিৎসা খোঁজায় বিলম্ব করবেন না।',
      'Hindi': 'महत्वपूर्ण चिकित्सा अस्वीकरण: यह विश्लेषण केवल शैक्षिक उद्देश्यों के लिए है और चिकित्सा सलाह, निदान या उपचार के रूप में अभिप्रेत नहीं है। प्रदान की गई जानकारी पेशेवर चिकित्सा परामर्श को प्रतिस्थापित नहीं करनी चाहिए। चिकित्सा निर्णयों, उपचार योजनाओं और स्वास्थ्य चिंताओं के लिए हमेशा अपने योग्य स्वास्थ्य सेवा प्रदाता या प्राथमिक देखभाल चिकित्सक से सलाह लें। इस शैक्षिक सामग्री के आधार पर पेशेवर चिकित्सा सलाह को नजरअंदाज न करें या उपचार की तलाश में देरी न करें।',
      'Urdu': 'اہم طبی دستبرداری: یہ تجزیہ صرف تعلیمی مقاصد کے لیے ہے اور طبی مشورہ، تشخیص یا علاج کے طور پر مقصود نہیں ہے۔ فراہم کردہ معلومات پیشہ ورانہ طبی مشاورت کی جگہ نہیں لے سکتیں۔ طبی فیصلوں، علاج کے منصوبوں اور صحت کی پریشانیوں کے لیے ہمیشہ اپنے قابل صحت کی دیکھ بھال فراہم کنندہ یا بنیادی نگہداشت کے ڈاکٹر سے مشورہ کریں۔ اس تعلیمی مواد کی بنیاد پر پیشہ ورانہ طبی مشورے کو نظرانداز نہ کریں یا علاج تلاش کرنے میں تاخیر نہ کریں۔'
    };
    return disclaimers[language] || disclaimers['English'];
  };

  const exportToPDF = async () => {
    const disclaimer = generateMedicalDisclaimer(language);
    const content = `
LAB REPORT ANALYSIS - ${new Date().toLocaleDateString()}
Language: ${language}
Generated: ${new Date().toLocaleString()}

${disclaimer}

OVERALL SUMMARY:
${results.summary}

DETAILED RESULTS BY CATEGORY:
${results.categories.map(category => 
  `\n${category.name.toUpperCase()}:\n${category.results.map(result => 
    `• ${result.name}: ${result.value} ${result.unit} (${result.status.toUpperCase()})\n  Normal Range: ${result.range}\n  Explanation: ${result.explanation}\n  Definition: ${result.definition}\n  Importance: ${result.importance}`
  ).join('\n\n')}`
).join('\n')}

${disclaimer}
    `.trim();

    const blob = new Blob([content], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-analysis-${Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToWord = async () => {
    const disclaimer = generateMedicalDisclaimer(language);
    const content = `
LAB REPORT ANALYSIS - ${new Date().toLocaleDateString()}
Language: ${language}
Generated: ${new Date().toLocaleString()}

${disclaimer}

OVERALL SUMMARY:
${results.summary}

DETAILED RESULTS BY CATEGORY:
${results.categories.map(category => 
  `\n${category.name.toUpperCase()}:\n${category.results.map(result => 
    `• ${result.name}: ${result.value} ${result.unit} (${result.status.toUpperCase()})\n  Normal Range: ${result.range}\n  Explanation: ${result.explanation}\n  Definition: ${result.definition}\n  Importance: ${result.importance}`
  ).join('\n\n')}`
).join('\n')}

${disclaimer}
    `.trim();

    const blob = new Blob([content], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-analysis-${Date.now()}.docx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const disclaimer = generateMedicalDisclaimer(language);
    const csvContent = `"Disclaimer","${disclaimer}"\n\n"Category","Test Name","Value","Unit","Status","Normal Range","Explanation","Definition","Importance"\n${
      results.categories.flatMap(category => 
        category.results.map(result => 
          `"${category.name}","${result.name}","${result.value}","${result.unit}","${result.status}","${result.range}","${result.explanation}","${result.definition}","${result.importance}"`
        )
      ).join('\n')
    }\n\n"Disclaimer","${disclaimer}"`;
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `lab-analysis-${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Calculate overall statistics for pie chart
  const overallStats = results.categories.reduce((acc, category) => {
    category.results.forEach(result => {
      acc[result.status] = (acc[result.status] || 0) + 1;
    });
    return acc;
  }, { normal: 0, high: 0, low: 0, critical: 0 });

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <Activity className="w-16 h-16 text-blue-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Your Complete Lab Analysis</h2>
        <p className="text-gray-600 text-lg">
          Comprehensive results in {language} — every test explained in simple terms
        </p>
      </div>

      {/* Overall Status */}
      <div className={`mb-8 p-6 rounded-xl border-2 ${getOverallStatusColor(results.overallStatus)}`}>
        <div className="flex items-center justify-center mb-4">
          {results.overallStatus === 'good' && <CheckCircle className="w-8 h-8 mr-3" />}
          {results.overallStatus === 'attention' && <AlertTriangle className="w-8 h-8 mr-3" />}
          {results.overallStatus === 'concern' && <XCircle className="w-8 h-8 mr-3" />}
          <h3 className="text-xl font-bold">
            {results.overallStatus === 'good' && 'Overall: Looking Good!'}
            {results.overallStatus === 'attention' && 'Overall: Needs Attention'}
            {results.overallStatus === 'concern' && 'Overall: Requires Follow-up'}
          </h3>
        </div>
        <p className="text-lg leading-relaxed text-center">{results.summary}</p>
      </div>

      {/* Overall Results Pie Chart */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">Overall Test Results Summary</h3>
        <div className="flex justify-center">
          <PieChart data={overallStats} />
        </div>
      </div>

      {/* Category Tabs */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2 justify-center">
          {results.categories.map((category) => (
            <button
              key={category.name}
              onClick={() => setActiveCategory(category.name)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeCategory === category.name
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      {/* Active Category Results */}
      {results.categories.map((category) => (
        <div
          key={category.name}
          className={`${activeCategory === category.name ? 'block' : 'hidden'}`}
        >
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center">
                <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                {category.name}
              </h3>
              <div className="flex items-center space-x-4">
                {category.chartData && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">Trend:</span>
                    <SimpleChart data={category.chartData} status="normal" />
                  </div>
                )}
                <PieChart data={category.results.reduce((acc, result) => {
                  acc[result.status] = (acc[result.status] || 0) + 1;
                  return acc;
                }, { normal: 0, high: 0, low: 0, critical: 0 })} />
              </div>
            </div>

            <div className="grid gap-4">
              {category.results.map((result, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${getStatusColor(result.status)}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(result.status)}
                      <div>
                        <button
                          onClick={() => setSelectedTerm(result)}
                          className="font-semibold text-left hover:underline flex items-center"
                        >
                          {result.name}
                          <Info className="w-4 h-4 ml-1 opacity-60" />
                        </button>
                        <p className="text-sm opacity-75">Normal Range: {result.range}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl">{result.value} {result.unit}</p>
                      <p className="text-sm font-medium capitalize">{result.status}</p>
                    </div>
                  </div>
                  <div className="bg-white bg-opacity-50 p-3 rounded">
                    <p className="text-sm font-medium mb-1">What this means:</p>
                    <p className="text-sm">{result.explanation}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={exportToPDF}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
          >
            <FileText className="w-4 h-4" />
            <span>PDF</span>
          </button>
          
          <button
            onClick={exportToWord}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            <File className="w-4 h-4" />
            <span>Word</span>
          </button>
          
          <button
            onClick={exportToCSV}
            className="flex items-center justify-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors"
          >
            <Database className="w-4 h-4" />
            <span>CSV</span>
          </button>
        </div>
        
        <button
          onClick={onReset}
          className="flex items-center justify-center space-x-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>Analyze Another Report</span>
        </button>
      </div>

      {/* Term Definition Modal */}
      {selectedTerm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold text-gray-900">{selectedTerm.name}</h3>
                <button
                  onClick={() => setSelectedTerm(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="w-6 h-6" />
                </button>
              </div>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">What is this test?</h4>
                  <p className="text-gray-700">{selectedTerm.definition}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Why is it important?</h4>
                  <p className="text-gray-700">{selectedTerm.importance}</p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Your Result</h4>
                  <div className={`p-3 rounded-lg ${getStatusColor(selectedTerm.status)}`}>
                    <p className="font-medium">{selectedTerm.value} {selectedTerm.unit} ({selectedTerm.status})</p>
                    <p className="text-sm mt-1">{selectedTerm.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Medical Disclaimer */}
      <div className="mt-8 p-4 bg-amber-50 border border-amber-200 rounded-lg">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="w-6 h-6 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-semibold text-amber-900 mb-1">Important Medical Disclaimer</h4>
            <p className="text-sm text-amber-800">{generateMedicalDisclaimer(language)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultsDisplay;