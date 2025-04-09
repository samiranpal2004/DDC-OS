
import React, { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

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
  hideControls = false
}) => {
  const widgetRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Set initial position and make draggable
  useEffect(() => {
    const widget = widgetRef.current;
    const header = headerRef.current;
    if (!widget || !header) return;
    
    // Set initial position
    widget.style.left = `${position.x}px`;
    widget.style.top = `${position.y}px`;
    
    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true);
      const rect = widget.getBoundingClientRect();
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      widget.style.zIndex = '10';
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      const x = e.clientX - dragOffset.x;
      const y = e.clientY - dragOffset.y;
      
      // Constrain to window bounds
      const maxX = window.innerWidth - widget.offsetWidth;
      const maxY = window.innerHeight - widget.offsetHeight;
      
      const constrainedX = Math.max(0, Math.min(x, maxX));
      const constrainedY = Math.max(0, Math.min(y, maxY));
      
      widget.style.left = `${constrainedX}px`;
      widget.style.top = `${constrainedY}px`;
      
      setPosition({ x: constrainedX, y: constrainedY });
    };
    
    const handleMouseUp = () => {
      setIsDragging(false);
    };
    
    // Add event listeners to the header for dragging
    header.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Clean up
    return () => {
      header.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // Focus widget on click
  const handleWidgetClick = () => {
    if (!widgetRef.current) return;
    
    // Reduce z-index of all other widgets
    document.querySelectorAll('.widget').forEach((el) => {
      (el as HTMLElement).style.zIndex = '1';
    });
    
    // Set high z-index for this widget
    widgetRef.current.style.zIndex = '10';
  };

  return (
    <div 
      ref={widgetRef}
      className={cn(
        'glass-widget absolute animate-fade-in widget',
        hideControls ? 'widget-no-controls' : '',
        className
      )}
      style={{ width: `${width}px` }}
      onClick={handleWidgetClick}
    >
      <div 
        ref={headerRef} 
        className={cn(
          "widget-header", 
          hideControls ? 'p-3 justify-center' : ''
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
          "text-white font-medium",
          hideControls ? 'text-center' : ''
        )}>
          {title}
        </div>
        {!hideControls && (
          <div className="ml-auto">
            {/* Optional action icons could go here */}
          </div>
        )}
      </div>
      <div className="widget-body">
        {children}
      </div>
    </div>
  );
};

export default Widget;
