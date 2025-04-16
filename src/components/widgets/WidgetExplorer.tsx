import React, { useState, useRef, useEffect } from 'react';
import { Search, Grid, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';

interface WidgetExplorerProps {
  id: string;
  onClose: (id: string) => void;
  onAddWidget?: (type: string) => void;
  initialPosition?: { x: number; y: number };
}

interface ExplorerItem {
  id: string;
  name: string;
  icon: string;
  type: 'widget' | 'website';
  url?: string;
}

const widgets: ExplorerItem[] = [
  { id: 'academy', name: 'Academy', icon: '/icons/academy.svg', type: 'widget' },
  { id: 'ambience', name: 'Ambience', icon: '/icons/music.svg', type: 'widget' },
  { id: 'bookmarks', name: 'Bookmarks', icon: '/icons/bookmark.svg', type: 'widget' },
  { id: 'calculator', name: 'Calculator', icon: '/icons/calculator.svg', type: 'widget' },
  { id: 'clock', name: 'Clock', icon: '/icons/clock.svg', type: 'widget' },
  { id: 'converter', name: 'Converter', icon: '/icons/converter.svg', type: 'widget' },
  { id: 'feedback', name: 'Feedback', icon: '/icons/feedback.svg', type: 'widget' },
  { id: 'games', name: 'Games', icon: '/icons/games.svg', type: 'widget' },
  { id: 'google-calendar', name: 'Google Calendar', icon: '/icons/google-calendar.svg', type: 'widget' },
  { id: 'history', name: 'History', icon: '/icons/history.svg', type: 'widget' },
  { id: 'hormone', name: 'Hormone', icon: '/icons/hormone.svg', type: 'widget' },
  { id: 'my-dashy', name: 'My Dashy', icon: '/icons/dashy.svg', type: 'widget' },
  { id: 'news', name: 'News', icon: '/icons/news.svg', type: 'widget' },
  { id: 'notes', name: 'Notes', icon: '/icons/notes.svg', type: 'widget' },
  { id: 'outlook', name: 'Outlook Calendar', icon: '/icons/outlook.svg', type: 'widget' },
  { id: 'password', name: 'Password Generator', icon: '/icons/password.svg', type: 'widget' }
];

const websites: ExplorerItem[] = [
  { id: 'accuweather', name: 'AccuWeather', icon: '/icons/accuweather.svg', type: 'website', url: 'https://www.accuweather.com' },
  { id: 'airbnb', name: 'Airbnb', icon: '/icons/airbnb.svg', type: 'website', url: 'https://www.airbnb.com' },
  { id: 'amazon', name: 'Amazon', icon: '/icons/amazon.svg', type: 'website', url: 'https://www.amazon.com' },
  { id: 'booking', name: 'Booking.com', icon: '/icons/booking.svg', type: 'website', url: 'https://www.booking.com' },
  { id: 'chatgpt', name: 'ChatGPT', icon: '/icons/chatgpt.svg', type: 'website', url: 'https://chat.openai.com' },
  { id: 'cmc', name: 'CMC', icon: '/icons/cmc.svg', type: 'website', url: 'https://coinmarketcap.com' },
  { id: 'coingecko', name: 'CoinGecko', icon: '/icons/coingecko.svg', type: 'website', url: 'https://www.coingecko.com' },
  { id: 'cricbuzz', name: 'Cricbuzz', icon: '/icons/cricbuzz.svg', type: 'website', url: 'https://www.cricbuzz.com' },
  { id: 'espn', name: 'ESPN', icon: '/icons/espn.svg', type: 'website', url: 'https://www.espn.com' },
  { id: 'facebook', name: 'Facebook', icon: '/icons/facebook.svg', type: 'website', url: 'https://www.facebook.com' },
  { id: 'flipboard', name: 'Flipboard', icon: '/icons/flipboard.svg', type: 'website', url: 'https://flipboard.com' },
  { id: 'github', name: 'GitHub', icon: '/icons/github.svg', type: 'website', url: 'https://github.com' }
];

const WidgetExplorer: React.FC<WidgetExplorerProps> = ({ 
  id, 
  onClose, 
  onAddWidget,
  initialPosition = { x: window.innerWidth / 2 - 400, y: window.innerHeight / 2 - 300 }
}) => {
  const [activeTab, setActiveTab] = useState<'widgets' | 'websites'>('widgets');
  const [searchTerm, setSearchTerm] = useState('');
  const [position, setPosition] = useState(initialPosition);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  
  // Refs for DOM elements
  const explorerRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const filteredItems = (activeTab === 'widgets' ? widgets : websites).filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleItemClick = (item: ExplorerItem) => {
    if (item.type === 'website' && item.url) {
      window.location.href = item.url;
    } else if (item.type === 'widget' && onAddWidget) {
      onAddWidget(item.id);
    }
  };

  // Set up dragging functionality
  useEffect(() => {
    const explorer = explorerRef.current;
    const header = headerRef.current;
    if (!explorer || !header) return;
    
    // Set initial position
    explorer.style.left = `${position.x}px`;
    explorer.style.top = `${position.y}px`;
    
    // Set id attribute for direct DOM access if needed
    explorer.id = id;
    
    // Mouse event handlers
    const handleMouseDown = (e: MouseEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest('.widget-header')) {
        setIsDragging(true);
        const rect = explorer.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        });
        explorer.style.zIndex = '10';
        explorer.style.transition = 'none'; // Disable transitions while dragging for smoother movement
      }
    };
    
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      requestAnimationFrame(() => {
        const x = e.clientX - dragOffset.x;
        const y = e.clientY - dragOffset.y;
        
        // Get dock element to prevent explorer from going under it
        const dockElement = document.querySelector('.dock') as HTMLElement;
        const dockRect = dockElement ? dockElement.getBoundingClientRect() : null;
        
        // Constrain to window bounds
        const maxX = window.innerWidth - explorer.offsetWidth;
        const maxY = window.innerHeight - explorer.offsetHeight;
        
        // Calculate constrained position
        let constrainedX = Math.max(0, Math.min(x, maxX));
        let constrainedY = Math.max(0, Math.min(y, maxY));
        
        // If dock exists, prevent explorer from going under it
        if (dockRect) {
          // Add a buffer zone above the dock (20px)
          const dockBuffer = 20;
          const minY = dockRect.top - explorer.offsetHeight - dockBuffer;
          
          // If explorer would go under the dock, constrain it
          if (constrainedY > minY) {
            constrainedY = minY;
          }
        }
        
        explorer.style.left = `${constrainedX}px`;
        explorer.style.top = `${constrainedY}px`;
        
        setPosition({ x: constrainedX, y: constrainedY });
      });
    };
    
    const handleMouseUp = () => {
      if (isDragging) {
        explorer.style.transition = ''; // Re-enable transitions
        setIsDragging(false);
      }
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
  }, [isDragging, dragOffset, id, position]);

  // Focus explorer on click
  const handleExplorerClick = () => {
    if (!explorerRef.current) return;
    
    // Reduce z-index of all other widgets
    document.querySelectorAll('.widget').forEach((el) => {
      (el as HTMLElement).style.zIndex = '1';
    });
    
    // Set high z-index for this explorer
    explorerRef.current.style.zIndex = '10';
  };

  return (
    <div 
      ref={explorerRef}
      className="glass-widget absolute animate-fade-in widget"
      style={{ 
        width: '600px',
        maxHeight: '500px',
        overflow: 'hidden'
      }}
      onClick={handleExplorerClick}
    >
      <div 
        ref={headerRef}
        className="widget-header"
      >
        <div className="window-controls">
          <div className="control control-close" onClick={() => onClose(id)}></div>
          <div className="control control-minimize"></div>
          <div className="control control-maximize"></div>
        </div>
        <div className="text-white font-medium">Widget Explorer</div>
      </div>

      <div className="widget-body p-4">
        {/* Search */}
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            type="text"
            placeholder="Search widgets and websites..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-lg pl-10 pr-4 py-1.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-3">
          <button
            onClick={() => setActiveTab('widgets')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm",
              activeTab === 'widgets' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            )}
          >
            <Grid size={14} />
            <span>Widgets</span>
          </button>
          <button
            onClick={() => setActiveTab('websites')}
            className={cn(
              "flex items-center space-x-2 px-3 py-1.5 rounded-lg transition-colors text-sm",
              activeTab === 'websites' ? "bg-white/10 text-white" : "text-gray-400 hover:text-white"
            )}
          >
            <Globe size={14} />
            <span>Websites</span>
          </button>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 gap-3 overflow-y-auto max-h-[350px] pr-2">
          {filteredItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              className="flex flex-col items-center p-2 rounded-xl bg-white/5 hover:bg-white/10 transition-all hover:scale-105"
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-8 h-8 mb-1 rounded-xl"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = item.type === 'widget' ? '/icons/widget-default.svg' : '/icons/website-default.svg';
                }}
              />
              <span className="text-xs text-white text-center">{item.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WidgetExplorer; 