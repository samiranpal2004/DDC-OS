import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { useTheme } from '@/contexts/theme-context';

interface WidgetProps {
  id: string;
  type: string;
  title: string;
  children: React.ReactNode;
  initialPosition?: { x: number, y: number };
  onClose: (id: string) => void;
  width?: number;
  className?: string;
  hideControls?: boolean;
}

const Widget: React.FC<WidgetProps> = ({ 
  id, 
  title, 
  children, 
  initialPosition = { x: 100, y: 100 },
  onClose,
  width = 300,
  className,
  hideControls = false,
  type
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const { theme } = useTheme();
  
  useEffect(() => {
    const widget = widgetRef.current;
    const header = headerRef.current;
    if (!widget || !header) return;
    
    widget.style.left = `${position.x}px`;
    widget.style.top = `${position.y}px`;
    
    widget.id = id;
    
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      const rect = widget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      widget.style.zIndex = '10';
      widget.style.transition = 'none';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      requestAnimationFrame(() => {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        const maxX = window.innerWidth - widget.offsetWidth;
        const maxY = window.innerHeight - widget.offsetHeight;
        
        const constrainedX = Math.max(0, Math.min(x, maxX));
        const constrainedY = Math.max(0, Math.min(y, maxY));
        
        widget.style.left = `${constrainedX}px`;
        widget.style.top = `${constrainedY}px`;
        
        setPosition({ x: constrainedX, y: constrainedY });
      });
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        widget.style.transition = '';
        setIsDragging(false);
      }
    };
    
    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  const handleWidgetClick = () => {
    if (!widgetRef.current) return;
    
    document.querySelectorAll('.widget').forEach((el) => {
      (el as HTMLElement).style.zIndex = '1';
    });
    
    widgetRef.current.style.zIndex = '10';
  };

  return (
    <div 
      ref={widgetRef}
      id={id}
      className={cn(
        theme.style === 'glass' ? 'glass-widget' : 'solid-widget',
        'absolute animate-fade-in widget',
        hideControls ? 'widget-no-controls' : '',
        theme.mode === 'light' && theme.style === 'solid' ? 'light-solid-widget' : '',
        className
      )}
      style={{ width: `${width}px` }}
      onClick={handleWidgetClick}
    >
      <div 
        ref={headerRef} 
        className={cn(
          "widget-header", 
          hideControls ? 'p-3 justify-center' : '',
          "relative"
        )}
      >
        {!hideControls && (
          <div className="window-controls">
            <div className="control control-close" onClick={() => onClose(id)}></div>
            <div className="control control-minimize"></div>
            <div className="control control-maximize"></div>
          </div>
        )}
        <div className={cn(
          "widget-text font-medium",
          hideControls ? 'text-center' : ''
        )}>
          {title}
        </div>
        
        <button 
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
          className="absolute right-2 top-1/2 -translate-y-1/2 widget-text-muted hover:widget-text transition-colors"
          aria-label="Close widget"
        >
          <X size={16} />
        </button>
      </div>
      <div className="widget-body">
        {children}
      </div>
    </div>
  );
};

export default Widget;
