
export interface DesignStyle {
  name: string;
  emoji: string;
}

export interface ColorPaletteItem {
  name: string;
  hex: string;
}

export interface SuggestionItem {
  name: string;
  reason: string;
}

export interface DesignSuggestion {
  description: string;
  colorPalette: ColorPaletteItem[];
  items: SuggestionItem[];
}
