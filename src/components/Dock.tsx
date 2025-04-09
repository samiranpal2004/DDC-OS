
import { Clock, FileText, Cloud, Calculator, ListTodo, Search, Image, Quote } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface DockProps {
  onAddWidget: (type: string) => void;
  onToggleWallpaper: () => void;
}

const Dock: React.FC<DockProps> = ({ onAddWidget, onToggleWallpaper }) => {
  return (
    <div className="dock animate-fade-in">
      <TooltipProvider delayDuration={300}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('clock')}>
              <Clock size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Clock Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('notes')}>
              <FileText size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Notes Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('weather')}>
              <Cloud size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Weather Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('calculator')}>
              <Calculator size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Calculator Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('todo')}>
              <ListTodo size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>To-Do List Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('search')}>
              <Search size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Search Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={() => onAddWidget('quote')}>
              <Quote size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Quote Widget</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <button className="dock-item" onClick={onToggleWallpaper}>
              <Image size={20} />
            </button>
          </TooltipTrigger>
          <TooltipContent side="top">
            <p>Change Wallpaper</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};

export default Dock;
