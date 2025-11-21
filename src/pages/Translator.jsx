import { motion } from 'framer-motion';
import { useState } from 'react';
import { Languages, Volume2, Copy, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';

const Translator = () => {
  const [inputText, setInputText] = useState('');
  const [outputText, setOutputText] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('hi');
  const [isTranslating, setIsTranslating] = useState(false);

  const languages = [
    { code: 'hi', name: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', name: 'Tamil', native: 'தமிழ்' },
    { code: 'bn', name: 'Bengali', native: 'বাংলা' },
    { code: 'te', name: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', name: 'Marathi', native: 'मराठी' },
    { code: 'en', name: 'English', native: 'English' },
  ];

  const doTranslate = async () => {
    if (!inputText.trim()) return;
    setIsTranslating(true);
    try {
      const res = await api.translate.text(inputText, selectedLanguage);
      setOutputText(res.translatedText || res.translated || JSON.stringify(res));
    } catch (err) {
      setOutputText('Translation error: ' + err.message);
    } finally {
      setIsTranslating(false);
    }
  };

  return (
    <div className="p-4">
      <div className="translator bg-white rounded-lg p-4 shadow">
        <textarea value={inputText} onChange={e=>setInputText(e.target.value)} className="w-full p-2 border rounded" rows={6} />
        <div className="mt-2 flex items-center gap-2">
          <select value={selectedLanguage} onChange={e=>setSelectedLanguage(e.target.value)} className="p-2 border rounded">
            {languages.map(l=> <option key={l.code} value={l.code}>{l.name} — {l.native}</option>)}
          </select>
          <button onClick={doTranslate} className="px-4 py-2 bg-indigo-600 text-white rounded">
            {isTranslating ? 'Translating...' : 'Translate'}
          </button>
        </div>

        <div className="mt-4">
          <label className="block mb-1 font-semibold">Result</label>
          <div className="p-3 border rounded min-h-[80px] bg-gray-50">{outputText}</div>
        </div>
      </div>
    </div>
  );
};

export default Translator;
