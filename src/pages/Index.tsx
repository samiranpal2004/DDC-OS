
import { useState, useEffect } from 'react';
import Widget from '@/components/Widget';
import Dock from '@/components/Dock';
import WallpaperSelector from '@/components/WallpaperSelector';
import WaveBackground from '@/components/WaveBackground';
import ClockWidget from '@/components/widgets/ClockWidget';
import NotesWidget from '@/components/widgets/NotesWidget';
import WeatherWidget from '@/components/widgets/WeatherWidget';
import CalculatorWidget from '@/components/widgets/CalculatorWidget';
import TodoWidget from '@/components/widgets/TodoWidget';
import SearchWidget from '@/components/widgets/SearchWidget';
import QuoteWidget from '@/components/widgets/QuoteWidget';
import { Settings } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

const DEFAULT_WALLPAPERS = [
  'https://images.unsplash.com/photo-1662026911591-335639b11db6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwxfDB8MXxyYW5kb218MHx8fHx8fHx8MTY2MzY5MTI4MQ&ixlib=rb-1.2.1&q=80&w=1920',
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1604147706283-d7119b5b822c?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&q=80',
  'https://images.unsplash.com/photo-1659472372772-fd67793cda22?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80'
];

interface WidgetItem {
  id: string;
  type: string;
  position: { x: number; y: number };
}

const Index = () => {
  const [widgets, setWidgets] = useState<WidgetItem[]>([]);
  const [wallpapers, setWallpapers] = useState<string[]>([]);
  const [wallpaper, setWallpaper] = useState('');
  const [showWallpaperSelector, setShowWallpaperSelector] = useState(false);
  const [nextId, setNextId] = useState(1);
  
  // Load saved widgets and wallpapers on mount
  useEffect(() => {
    // Load saved wallpapers first
    const savedWallpapers = localStorage.getItem('dashy-wallpapers');
    if (savedWallpapers) {
      setWallpapers(JSON.parse(savedWallpapers));
    } else {
      setWallpapers(DEFAULT_WALLPAPERS);
      localStorage.setItem('dashy-wallpapers', JSON.stringify(DEFAULT_WALLPAPERS));
    }
    
    // Then load current wallpaper
    const savedWallpaper = localStorage.getItem('dashy-wallpaper');
    if (savedWallpaper) {
      setWallpaper(savedWallpaper);
    } else if (DEFAULT_WALLPAPERS.length > 0) {
      setWallpaper(DEFAULT_WALLPAPERS[0]);
    }
    
    // Load saved widgets
    const savedWidgets = localStorage.getItem('dashy-widgets');
    if (savedWidgets) {
      const parsedWidgets = JSON.parse(savedWidgets);
      setWidgets(parsedWidgets);
      
      // Set nextId based on highest existing id
      const highestId = parsedWidgets.reduce(
        (max: number, widget: WidgetItem) => {
          const id = parseInt(widget.id.split('-')[1], 10);
          return id > max ? id : max;
        },
        0
      );
      setNextId(highestId + 1);
    } else {
      // Add default widgets if none exist
      const defaultWidgets = [
        {
          id: 'widget-1',
          type: 'clock',
          position: { x: 100, y: 100 }
        },
        {
          id: 'widget-2',
          type: 'weather',
          position: { x: window.innerWidth - 400, y: 100 }
        },
        {
          id: 'widget-3',
          type: 'quote',
          position: { x: window.innerWidth / 2 - 150, y: window.innerHeight / 2 - 50 }
        }
      ];
      
      setWidgets(defaultWidgets);
      localStorage.setItem('dashy-widgets', JSON.stringify(defaultWidgets));
    }
  }, []);
  
  // Save widgets to localStorage when they change
  useEffect(() => {
    if (widgets.length > 0) {
      localStorage.setItem('dashy-widgets', JSON.stringify(widgets));
    }
  }, [widgets]);
  
  // Handle adding a new widget
  const handleAddWidget = (type: string) => {
    // Generate random position that doesn't overlap with existing widgets
    const padding = 20;
    const width = 300;
    const height = 200;
    
    let x = Math.random() * (window.innerWidth - width - padding * 2) + padding;
    let y = Math.random() * (window.innerHeight - height - padding * 2) + padding;
    
    const id = `widget-${nextId}`;
    
    const newWidget: WidgetItem = {
      id,
      type,
      position: { x, y }
    };
    
    setWidgets([...widgets, newWidget]);
    setNextId(nextId + 1);
    
    toast({
      description: `Added ${type} widget`,
      duration: 2000
    });
  };
  
  // Handle closing a widget
  const handleCloseWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };
  
  // Handle selecting a wallpaper
  const handleSelectWallpaper = (newWallpaper: string) => {
    setWallpaper(newWallpaper);
    localStorage.setItem('dashy-wallpaper', newWallpaper);
    setShowWallpaperSelector(false);
  };
  
  // Handle adding a custom wallpaper
  const handleAddWallpaper = (newWallpaper: string) => {
    const updatedWallpapers = [...wallpapers, newWallpaper];
    setWallpapers(updatedWallpapers);
    localStorage.setItem('dashy-wallpapers', JSON.stringify(updatedWallpapers));
  };
  
  // Toggle wallpaper selector
  const toggleWallpaperSelector = () => {
    setShowWallpaperSelector(!showWallpaperSelector);
  };
  
  // Render the appropriate widget content based on type
  const renderWidgetContent = (type: string) => {
    switch (type) {
      case 'clock':
        return <ClockWidget />;
      case 'notes':
        return <NotesWidget />;
      case 'weather':
        return <WeatherWidget />;
      case 'calculator':
        return <CalculatorWidget />;
      case 'todo':
        return <TodoWidget />;
      case 'search':
        return <SearchWidget />;
      case 'quote':
        return <QuoteWidget />;
      default:
        return <div className="text-white">Unknown widget type</div>;
    }
  };
  
  // Get widget title based on type
  const getWidgetTitle = (type: string) => {
    const titles: Record<string, string> = {
      clock: 'Clock',
      notes: 'Quick Notes',
      weather: 'Weather',
      calculator: 'Calculator',
      todo: 'To-Do List',
      search: 'Search',
      quote: 'Quote'
    };
    
    return titles[type] || 'Widget';
  };
  
  // Get widget width based on type
  const getWidgetWidth = (type: string) => {
    const widths: Record<string, number> = {
      calculator: 260,
      clock: 280,
      quote: 320,
      notes: 300,
      weather: 300,
      todo: 300,
      search: 300
    };
    
    return widths[type] || 300;
  };
  
  // Check if we should hide window controls
  const shouldHideControls = (type: string) => {
    return ['clock', 'weather', 'quote'].includes(type);
  };
  
  return (
    <div 
      className="min-h-screen overflow-hidden relative"
      style={{ 
        backgroundImage: `url(${wallpaper})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50" />
      <WaveBackground />
      
      <div className="fixed right-4 top-4 text-white text-lg z-10">
        {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </div>
      
      {/* Global search at top */}
      <div className="fixed top-2 left-1/2 transform -translate-x-1/2 w-96 z-10">
        <SearchWidget />
      </div>
      
      {/* Widgets */}
      {widgets.map(widget => (
        <Widget
          key={widget.id}
          id={widget.id}
          type={widget.type}
          title={getWidgetTitle(widget.type)}
          initialPosition={widget.position}
          onClose={handleCloseWidget}
          width={getWidgetWidth(widget.type)}
          hideControls={shouldHideControls(widget.type)}
        >
          {renderWidgetContent(widget.type)}
        </Widget>
      ))}
      
      {/* Dock */}
      <Dock
        onAddWidget={handleAddWidget}
        onToggleWallpaper={toggleWallpaperSelector}
      />
      
      {/* Wallpaper selector */}
      <WallpaperSelector
        isVisible={showWallpaperSelector}
        wallpapers={wallpapers}
        onSelect={handleSelectWallpaper}
        onAddWallpaper={handleAddWallpaper}
      />
    </div>
  );
};

export default Index;
