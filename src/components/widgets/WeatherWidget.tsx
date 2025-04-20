import React from 'react';
import { Cloud, CloudDrizzle, CloudRain, Sun, CloudLightning } from 'lucide-react';

const WeatherWidget = () => {
  return (
    <div className="widget-text">
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <span className="text-xl font-medium">New York</span>
          <span className="text-sm widget-text-muted">Partly Cloudy</span>
        </div>
        <div className="flex items-center">
          <Sun className="text-yellow-400 mr-1" size={24} />
          <span className="text-2xl font-bold">72°F</span>
        </div>
      </div>
      
      <div className="h-px bg-white/10 light:bg-black/10 w-full mb-3" />
      
      <div className="flex justify-between">
        <div className="flex flex-col items-center">
          <span className="text-xs widget-text-muted">Mon</span>
          <Cloud size={18} className="my-1" />
          <span className="text-sm">68°</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs widget-text-muted">Tue</span>
          <Sun size={18} className="my-1 text-yellow-400" />
          <span className="text-sm">72°</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs widget-text-muted">Wed</span>
          <CloudRain size={18} className="my-1 text-blue-300" />
          <span className="text-sm">65°</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs widget-text-muted">Thu</span>
          <CloudDrizzle size={18} className="my-1 text-blue-200" />
          <span className="text-sm">69°</span>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-xs widget-text-muted">Fri</span>
          <CloudLightning size={18} className="my-1 text-yellow-300" />
          <span className="text-sm">70°</span>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
