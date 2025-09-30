
import React from 'react';
import type { DesignStyle } from '../types';

interface StyleSelectorProps {
  styles: DesignStyle[];
  selectedStyle: string;
  onSelectStyle: (styleName: string) => void;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ styles, selectedStyle, onSelectStyle }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Choose a design style
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {styles.map((style) => (
          <button
            key={style.name}
            onClick={() => onSelectStyle(style.name)}
            className={`text-center p-3 rounded-lg border-2 transition-all duration-200 ${
              selectedStyle === style.name
                ? 'bg-indigo-600 border-indigo-600 text-white shadow-md'
                : 'bg-white border-gray-300 text-gray-700 hover:border-indigo-500 hover:text-indigo-600'
            }`}
          >
            <span className="text-2xl">{style.emoji}</span>
            <p className="font-semibold text-sm mt-1">{style.name}</p>
          </button>
        ))}
      </div>
    </div>
  );
};
