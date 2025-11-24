import React from 'react';
import { Loader2 } from 'lucide-react';

export const LoadingState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center">
      <Loader2 size={48} className="text-indigo-500 animate-spin mb-4" />
      <h3 className="text-xl font-medium text-slate-200">Sedang Menganalisis Tren...</h3>
      <p className="text-slate-500 mt-2 max-w-sm">
        Gemini sedang menyusun 50 studi kasus dan ide Python script untuk Anda. Ini mungkin memakan waktu beberapa detik.
      </p>
      
      <div className="w-64 h-1.5 bg-slate-800 rounded-full mt-6 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-1/2 animate-[shimmer_1.5s_infinite_linear] rounded-full"></div>
      </div>
    </div>
  );
};