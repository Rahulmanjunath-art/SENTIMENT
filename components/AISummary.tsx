
import React from 'react';
import { Sparkles, ThumbsUp, ThumbsDown, Info } from 'lucide-react';
import { AISummaryData } from '../types';

interface AISummaryProps {
  data: AISummaryData | null;
  isLoading: boolean;
}

const AISummary: React.FC<AISummaryProps> = ({ data, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100 animate-pulse">
        <div className="h-6 w-48 bg-indigo-200 rounded mb-4"></div>
        <div className="space-y-3">
          <div className="h-4 bg-indigo-100 rounded w-full"></div>
          <div className="h-4 bg-indigo-100 rounded w-5/6"></div>
          <div className="h-4 bg-indigo-100 rounded w-4/6"></div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gradient-to-br from-white to-indigo-50/30 rounded-2xl p-6 border border-indigo-100 shadow-sm overflow-hidden relative">
      <div className="absolute top-0 right-0 p-4">
        <Sparkles className="text-indigo-400 opacity-20" size={80} />
      </div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 bg-indigo-600 rounded-lg">
            <Sparkles className="text-white" size={16} />
          </div>
          <h3 className="text-lg font-bold text-gray-900">RevieAI Smart Summary</h3>
        </div>

        <p className="text-gray-700 leading-relaxed mb-6 italic">
          "{data.summary}"
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-green-700 font-semibold text-sm">
              <ThumbsUp size={16} />
              <h4>What people love</h4>
            </div>
            <ul className="space-y-2">
              {data.pros.map((pro, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-green-500 shrink-0"></span>
                  {pro}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-red-700 font-semibold text-sm">
              <ThumbsDown size={16} />
              <h4>Room for improvement</h4>
            </div>
            <ul className="space-y-2">
              {data.cons.map((con, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-600">
                  <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0"></span>
                  {con}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-indigo-100 flex flex-wrap gap-2">
          {data.topKeywords.map((tag, i) => (
            <span key={i} className="text-xs px-3 py-1 bg-white border border-indigo-200 text-indigo-700 rounded-full font-medium">
              #{tag}
            </span>
          ))}
          <div className="ml-auto flex items-center gap-1.5 text-xs text-indigo-600 font-semibold bg-indigo-100/50 px-3 py-1 rounded-full">
            <Info size={12} />
            Sentiment: {data.overallSentiment}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISummary;
