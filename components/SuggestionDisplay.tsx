
import React from 'react';
import type { DesignSuggestion } from '../types';
import { SparklesIcon } from './icons/SparklesIcon';

interface SuggestionDisplayProps {
  suggestion: DesignSuggestion | null;
}

const SuggestionItem: React.FC<{ title: string; description: string }> = ({ title, description }) => (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h4 className="font-semibold text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
);

const ColorPalette: React.FC<{ colors: { name: string; hex: string }[] }> = ({ colors }) => (
    <div className="mt-4">
        <h4 className="font-semibold text-gray-800 mb-2">Color Palette</h4>
        <div className="flex flex-wrap gap-3">
            {colors.map((color, index) => (
                <div key={index} className="flex items-center gap-2">
                    <div
                        className="w-8 h-8 rounded-full border-2 border-white shadow"
                        style={{ backgroundColor: color.hex }}
                    ></div>
                    <div>
                        <p className="text-sm font-medium text-gray-700">{color.name}</p>
                        <p className="text-xs text-gray-500">{color.hex}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
);


export const SuggestionDisplay: React.FC<SuggestionDisplayProps> = ({ suggestion }) => {
  if (!suggestion) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-[400px] text-center bg-gray-50 rounded-lg">
        <SparklesIcon className="w-16 h-16 text-gray-300" />
        <h3 className="mt-4 text-xl font-semibold text-gray-600">Your design ideas will appear here</h3>
        <p className="mt-1 text-gray-500">Upload a photo and select a style to get started.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-2">Design Concept</h3>
        <p className="text-gray-600">{suggestion.description}</p>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Key Recommendations</h3>
        <div className="space-y-3">
            {suggestion.items.map((item, index) => (
                <SuggestionItem key={index} title={item.name} description={item.reason} />
            ))}
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">Suggested Palette</h3>
        <ColorPalette colors={suggestion.colorPalette} />
      </div>
    </div>
  );
};
