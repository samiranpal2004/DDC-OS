import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface ColorSwatchProps {
  color: string;
  name: string;
  selected: boolean;
  onClick: () => void;
}

const ColorSwatch: React.FC<ColorSwatchProps> = ({ color, name, selected, onClick }) => {
  return (
    <button
      type="button"
      className="relative flex flex-col items-center"
      onClick={onClick}
      title={name}
      aria-label={`Select ${name} theme`}
    >
      <div 
        className={cn(
          "w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all",
          selected ? "border-primary scale-110" : "border-transparent hover:scale-105"
        )}
        style={{ backgroundColor: color }}
      >
        {selected && <Check className="h-4 w-4 text-white stroke-[3]" />}
      </div>
      <span className="text-xs mt-1">{name}</span>
    </button>
  );
};

export default ColorSwatch;
